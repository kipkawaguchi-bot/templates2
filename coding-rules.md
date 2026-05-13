# Coding Rules

CLAUDE.md の運用方針を実装レベルで補完する詳細ルール。実コードを優先し、未確認事項は明記する。

---

## 1. HTML / PHP include 構造

### include 文の書式

```php
<?php require_once $_SERVER["DOCUMENT_ROOT"]. "/cmn/inc/xxx.html"; ?>
```

DOCUMENT_ROOT 基準の絶対パスで指定。相対パスは使わない。

### 読み込み順序（index.html 実装）

```
<head>
  preload(images/svg) + head_top.html
  meta(title/description/OGP/Twitter)
  head.html                  ← common.html を内部で include
  <style>クリティカルCSS</style>
  link rel="stylesheet" common.css / top.css
  JSON-LD WebPage
</head>
<body class="top">
  header.html
  <main>...
    reserve_bnr.html        ← mv_wrap の内側
    cv.html                 ← main の末尾
  </main>
  footer.html               ← footer_nav.html + jQuery + script.js
</body>
```

### body class

ページ識別子（例: `top`）を付与。CSS は `body.top .xxx { ... }` の形で分岐する箇所がある（common.html 内 `.mv_reserve` の演出など）。

### トップ／下層分岐

```php
<?php if ($_SERVER["SCRIPT_NAME"] !== "/index.html"): ?>
```

- `header.html`: ロゴを `<h1>`（トップ） / `<div>`（下層）に切替
- `head.html`: 下層のみ `common.css` を別途読込

### PHP 繰り返し

モック用ループ:
```php
<?php for ($i = 0; $i < 3; $i++): ?>
  ...
<?php endfor; ?>
```

DB 連携・データ供給は未実装。本番ではバックエンド連携が必要。

### PHP コメント

```php
<?php /* コメント */ ?>
```

要件メモなどを HTML 内に残す用途。例: `index.html` 278行目の地図仕様メモ。

### エンコーディング

- UTF-8（BOM なし）
- LF 改行

---

## 2. include 運用ルール

### 各ファイルの責務

| ファイル | 責務 |
|---|---|
| head_top.html | charset / viewport / Google Tag Manager 枠 / font preload |
| head.html | favicon / meta / JSON-LD Organization+WebSite / common.html include / 下層向け common.css 読込 |
| common.html | 全ページ共通の `<style>`（reset + header + menu + mv_reserve） |
| header.html | ヘッダー DOM + メニュー DOM + オーバーレイ |
| reserve_bnr.html | 浮遊型予約ボタン（`.js-floating .mv_reserve`） |
| cv.html | 予約セクション（`#reserve`） + FC + Recruit |
| footer.html | footer_nav.html include + jQuery 読込 + script.js 読込 |
| footer_nav.html | フッターナビ DOM |
| sns.html | SNS リンクリスト |

### 肥大化させない

- 1 ファイル 1 責務
- ロジックが増える場合は新規 inc ファイルに分割
- 既存ファイルを「ついでに」拡張しない

### `<style>` 埋め込みの使い分け

- common.html 内 `<style>`: 全ページ共通の重要 CSS（header / menu / mv_reserve）
- 各ページ HTML 冒頭 `<style>`: above-fold（MV 周辺）のクリティカル CSS
- それ以外: common.css / ページ固有 CSS

---

## 3. class 命名規則

### snake_case を維持

```
mv_wrap, service_in, blog_cnt, news_lst, header_logo, footer_address
```

ハイフン（kebab-case）は使わない（プレフィックスの `c-` / `is-` / `js-` を除く）。

### ブロック名

「領域名 + アンダースコア + 要素」形式:
- `mv_wrap` / `mv_in` / `mv_box` / `mv_ttl` / `mv_read`
- `service_wrap` / `service_in` / `service_img` / `service_box` / `service_btn`
- `blog_cnt` / `blog_txt` / `blog_flx`

### 汎用要素クラス

ブロック内の子要素は短い汎用名:

`img`, `box`, `ttl`, `txt`, `en`, `mds`, `icn`, `lst`, `in`, `flx`, `cnt`, `links`, `name`, `address`, `day`, `tag`

例:
```html
<section class="news_box">
  <a href="#">
    <div class="info">...</div>
    <h4 class="ttl">...</h4>
  </a>
</section>
```

### BEM 化しない

- `__` element 区切りは使わない
- `--` modifier 区切りは使わない
- 代わりに `is-` modifier クラスを併記

例:
```html
<article class="blog_cnt is-new is-ver2">
```

`blog_cnt--new` のような書き方はしない。

---

## 4. プレフィックスの役割

### `c-` 共通再利用コンポーネント

スタイルを伴う、複数文脈で使われるユーティリティ／コンポーネント。

| クラス | 用途 |
|---|---|
| `c-wrap` | コンテンツ幅制限（max-width: 1152px） |
| `c-wrap.is-ver2` | 狭幅版（max-width: 960px） |
| `c-btn` | ボタン共通スタイル |
| `c-ttl` / `c-ttl_wrap` | 共通タイトル |
| `c-pc` / `c-sp` | block 要素の表示切替 |
| `c-pc-in` / `c-sp-in` | inline 要素の表示切替 |
| `c-breadcrumbs` | パンくず |

### `is-` 状態・バリアント

ブロックの状態またはバリエーション。常に他のクラスと併記する（単独使用しない）。

主な事例:
- 状態: `is-open`, `is-hide`, `is-noscroll`, `is-active`, `is-lock`
- バリアント番号: `is-ver1`, `is-ver2`
- カテゴリ: `is-category`, `is-new`, `is-now`, `is-period`, `is-popularity`
- 表示位置／表現: `is-line`, `is-flx`, `is-tx`, `is-nmb`, `is-img`, `is-txt`, `is-add`, `is-s`
- ロゴ種別: `is-x`, `is-facebook`, `is-logo`

### `js-` JSフック専用

JavaScript からの参照専用。**スタイルを当てない**。

| クラス | 用途 |
|---|---|
| `js-menu-open` | メニュー開ボタン |
| `js-menu-close` | メニュー閉ボタン |
| `js-floating` | スクロール量で `floating` を付与する対象 |
| `js-top` | ページトップへスムーススクロール |
| `js-anklnk` | 内部アンカースムーススクロール |

新規 JS フックは `js-` で命名。既存 DOM 追加時は既存 `js-` クラスを再利用すること。

---

## 5. CSS 設計

### ファイル分担

| 配置 | 内容 |
|---|---|
| common.html `<style>` | reset + header + menu + mv_reserve |
| 各ページ HTML 冒頭 `<style>` | above-fold クリティカル CSS |
| cmn/css/common.css | 全ページ共通（footer / CV / 下層共通パーツ） |
| cmn/css/top.css | トップページ専用 |

### 追加時の判断

- 複数ページで使う → common.css
- 1 ページのみで使う → そのページ専用 CSS
- above-fold で初回描画に必要 → クリティカル CSS（`<style>`）

### クリティカル CSS 方針

- 既存の埋め込み箇所を増やさない
- index.html 冒頭の `<style>` は MV 周辺の演出 CSS に限定
- common.html `<style>` は header / menu / mv_reserve に限定
- 新規追加時は本体 CSS に書く

### CSS プロパティ順

既存実装は minified だが、論理的にグルーピングされている傾向:

1. position 系（position / inset / top / right / bottom / left / z-index）
2. display 系（display / flex / grid / align-items / justify-content / gap）
3. box 系（width / height / margin / padding / box-sizing / overflow）
4. 装飾系（background / border / border-radius）
5. 文字系（font-* / color / line-height / letter-spacing / text-* / font-variation-settings）
6. その他（transform / transition / animation / filter / opacity / cursor / pointer-events）

新規追加時はこの順で書く。既存ルールの並び替えはしない。

### `!important`

既存実装での使用例:
- splide ライブラリオーバーライド（`.splide__pagination__page.is-active`）
- リセット類（`margin:0 !important; padding:0 !important`）

新規追加では原則使わない。Splide オーバーライドのような事情がある場合のみ。

---

## 6. CSS 追加ルール

- 既存セレクタを修正する前に影響範囲を grep で確認する
- 既存セレクタの再フォーマット（minified ↔ 整形）禁止
- セレクタの並べ替え禁止
- 新規セレクタは関連既存セレクタの近くに追加
- vendor prefix（`-webkit-` など）は既存と同じ範囲で付与

---

## 7. レスポンシブ設計

### 記述スタイル

PC 優先（`min-width: 768px`）で PC 用スタイルを記述、SP（`max-width: 768px`）で SP 用を記述する併用方式。ベース（無メディアクエリ）には PC 基準のスタイルが入っている箇所と、共通スタイルが入っている箇所が混在する。

### ブレークポイント一覧

| クエリ | 用途 | 使用箇所 |
|---|---|---|
| `@media (min-width:768px)` | PC ベース | 両 CSS |
| `@media only screen and (max-width:768px)` | SP | 両 CSS |
| `@media screen and (min-width:768px) and (max-width:1240px)` | 中 PC（横幅縮小） | 両 CSS |
| `@media screen and (min-width:768px) and (max-width:1060px)` | 小 PC | common.css のみ |
| `@media screen and (min-width:768px) and (max-width:900px)` | 狭 PC | top.css のみ |
| `@media only screen and (max-width:374px)` | 極小 SP | common.css のみ |

新規ブレークポイントは追加しない。

### 768px 境界

PC と SP の分岐点。`<picture>` の media 属性も `(max-width: 768px)` で統一。

### 表示切替クラス

```css
.c-pc    { display: block; }
.c-pc-in { display: inline; }
.c-sp    { display: none; }
.c-sp-in { display: none; }
```

SP 側（max-width: 768px）では反転する想定。`c-pc-in` / `c-sp-in` は inline 要素（span / br / a）用。

---

## 8. vw 運用ルール

### 基準

中間幅（768px〜1240px）で vw を使い、デザインを流動的にスケールさせる。

### 算出式（PC 側）

1240px デザイン基準: `px ÷ 1240 × 100 = vw`

例: 30px → `2.419vw`、20px → `1.613vw`、200px → `16.129vw`

### 算出式（SP 側）

390px デザイン基準: `px ÷ 390 × 100 = vw`

例: 14px → `3.59vw`、16px → `4.103vw`、48px → `12.308vw`

実コード抜粋（index.html クリティカル CSS）:
```css
@media only screen and (max-width:768px){
  .mv_read { font-size: 3.59vw; }      /* 14px相当 */
  .mv_ttl  { font-size: 12.308vw; }    /* 48px相当 */
}
```

### vw を使う場面

- 中間幅でリニアにスケールさせたいサイズ（font-size / padding / gap など）
- PC 幅の最大基準（1240px）を超えたら、メディアクエリ外の固定 px を使う

### px を使う場面

- 1px ライン、ボーダー、`border-radius` の小さい値
- 最大幅（`max-width: 1152px` = `c-wrap`）
- 大きすぎる固定領域

---

## 9. 余白設計

### コンテンツ幅

```
.c-wrap          → max-width: 1152px; margin: 0 auto
.c-wrap.is-ver2  → max-width: 960px
```

### body の上余白

```
body              → padding-top: 158px   (PC, common.html)
body.top .mv_wrap → padding-top: 0       (index.html クリティカル CSS で上書き)
@max-width:768px  → body padding-top: 92px
```

### footer

```
footer → padding: 120px 0
```

### vw による中間スケール

中間幅では `2.419vw`（= 30px / 1240px）等で padding / margin を縮める。

---

## 10. z-index 運用

既存実装での階層:

| 要素 | z-index |
|---|---|
| `header` | 998 |
| `.headerOverlay` | 998 |
| `.header_menu` | 999 |
| `.mv_reserve` | 99 |
| `.mv_wrap::before` | 1 |
| `.mv_wrap::after` | 2 |
| `.mv_in` | 3 |
| `.mv_read .is-line:before` | 3 |
| `.mv_reserve .box` | 2 |
| `.mv_reserve .icn` | 1 |
| `.splide__arrow::before` | 1 |
| `.splide__arrow .icn:before/:after` | 2 |

### 新規追加方針

- 既存値を変更しない
- セクション内ローカル階層は 1, 2, 3 程度の小さい値
- グローバル overlay 系は 998+
- モーダル類は 999+
- 浮遊要素（FAB 等）は 99

---

## 11. hover ルール

PC のみ（`min-width: 768px` 内）で記述。SP では hover を効かせない。

```css
@media (min-width:768px){
  .xxx:hover { /* ... */ }
}
```

### 既存パターン

- transition: `opacity .2s ease-out, all .2s ease-out`（`a` 標準）
- ボタン: 疑似要素で円形拡大演出（`::before` で `top:100%` → `top:-20px` へ移動）
- アイコン: `::before` / `::after` の二段 transform で左右スライド
- 画像: `transform: scale(1.1)` 程度

新規 hover は既存の演出パターンを再利用する。

---

## 12. animation 実装ルール

### 既存 @keyframes

| 名前 | 用途 |
|---|---|
| `slideIn` | 下から上 + opacity（複数定義あり、common.html / index.html クリティカル CSS で上書き） |
| `slideOut` | 上から下 + opacity |
| `textanimation` | translateY(2em) → 0 + opacity（MV 見出し） |
| `long` | scale(0,1) → scale(1,1) 横方向伸び（下線） |
| `splide-loading` | splide ローダー |

### CSS animation vs JS

- 単発演出・初期表示の登場アニメ: CSS `@keyframes`（既存パターン）
- スクロール連動: vanilla JS（`script.js` の parallax）
- スライダー: Splide.js
- マーキー: vanilla JS + `requestAnimationFrame`（`index.html` 末尾の `.marqueein` 処理）

### GSAP

**現状未導入。導入する場合は事前に確認を取る。**

- 過去に `gsap.min.js` / `ScrollTrigger.min.js` が存在していたが削除済み
- 既存の jQuery + vanilla JS でほぼ要件を満たしている
- GSAP 導入はサイト全体の JS 方針に影響するため、ライブラリ追加禁止の例外として扱う

---

## 13. picture タグ構成

### 標準 4 ソース（SP/PC 別＋WebP/JPG 別）

```html
<picture>
  <source media="(max-width: 768px)" srcset="cmn/webp/sp/xxx.webp" type="image/webp">
  <source media="(max-width: 768px)" srcset="cmn/img/sp/xxx.jpg">
  <source srcset="cmn/webp/xxx.webp" type="image/webp">
  <img src="cmn/img/xxx.jpg" width="W" height="H" alt="..." loading="lazy">
</picture>
```

優先順位: SP-WebP → SP-JPG → PC-WebP → PC-JPG（fallback `<img>`）

### 簡易 2 ソース（PC のみ・SP 版なし）

```html
<picture>
  <source srcset="cmn/webp/xxx.webp" type="image/webp">
  <img src="cmn/img/xxx.jpg" width="W" height="H" alt="..." loading="lazy">
</picture>
```

MV メイン画像など、SP 版を別途用意しない箇所で使用。

### 必須属性

- `width` / `height`: 元画像の px 値（CLS 対策）
- `alt`: 日本語で意味を記述。装飾画像は `alt=""`
- `loading`: above-fold 以外は `loading="lazy"`
- `decoding="async"`: above-fold で使用（MV 画像など）
- `fetchpriority="high"`: 最重要画像（MV 1 枚目、ロゴ）

### キャッシュバスティング

更新時にクエリ追加: `xxx.jpg?2`, `xxx.webp?2`

CSS は `?date=YYYYMMDD` 形式。

---

## 14. WebP / JPG 運用

### ファイル配置

```
cmn/img/xxx.jpg       PC JPG/PNG
cmn/img/sp/xxx.jpg    SP JPG/PNG
cmn/webp/xxx.webp     PC WebP
cmn/webp/sp/xxx.webp  SP WebP
```

### 命名規則

- PC / SP で同じファイル名（配置ディレクトリで判別）
- WebP は同名で拡張子のみ変更
- ロケーション接頭辞: `top_*`, `service_*`, `journal_*`, `detail_*`, `mv_*`, `bnr_*`
- 連番: `xxx01.jpg` から（ゼロ埋め 2 桁）

### フォーマット選択

- 写真 → JPG（WebP も併設）
- 透過が必要なもの → PNG（WebP も併設）
- アイコン → SVG
- アニメーション → GIF（`emoji01`〜`emoji05`）

### 未確認

- WebP の生成手順・自動化の有無

---

## 15. Splide 実装ルール

### 読込み

```html
<script src="/cmn/js/splide.min.js"></script>
```

各ページ末尾で個別読込。CSS は `<style>` インラインに埋め込み済み（splide-core 由来）。

### 初期化記述箇所

各ページ HTML 末尾の inline `<script>` で初期化:

```html
<script>
document.addEventListener('DOMContentLoaded', () => {
  // MV: 即時初期化
  const mvEl = document.querySelector('.splide.mv');
  if (mvEl) {
    new Splide(mvEl, { /* options */ }).mount();
  }
  // 他のスライダー: idleCallback で遅延初期化
  const idleCallback = window.requestIdleCallback
    ? (fn) => requestIdleCallback(fn, { timeout: 2000 })
    : (fn) => setTimeout(fn, 200);
  idleCallback(() => {
    const baseOptions = {
      pauseOnHover: false, pauseOnFocus: false,
      interval: 4000, speed: 800, perMove: 1,
    };
    const splideConfigs = [
      { selector: '.splide.banner',    options: { /* ... */ } },
      { selector: '.splide.locations', options: { /* ... */ } },
      { selector: '.splide.blog',      options: { /* ... */ } },
    ];
    splideConfigs.forEach(({ selector, options }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      new Splide(el, { ...baseOptions, ...options }).mount();
    });
  });
});
</script>
```

### DOM 構造

```html
<div class="splide [識別子]" role="group" aria-label="...">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">...</li>
    </ul>
    <div class="splide_cnt [c-wrap?]">
      <div class="splide__arrows">
        <button class="splide__arrow splide__arrow--prev button prev"><span class="icn"></span></button>
        <ul class="splide__pagination"></ul>
        <button class="splide__arrow splide__arrow--next button next"><span class="icn"></span></button>
      </div>
    </div>
  </div>
</div>
```

### 個別オプションの傾向（index.html 実装）

| スライダー | 主なオプション |
|---|---|
| `.splide.mv` | `type:'fade'`, `autoplay:true`, `width:'70%'`, `interval:5000`, `speed:2000` |
| `.splide.banner` | `type:'loop'`, `autoWidth:true`, `gap:24`, `focus:'center'`, `trimSpace:'move'` |
| `.splide.locations` | `type:'slide'`, `autoplay:false`, `width:'512px'` |
| `.splide.blog` | `type:'loop'`, `autoplay:true`, `width:'600px'`, `gap:24` |

### ルール

- 既存スライダーの options を勝手に変更しない
- 新規スライダーは `baseOptions` を踏襲する
- breakpoints は `{ 1240, 900, 768 }` を基準
- pagination / arrows の DOM 配置は既存パターンを踏襲

---

## 16. jQuery 記法

### 読込位置

`footer.html` で読み込み:
```html
<script src="/cmn/js/jquery-3.7.1.min.js"></script>
<script src="/cmn/js/script.js?date=YYYYMMDD"></script>
```

### 全体ラップ

```javascript
$(function () {
  // ...
});
```

`$(document).ready(...)` ではなく `$(function () { ... })` 形式。

### 既存記法

- イベント: `.on('click', function() { ... })` または `.scroll(function() { ... })`
- this 参照: `$(this)`
- 取得: `$('.selector')`, `.attr('href')`, `.offset().top`
- クラス操作: `.addClass(...)` / `.removeClass(...)`
- スクロールアニメ: `$('html, body').animate({ scrollTop: position }, 400, 'swing')`
- スクロール監視: `$(window).scroll(...)` / `$(this).scrollTop()`

### Vanilla JS 併用

既存 `script.js` では一部 vanilla JS:
- parallax: `document.querySelector(...)` + `requestAnimationFrame`
- 高頻度のスタイル更新

新規実装は **原則 jQuery 文化を踏襲**。`requestAnimationFrame` 等の高頻度ループは vanilla JS で書いてよい。

### グローバル汚染禁止

- `var topBtn = ...` 程度のローカル変数で対応
- `window.xxx` への代入禁止

---

## 17. utility class ルール

### 既存ユーティリティ

| クラス | 用途 |
|---|---|
| `c-wrap` | コンテンツ幅 1152px |
| `c-wrap.is-ver2` | コンテンツ幅 960px |
| `c-pc` | block PC 表示 / SP 非表示 |
| `c-sp` | block SP 表示 / PC 非表示 |
| `c-pc-in` | inline PC 表示 |
| `c-sp-in` | inline SP 表示 |
| `c-btn` | ボタン共通 |
| `c-ttl` | 見出し共通 |
| `c-ttl_wrap` | 見出しラッパ |
| `c-breadcrumbs` | パンくず |

### 増やす際の基準

- 3 ページ以上で使われる予定がある
- スタイルが独立して意味を持つ
- 既存の `c-` で表現できない

それ以外は専用クラスで実装する。

---

## 18. ライブラリ追加方針

### 既存

- jQuery 3.7.1
- Splide.js

### 削除済み（過去存在）

- `gsap.min.js`
- `ScrollTrigger.min.js`
- `jquery.inview.min.js`
- `scroll-hint.min.js`

### 追加禁止

- 新規ライブラリ追加は原則禁止
- jQuery プラグイン追加禁止
- npm パッケージ追加禁止（ビルドシステムなし）

### GSAP 例外

必要な場合は事前確認:
1. 既存 jQuery / vanilla JS で実現可能か検討
2. 影響範囲（容量・既存 JS との競合）を説明
3. 承認後のみ追加

### CDN vs 同梱

同梱（`cmn/js/` 配下に物理ファイル）。CDN 直接読込はしない。

---

## 19. ファイル形式

- 文字コード: UTF-8（BOM なし）
- 改行コード: LF
- インデント: 半角スペース 4 個（HTML / inc）、2 個（script.js 内 JS）
- 末尾改行: 既存ファイルに合わせる

### Windows 環境での編集注意

PowerShell 5.1 の `Get-Content` / `Set-Content` はデフォルト CP932（Shift-JIS）で読み書きする。直接編集する場合は .NET API で UTF-8（BOM なし）を明示するか、UTF-8 対応エディタを使う。BOM が混入したり改行が CRLF に変わったりすると差分ノイズになる。

---

## 未確認事項

- WebP 生成手順・自動化の有無
- `script.js` 内で `#reserve` 取得時の null チェック有無（現状 `querySelector('#reserve')` が null の場合エラー）
- サブページの CSS 設計方針（journal.css 等が削除済み、再作成方針未定）
- アクセシビリティ要件（`aria-*` 属性は一部のみ記述）
- IE 対応の有無（一部 vendor prefix が残存）
- `cv.html` の `#reserve` 内 `.reserve_bg` の `.is-ver1` / `.is-ver2` 子要素を script.js が参照するが、`cv.html` に該当 DOM はあるものの背景画像 (`top_reserve_bg01/02`) の参照箇所が未確認
