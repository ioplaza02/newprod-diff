/* ============================================================
   検出した新旧ペア
   how    : 旧型をどうやって見つけたか（"official"＝旧型ページ備考欄の「後継品」表記、"rule"＝型番ルール）
   notes  : 項目ごとの補足（kind:"note" は人が確認して「表記のみ」とした項目）
   ============================================================ */
var TODAY = "2026-11-13";   // 自動取得のデータがあるときは、その取得日に置き換わる
const KEEP_DAYS = 60;   // 発表日から何日間一覧に載せるか

const LCD_NOTES_COMMON = {
  "表示方式":{text:"新設。旧型は「パネルタイプ」欄にまとめて記載"},
  "水平走査周波数（kHz）":{text:"範囲の書き方が変更"},
  "垂直走査周波数（Hz）":{text:"範囲の書き方が変更"},
  "VESAマウントインターフェイス":{text:"新型は「－」。ネジ穴は下の「ウォールマウントインターフェイス」に記載"},
  "ウォールマウントインターフェイス":{text:"新設。内容は旧型のVESAマウント欄と同じ"},
  "組立時間の目安":{kind:"note",text:"「添付のスタンド」→「付属品の台座」の言い換え"},
  "付属品":{kind:"note",text:"中身は同じ（書き方と並び順のみ変更）"},
  "保証期間":{text:"「使用時間とは〜」の定義が追記"}
};
const LCD_GENERAL_HINTS = {
  [G_DOT_OLD]:"新型では「液晶パネル上に滅点…」の文に書き換え",
  [G_DOT_NEW]:"旧型の「黒点…」の文を書き換え。99.999％以上の有効画素であること、修理交換の対象外であることを明記",
  [G_LIFE]:"有寿命部品と交換時期の目安（25℃で連続使用した場合 約5年）を新たに明記"
};
const HDD_NOTES_COMMON = {
  "テレビ":{text:"新型の仕様表は主要4社のみ記載し、最新情報は「デジタル家電 メーカー別対応情報」を確認する書き方に変更"},
  "レコーダー":{text:"新型の仕様表にはこの項目がありません"},
  "エネルギー消費効率":{text:"表の形と容量ラインナップが変更"},
  "盗難防止用ホール":{text:"新型の仕様表で新設された項目"},
  "グリーン購入法":{text:"新型の仕様表で新設された項目"},
  "ゲーム機":{text:"新型の仕様表で新設された項目"},
  "ご注意":{text:"新型の仕様表で新設された項目"}
};
const HDD_GENERAL_HINTS = {
  [H_EFF]:"新型では表の外の注記から削除",
  [H_SOFT]:"新型では表の外の注記から削除（対応アプリ欄に案内あり）"
};

const PAIRS = [
  { id:"lcd-u431d2", date:"2026-11-11", category:"大型液晶ディスプレイ（4K・43型）", kind:"lcd",
    oldModel:"LCD-U431D", newModel:"LCD-U431D2", oldImg:"lcd-u431d", newImg:"lcd-u431d2",
    how:"rule", howText:"型番ルール（末尾の「2」を外して検索）",
    oldUrl:"https://www.iodata.jp/product/lcd/4k/lcd-u431d/index.htm",
    newUrl:"https://www.iodata.jp/product/lcd/4k/lcd-u431d2/index.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/lcd-4k.htm",
    caution:"旧型番には抗菌モデル LCD-U431D-AG がありましたが、新型番の仕様表には抗菌モデルの記載がありません。",
    notes:Object.assign({}, LCD_NOTES_COMMON, {
      "パネルタイプ":{text:"「／ADS」が外れ、下の「表示方式」へ移動"},
      "表示方式":{text:"新設。旧型は「パネルタイプ」欄に「ADS」とだけ記載。新型の※1はIPSの略称の説明"},
      "表示面積 （mm×mm）":{kind:"note",text:"小数点以下の桁数のみ。注記（可視領域42.5型）は新旧とも同じ"},
      "その他":{text:"旧型も商品ページの機能紹介には、ディスプレイウォール（最大25画面）・スケジュール機能・メディアプレーヤー機能の記載あり"}
    }), generalHints:LCD_GENERAL_HINTS },
  { id:"lcd-u501vx2", date:"2026-11-11", category:"大型液晶ディスプレイ（4K・50型）", kind:"lcd",
    oldModel:"LCD-U501VX", newModel:"LCD-U501VX2", oldImg:"lcd-u501vx", newImg:"lcd-u501vx",
    how:"rule", howText:"型番ルール（末尾の「2」を外して検索）",
    oldUrl:"https://www.iodata.jp/product/lcd/4k/lcd-u501vx/index.htm",
    newUrl:"https://www.iodata.jp/product/lcd/4k/lcd-u501vx2/index.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/lcd-4k.htm",
    notes:Object.assign({}, LCD_NOTES_COMMON, {
      "パネルタイプ":{text:"「／VA」が外れ、下の「表示方式」へ移動"},
      "表示面積 （mm×mm）":{kind:"note",text:"小数点以下の桁数のみ。注記（可視領域49.5型）は新旧とも同じ"},
      "映像出力端子":{text:"新型の仕様表では項目ごと削除（旧型も「－」）"},
      "CADデータ":{text:"図面データの形式が DWG → DXF"},
      "miniPCアタッチメントホール （PCの設置条件）":{text:"新設（値は「－」）"},
      "その他":{text:"旧型も商品ページの機能紹介には、スケジュール機能・メディアプレーヤー機能の記載あり"}
    }), generalHints:LCD_GENERAL_HINTS },

  { id:"avhd-wrb", date:"2026-10-21", category:"テレビ録画用ハードディスク（24時間連続録画）", kind:"hdd", dup:"rokuga",
    oldModel:"AVHD-WR", newModel:"AVHD-WRB", oldImg:"avhd-wr", newImg:"avhd-wr",
    how:"official", howText:"旧型ページ備考欄の「後継品AVHD-WR4B/U」",
    oldUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-wr/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-wrb/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdd_rokuga.htm",
    lineup:{old:"2TB・3TB・4TB・6TB（2TB・3TBは生産終了、4TBは在庫限り）", new:"4TB・6TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {}), generalHints:HDD_GENERAL_HINTS },
  { id:"avhd-usb", date:"2026-10-21", category:"テレビ録画用ハードディスク（USB 5Gbps）", kind:"hdd", dup:"rokuga",
    oldModel:"AVHD-US", newModel:"AVHD-USB", oldImg:"avhd-us", newImg:"avhd-us",
    how:"official", howText:"旧型ページ備考欄の「後継品AVHD-US6B/U」「後継品AVHD-US8B/U」",
    oldUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-us/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-usb/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdd_rokuga.htm",
    lineup:{old:"4TB・6TB・8TB（4TBは生産終了、6TB・8TBは在庫限り）", new:"6TB・8TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {}), generalHints:HDD_GENERAL_HINTS },
  { id:"avhd-asb", date:"2026-10-21", category:"テレビ録画用ハードディスク（パナソニック推奨）", kind:"hdd", dup:"rokuga",
    oldModel:"AVHD-AS", newModel:"AVHD-ASB", oldImg:"avhd-us", newImg:"avhd-us",
    how:"rule", howText:"型番ルール（末尾の「B」を外して検索）",
    oldUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-as/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/rokuga/avhd-asb/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdd_rokuga.htm",
    caution:"AVHD-ASシリーズの備考欄の後継品は「AVHD-AS2/U」などのAVHD-AS/Uシリーズで、そのAVHD-AS/Uシリーズの後継品が新商品のAVHD-AS2Bなどです。AVHD-AS → AVHD-AS/U → AVHD-ASB の順に代替わりしているため、直前の旧型はAVHD-AS/Uシリーズです。",
    cautionLinks:[{text:"AVHD-AS/Uシリーズの商品ページ", url:"https://www.iodata.jp/product/hdd/rokuga/avhd-asu/"}],
    lineup:{old:"2TB・4TB・6TB（すべて在庫限り）", new:"2TB・4TB・6TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {}), generalHints:HDD_GENERAL_HINTS },
  { id:"hdpl-utac", date:"2026-10-21", category:"テレビ録画用ハードディスク「トロッカ」", kind:"hdd", dup:"rokuga",
    oldModel:"HDPL-UTAB", newModel:"HDPL-UTAC", oldImg:"hdpl-utab", newImg:"hdpl-utab",
    how:"official", howText:"旧型ページ備考欄の「後継品HDPL-UTA2KC」",
    oldUrl:"https://www.iodata.jp/product/hdd/rokuga/hdpl-utab/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/rokuga/hdpl-utac/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdd_rokuga.htm",
    lineup:{old:"1TB・2TB・4TB（1TBは11/4に生産終了、2TB・4TBは在庫限り）", new:"2TB・4TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {
      "エネルギー消費効率":{text:"新型の仕様表で新設された項目（値は「ー」）"},
      "消費電力（Typ）":{text:"新型の仕様表で新設された項目（値は「ー」）"}
    }), generalHints:HDD_GENERAL_HINTS },
  { id:"hdja-utb", date:"2026-10-14", category:"外付けハードディスク（ファン内蔵）", kind:"hdd", dup:"pc",
    oldModel:"HDJA-UTR", newModel:"HDJA-UTB", oldImg:"hdja-utr", newImg:"hdja-utb",
    how:"official", howText:"旧型ページ備考欄の「後継品HDJA-UT1B」など（型番ルールでは2019年生産終了のHDJA-UTを誤って拾うため、公式表記を優先）",
    oldUrl:"https://www.iodata.jp/product/hdd/hdd/hdja-utr/spec.htm",
    newUrl:"https://www.iodata.jp/product/hdd/hdd/hdja-utb/spec.htm",
    newsUrl:"https://www.iodata.jp/news/2026/newprod/hdja-utb.htm",
    lineup:{old:"1TB・2TB・3TB・4TB・8TB（3TBは生産終了、ほかは在庫限り）", new:"1TB・2TB・4TB・8TB"},
    notes:Object.assign({}, HDD_NOTES_COMMON, {
      "テレビ":{text:"新型の仕様表で新設された項目（値は「－」）"},
      "その他":{text:"新型は当社製LAN DISK（バックアップ・増設用）を対応機器として記載"}
    }), generalHints:HDD_GENERAL_HINTS }
];

/* 新商品ニュースはあったが、旧型を自動で見つけられなかったもの */
const UNMATCHED = [
  {date:"2026-11-11", name:"ゲーミングモニター GD251KHB（EX-／KH-／HT-）", url:"https://www.iodata.jp/news/2026/newprod/gd251khb.htm"},
  {date:"2026-11-04", name:"スポットライト LDR10/DV1シリーズ", url:"https://www.iodata.jp/news/2026/newprod/ldr10dv1.htm"},
  {date:"2026-11-04", name:"有線LANアダプター GP-CR4510GTH/B", url:"https://www.iodata.jp/news/2026/newprod/gp-cr4510gthb.htm"},
  {date:"2026-10-28", name:"液晶ディスプレイ LCD-D3SD／LCD-D3SD-Fシリーズ", url:"https://www.iodata.jp/news/2026/newprod/lcd-d3sd-f.htm"},
  {date:"2026-10-14", name:"ゲーミングモニター LCD-GDQ271ULAQ", url:"https://www.iodata.jp/news/2026/newprod/lcd-gdq271ulaq.htm"}
];
