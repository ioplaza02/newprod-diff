// =============================================================
//  新商品 差分カレンダー：毎朝の自動データ取得
//  ・公式サイトの新商品ニュースから直近 KEEP_DAYS 日分を拾う
//  ・旧型を探す（旧型ページ備考欄の「後継品」→ 型番ルール の順）
//  ・新旧の仕様表・※注記・容量ラインナップ・商品画像を取り込む
//  ・結果を data/data.json に書き出す（画面はこれを読む）
//  Node.js 20 以降、外部ライブラリなし（fetch のみ）
// =============================================================
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://www.iodata.jp";
const KEEP_DAYS = 60;
const WAIT_MS = +process.env.WAIT_MS || 1200;                       // 公式サイトに負担をかけないよう、1件ずつ間をあける
const UA = "NewprodDiffBot/1.0 (internal tool; GitHub Actions)";
const OUT = path.join(ROOT, "data", "data.json");
const IMG_DIR = path.join(ROOT, "img");
const DRY = process.argv.includes("--dry");  // --dry：ファイルを書かずに結果だけ表示

// ---------- 日付（日本時間） ----------
const nowJST = process.env.TODAY ? new Date(process.env.TODAY + "T00:00:00Z") : new Date(Date.now() + 9 * 3600e3);
const ymd = d => d.toISOString().slice(0, 10);
const TODAY = ymd(nowJST);
const daysAgo = s => Math.round((Date.parse(TODAY) - Date.parse(s)) / 86400e3);

// ---------- 取得 ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cache = new Map();
let requests = 0;
async function get(url, binary = false) {
  const u = url.startsWith("http") ? url : BASE + url;
  const key = (binary ? "bin:" : "") + u;
  if (cache.has(key)) return cache.get(key);
  await sleep(WAIT_MS); requests++;
  let res = null;
  for (let t = 0; t < 2 && !res; t++) {
    try { res = await fetch(u, { headers: { "User-Agent": UA } }); }
    catch (e) { if (t === 1) { console.warn("  取得失敗:", u, e.message); } else await sleep(3000); }
  }
  const out = !res || !res.ok ? null : binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
  cache.set(key, out);
  return out;
}

// ---------- HTML を読むための小さな道具 ----------
const decode = s => s
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
const stripNoise = html => html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
const text = html => decode(stripNoise(html).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const titleOf = html => text((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);

function tablesOf(html) {
  const out = [], re = /<table\b([^>]*)>([\s\S]*?)<\/table>/gi; let m;
  while ((m = re.exec(html))) out.push({ attrs: m[1], inner: m[2], start: m.index, end: re.lastIndex });
  return out;
}
function rowsOf(tableInner) {
  const rows = [], re = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi; let m;
  while ((m = re.exec(tableInner))) {
    const cells = [], cre = /<(th|td)\b([^>]*)>([\s\S]*?)<\/\1>/gi; let c;
    while ((c = cre.exec(m[1]))) {
      const rs = (c[2].match(/rowspan\s*=\s*["']?(\d+)/i) || [, "1"])[1];
      cells.push({ tag: c[1].toLowerCase(), rowspan: +rs, html: c[3], text: text(c[3]) });
    }
    rows.push(cells);
  }
  return rows;
}
// 仕様表 → 「見出し > 見出し | 値」の行（画面側と同じ書式）
function specRows(tableInner) {
  const out = []; let carry = [];
  for (const cells of rowsOf(tableInner)) {
    carry = carry.filter(c => c.left > 0);
    const lab = carry.map(c => c.text); carry.forEach(c => c.left--);
    const vals = [];
    for (const c of cells) {
      if (c.tag === "th") { lab.push(c.text); if (c.rowspan > 1) carry.push({ text: c.text, left: c.rowspan - 1 }); }
      else vals.push(c.text);
    }
    if (!lab.length && !vals.length) continue;
    out.push(lab.join(" > ") + " | " + vals.join(" ／ "));
  }
  return out;
}
// 表のすぐ後ろにある ※注記（番号つき／番号なし）
const JUNK = /機種・モデル名|インフォメーション デスク/;
function notesAfter(html, from) {
  let seg = html.slice(from, from + 30000);
  const stop = seg.search(/<table\b|<h2\b|<h3\b/i);
  if (stop >= 0) seg = seg.slice(0, stop);
  const t = decode(stripNoise(seg).replace(/<(br|\/p|\/li|\/div|\/dd|\/dt)\b[^>]*>/gi, "\n").replace(/<[^>]+>/g, " "));
  return t.replace(/[ \t　]+/g, " ").split(/(?=※)/).map(s => s.replace(/\s+/g, " ").trim()).filter(s => s.startsWith("※") && s.length > 2 && !JUNK.test(s));
}

// ---------- 商品ページ ----------
function productInfo(html) {
  const t = tablesOf(html).find(x => /product-info/.test(x.attrs));
  if (!t) return { codes: [], lineup: [], successors: [], successorLinks: [] };
  const codes = [], lineup = [], successors = [], successorLinks = [];
  for (const cells of rowsOf(t.inner)) {
    const row = cells.map(c => c.text).join(" ");
    const m = row.match(/([A-Z][A-Z0-9]*-[A-Z0-9][A-Z0-9\-\/.]*)\s+(\d{13})\s*(\S*)/);
    if (!m) continue;
    codes.push(m[1]);
    const st = (row.match(/在庫限り|\d{4}\/\d{1,2}\/\d{1,2}生産終了|受注生産/) || [""])[0];
    lineup.push({ code: m[1], spec: m[3] || "", status: st });
    for (const s of row.matchAll(/後継品\s*([A-Z][A-Z0-9]*-[A-Z0-9][A-Z0-9\-\/.]*)/g)) successors.push(s[1]);
    for (const c of cells) for (const a of c.html.matchAll(/href=["']([^"']*\/product\/[^"']+)["']/gi)) if (/後継品/.test(c.text)) successorLinks.push(a[1]);
  }
  return { codes, lineup, successors: [...new Set(successors)], successorLinks: [...new Set(successorLinks)] };
}
const seriesDir = href => { const m = href.match(/(\/product\/[^/]+\/[^/]+\/[^/]+\/)/); return m ? m[1] : null; };
const sameCode = (a, b) => { const n = s => s.replace(/\/U$/, ""); return n(a) === n(b); };

async function loadProduct(dir) {
  const html = await get(dir);
  if (!html) return null;
  const t = titleOf(html).split(" | ");
  const name = (t[0] || "").replace(/シリーズ$/, "").trim();
  return { dir, slug: dir.split("/").filter(Boolean).pop(), name, category: (t[1] || "").trim(), html, ...productInfo(html) };
}

// 仕様（spec.htm を優先、無ければ商品ページ）
async function loadSpec(dir) {
  for (const p of [dir + "spec.htm", dir]) {
    const html = await get(p);
    if (!html) continue;
    let tabs = tablesOf(html).filter(t => !/product-info/.test(t.attrs));
    const main = tabs.find(t => /型番／筐体色/.test(text(t.inner)));
    if (main) tabs = [main];
    else if (p === dir) continue;                 // 商品ページで仕様表が見つからなければ使わない
    if (!tabs.length) continue;
    const rows = tabs.flatMap(t => specRows(t.inner));
    const num = {}, general = [];
    for (const t of tabs) for (const n of notesAfter(html, t.end)) {
      const nm = n.match(/^※\s*(\d+)\s+(.+)/);
      if (nm) { if (!num[nm[1]]) num[nm[1]] = nm[2]; }
      else if (!general.includes(n)) general.push(n);
    }
    if (rows.length >= 5) return { rows, num, general, url: BASE + p };
  }
  return null;
}

// ---------- 旧型さがし ----------
function ruleCandidates(slug) {             // 「ひとつ前の世代らしい型番」から順に試す
  const s = new Set(), last = slug.slice(-1);
  if (/[b-z]/.test(last)) s.add(slug.slice(0, -1) + String.fromCharCode(last.charCodeAt(0) - 1));  // utac → utab
  if (/[2-9]/.test(last)) s.add(slug.slice(0, -1) + (+last - 1));                                    // xx3 → xx2
  if (slug.endsWith("-f")) s.add(slug.slice(0, -2));
  s.add(slug.slice(0, -1));                                                                          // u431d2 → u431d
  s.delete(slug);
  return [...s].filter(x => x.length > 3 && !x.endsWith("-"));
}
async function findPredecessor(newP) {
  const base = newP.dir.replace(/[^/]+\/$/, "");
  const isNew = codes => codes.some(c => newP.codes.some(n => sameCode(c, n)));
  for (const c of ruleCandidates(newP.slug)) {
    let p = await loadProduct(base + c + "/");
    if (!p || !p.codes.length) continue;
    // 後継品の表記を、新商品にたどり着くまで最大3回たどる
    const chain = [p];
    for (let hop = 0; hop < 3; hop++) {
      if (isNew(p.successors)) {
        const pred = chain[chain.length - 1];
        const via = chain.length > 1 ? chain.slice(0, -1).map(x => x.name) : [];
        return { p: pred, how: "official",
          howText: `旧型ページ備考欄の「後継品${p.successors.find(s => newP.codes.some(n => sameCode(s, n)))}」` + (via.length ? `（型番ルールで見つけた ${via.join("→")} から後継品の表記をたどって特定）` : ""),
          caution: via.length ? `${[...via, pred.name, newP.name].join(" → ")} の順に代替わりしているため、直前の旧型は ${pred.name} と判定しました。` : "" };
      }
      const next = p.successorLinks.map(seriesDir).find(d => d && d !== p.dir && d !== newP.dir);
      if (!next) break;
      const np = await loadProduct(next);
      if (!np || !np.codes.length) break;
      chain.push(np); p = np;
    }
    // 後継品の表記は無いが、型番ルールで見つかった（旧型がまだ在庫限りになっていない等）
    if (!chain[0].successors.length) return { p: chain[0], how: "rule", howText: `型番ルール（${newP.slug} → ${c}）`, caution: "" };
  }
  return null;
}

// ---------- ニュース ----------
async function newsInWindow() {
  const years = [...new Set([TODAY.slice(0, 4), ymd(new Date(Date.parse(TODAY) - KEEP_DAYS * 86400e3)).slice(0, 4)])];
  const list = [];
  for (const y of years) {
    const html = await get(`/news/index${y}.htm`);
    if (!html) continue;
    // ニュースへのリンクごとに、その直前に書かれている日付（"20261111" の形）を使う
    const dates = [...html.matchAll(/"(20\d{6})"/g)].map(m => ({ pos: m.index, v: m[1] }));
    for (const m of html.matchAll(/href=["']([^"']*\/news\/\d{4}\/newprod\/[^"']+\.htm)["']/g)) {
      const dm = dates.filter(x => x.pos < m.index).pop();
      if (!dm) continue;
      const d = `${dm.v.slice(0, 4)}-${dm.v.slice(4, 6)}-${dm.v.slice(6, 8)}`;
      const href = m[1].replace(/^https?:\/\/www\.iodata\.jp/, "");
      if (daysAgo(d) <= KEEP_DAYS && daysAgo(d) >= 0 && !list.some(x => x.href === href)) list.push({ date: d, href });
    }
  }
  return list.sort((a, b) => b.date.localeCompare(a.date));
}
async function productsInNews(href) {
  const html = await get(href);
  if (!html) return [];
  const dirs = [];
  for (const a of html.matchAll(/href=["']([^"']*\/product\/[^"']+)["']/gi)) {
    const d = seriesDir(a[1].replace(/^https?:\/\/www\.iodata\.jp/, ""));
    if (d && !/memet|iotrustservice|\/list_/.test(d) && !dirs.includes(d)) dirs.push(d);
  }
  return dirs;
}

// ---------- 画像 ----------
async function saveImage(slug) {
  const buf = await get(`/image/${slug}_l.jpg`, true);
  if (!buf || DRY) return buf ? `img/${slug}.jpg` : null;
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.writeFile(path.join(IMG_DIR, `${slug}.jpg`), buf);
  return `img/${slug}.jpg`;
}
const lineupText = l => l.map(x => x.code + (x.status ? `（${x.status}）` : "")).join("・");

// ---------- 本体 ----------
async function main() {
  console.log(`== ${TODAY} 取得開始（直近${KEEP_DAYS}日）`);
  const news = await newsInWindow();
  console.log(`新商品ニュース ${news.length}件`);
  const pairs = [], unmatched = [], specs = {};
  for (const n of news) {
    const dirs = await productsInNews(n.href);
    for (const dir of dirs) {
      const np = await loadProduct(dir);
      if (!np || !np.codes.length) continue;
      if (pairs.some(p => p.id === np.slug) || unmatched.some(u => u.id === np.slug)) continue;
      const found = await findPredecessor(np);
      if (!found) { unmatched.push({ id: np.slug, date: n.date, name: np.name, url: BASE + n.href }); console.log(`  × ${np.name}（旧型なし）`); continue; }
      const op = found.p;
      const [ns, os] = [await loadSpec(np.dir), await loadSpec(op.dir)];
      if (!ns || !os) { unmatched.push({ id: np.slug, date: n.date, name: np.name, url: BASE + n.href }); console.log(`  × ${np.name}（仕様表を読めず）`); continue; }
      specs[np.name] = ns; specs[op.name] = os;
      const [nImg, oImg] = [await saveImage(np.slug), await saveImage(op.slug)];
      pairs.push({ id: np.slug, date: n.date, category: np.category || op.category,
        oldModel: op.name, newModel: np.name, oldImg: oImg, newImg: nImg,
        how: found.how, howText: found.howText, caution: found.caution || "",
        oldUrl: os.url, newUrl: ns.url, oldPage: BASE + op.dir, newPage: BASE + np.dir, newsUrl: BASE + n.href,
        lineup: { old: lineupText(op.lineup), new: lineupText(np.lineup) } });
      console.log(`  ○ ${op.name} → ${np.name}（${found.how}）`);
    }
  }
  const data = { updatedAt: TODAY, keepDays: KEEP_DAYS, pairs, unmatched, specs };
  console.log(`比較 ${pairs.length}組／旧型なし ${unmatched.length}件／アクセス ${requests}回`);

  // 健全性チェック：前回より極端に減っていたら書き換えずに止める（サイトの作りが変わった可能性）
  let prev = null;
  try { prev = JSON.parse(await fs.readFile(OUT, "utf8")); } catch {}
  if (prev && prev.pairs.length >= 4 && pairs.length < prev.pairs.length * 0.5) {
    console.error(`!! 比較の件数が前回 ${prev.pairs.length}組 → 今回 ${pairs.length}組 に大きく減りました。公式サイトの作りが変わった可能性があるため、データを更新せずに終了します。`);
    process.exit(1);
  }
  if (news.length === 0) { console.error("!! 新商品ニュースを1件も読めませんでした。データを更新せずに終了します。"); process.exit(1); }
  if (DRY) { console.log(JSON.stringify(pairs.map(p => [p.oldModel, p.newModel, p.how]), null, 1)); return; }
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(data, null, 1));
  console.log("data/data.json を更新しました");
}
main().catch(e => { console.error(e); process.exit(1); });
