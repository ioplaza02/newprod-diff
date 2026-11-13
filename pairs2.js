/* ============================================================
   追加分（表示期間を60日に広げたことで対象になった新商品：2026/9/14〜10/13 発表）
   ============================================================ */
const BIZ_NOTES = {
  "テレビ":{text:"新型の仕様表で新設された項目（値は「-」）"},
  "ゲーム機":{text:"新型の仕様表で新設された項目"},
  "その他":{text:"新型は当社製LAN DISKを「その他」の対応機器として記載（旧型は対応機種欄に記載）"},
  "保証期間":{text:"保証期間が変わっています（旧型 5年 → 新型 3年）"},
  "対応有償保証（ISS）":{text:"新型の仕様表にはこの項目がありません"},
  "グリーン購入法":{text:"新型の仕様表で新設された項目"},
  "盗難防止用ホール":{text:"新型の仕様表で新設された項目"}
};
PAIRS.push(
  { id:"hdja-utnc", date:"2026-10-01", category:"法人向け外付けハードディスク（NAS用HDD搭載）", kind:"hdd", dup:"pc",
    oldModel:"HDJA-UTNB", newModel:"HDJA-UTNC", oldImg:"hdja-utnb", newImg:"hdja-utnb",
    how:"official", howText:"旧型ページ備考欄の「後継品HDJA-UTN1C」など",
    oldUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdja-utnb/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdja-utnc/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdja-utnc.htm",
    lineup:{old:"1TB・2TB・3TB・4TB・6TB・8TB・12TB・16TB・20TB・24TB・32TB（すべて在庫限り）", new:"1TB・2TB・3TB・4TB・6TB・8TB・12TB・16TB・20TB・24TB・32TB"},
    notes:Object.assign({}, BIZ_NOTES), generalHints:HDD_GENERAL_HINTS },
  { id:"hdja-utnldc", date:"2026-10-01", category:"法人向け外付けハードディスク（LAN DISKバックアップ用）", kind:"hdd", dup:"pc",
    oldModel:"HDJA-UTN/LDB", newModel:"HDJA-UTN/LDC", oldImg:"hdja-utnb", newImg:"hdja-utnb",
    how:"official", howText:"旧型ページ備考欄の「後継品HDJA-UTN1/LDC」など",
    oldUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdja-utnldb/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdja-utnldc/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdja-utnldc.htm",
    lineup:{old:"1TB・2TB・3TB・4TB・6TB・8TB・12TB・16TB・20TB・24TB・32TB（すべて在庫限り）", new:"1TB・2TB・3TB・4TB・6TB・8TB・12TB・16TB・20TB・24TB・32TB"},
    notes:Object.assign({}, BIZ_NOTES), generalHints:HDD_GENERAL_HINTS },
  { id:"hdw-utnc", date:"2026-10-01", category:"法人向け2ドライブ外付けハードディスク（RAID 1対応）", kind:"hdd", dup:"pc",
    oldModel:"HDW-UTNB", newModel:"HDW-UTNC", oldImg:"hdw-utnb", newImg:"hdw-utnb",
    how:"official", howText:"旧型ページ備考欄の「後継品HDW-UTN2C」など",
    oldUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdw-utnb/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/bizhdd/hdw-utnc/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdw-utnc.htm",
    lineup:{old:"2TB・4TB・6TB・8TB・12TB・16TB・24TB・32TB・40TB・48TB・64TB（すべて在庫限り）", new:"2TB・4TB・6TB・8TB・12TB・16TB・24TB・32TB・40TB・48TB・64TB"},
    notes:Object.assign({}, BIZ_NOTES, {"その他":{}, "盗難防止用ホール":{}, "グリーン購入法":{}, "対応モード":{text:"新型の仕様表で新設された項目（出荷時設定はRAID 1）"}}), generalHints:HDD_GENERAL_HINTS },
  { id:"hd4-utnc", date:"2026-10-01", category:"法人向け4ドライブ外付けハードディスク（RAID 5対応）", kind:"hdd", dup:"pc",
    oldModel:"HD4-UTN", newModel:"HD4-UTNC", oldImg:"hd4-utn", newImg:"hd4-utn",
    how:"official", howText:"旧型ページ備考欄の「後継品HD4-UTN8C」など",
    oldUrl:"https://www.iodata.jp/product/hdd/bizhdd/hd4-utn/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/bizhdd/hd4-utnc/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hd4-utnc.htm",
    lineup:{old:"8TB・16TB・32TB・48TB・80TB・96TB・128TB（すべて在庫限り）", new:"8TB・16TB・32TB・48TB・80TB・96TB・128TB"},
    notes:Object.assign({}, BIZ_NOTES, {
      "出荷時設定":{text:"新型では「対応モード」欄の中に「出荷時設定はRAID 5」と記載"},
      "盗難防止用ホール":{}, "グリーン購入法":{},
      "設置条件":{text:"新型の仕様表で新設された項目"}, "ファン":{text:"新型の仕様表で新設された項目"}
    }), generalHints:HDD_GENERAL_HINTS },
  { id:"hdd-utc", date:"2026-10-01", category:"外付けハードディスク（テレビ録画＆パソコン両対応）", kind:"hdd", dup:"pctv",
    oldModel:"HDD-UTB", newModel:"HDD-UTC", oldImg:"hdd-utb", newImg:"hdd-utb",
    how:"official", howText:"旧型ページ備考欄の「後継品HDD-UT1KC」など",
    oldUrl:"https://www.iodata.jp/product/hdd/hdd/hdd-utb/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/hdd/hdd-utc/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdd-utc.htm",
    lineup:{old:"ブラック 1TB・2TB・4TB・6TB・8TB／ホワイト 2TB・4TB（すべて在庫限り）", new:"ブラック 1TB・2TB・4TB・6TB・8TB／ホワイト 2TB・4TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {
      "その他":{text:"新型は当社製LAN DISKを対応機器として記載（旧型はテレビチューナー類を記載）"},
      "容量":{text:"新型の仕様表で新設された項目"}
    }), generalHints:HDD_GENERAL_HINTS }
);
UNMATCHED.push(
  {date:"2026-10-07", name:"スマートCDプレーヤー CD-P1", url:"https://www.iodata.jp/news/2026/newprod/cd-p1.htm"},
  {date:"2026-10-07", name:"マルチギガ対応スイッチングハブ R-BSH-X2Q4SR", url:"https://www.iodata.jp/news/2026/newprod/r-bsh-x2q4sr.htm"},
  {date:"2026-10-07", name:"オンライン資格確認端末 MPC-NCI3W2/QC", url:"https://www.iodata.jp/news/2026/newprod/mpc-nci3w2qc.htm"},
  {date:"2026-10-01", name:"microSD Expressカード JM-MSDEX512G", url:"https://www.iodata.jp/news/2026/newprod/jm-msdex512g.htm"},
  {date:"2026-10-01", name:"モバイルディスプレイ LCD-YC164HX／LCD-YC165HX", url:"https://www.iodata.jp/news/2026/newprod/lcd-yc164hx.htm"},
  {date:"2026-10-01", name:"ゲーミングモニター GDU271AD（EX-／KH-／HT-）", url:"https://www.iodata.jp/news/2026/newprod/gdu271ad.htm"},
  {date:"2026-09-16", name:"ポータブルSSD「floworks」SSCA-SUW", url:"https://www.iodata.jp/news/2026/newprod/ssca-suw.htm"},
  {date:"2026-09-16", name:"NarSuS ローカル診断（SSDの健康状態の見守り）", url:"https://www.iodata.jp/news/2026/newprod/narsus-local-shindan.htm"}
);
