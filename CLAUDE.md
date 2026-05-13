# プロジェクト概要

静的HTMLサイト（PHP SSI による部品 include 構成）。

- エントリーポイント: `index.html`（トップページのみ実装済み）
- サブページ（`/service/`, `/locations/`, `/journal/`, `/news/` 等）はリンクのみ存在し、HTML本体は未実装
- ビルドシステムなし。生のファイルをそのまま配信する想定

## 技術スタック

- HTML + PHP SSI（`<?php require_once $_SERVER["DOCUMENT_ROOT"]. "/cmn/inc/xxx.html"; ?>`）
- CSS（手書きリセット、minified 1行、可変フォント `font-variation-settings`）
- jQuery 3.7.1
- Splide.js（スライダー）
- 可変フォント: Satoshi-Variable / NotoSansJP-VariableFont（woff2）

# ディレクトリ構成

```
templates/
├── index.html                    # トップ（body class="top"）
└── cmn/                          # 共通アセット
    ├── css/
    │   ├── common.css            # 全ページ共通（minified 1行）
    │   └── top.css               # トップ専用
    ├── font/                     # 可変フォント woff2
    ├── img/                      # PC画像 / sp/ にSP版
    ├── webp/                     # 同上の WebP
    ├── svg/                      # アイコン SVG
    ├── js/                       # jquery / splide / script.js
    └── inc/                      # PHPパーシャル（.html 拡張子）
        ├── head_top.html         # charset / viewport / font preload
        ├── head.html             # meta + JSON-LD + common.html include
        ├── common.html           # base reset + 共通要素の <style>
        ├── header.html           # ヘッダー
        ├── reserve_bnr.html      # 浮遊型予約バナー
        ├── cv.html               # 予約 + FC + Recruit
        ├── footer.html           # footer_nav include + JS 読込
        ├── footer_nav.html       # フッターナビ
        └── sns.html              # SNSリンクリスト
```

# ページ構成

`index.html` の読み込み順:

1. `cmn/inc/head_top.html` — charset / viewport / font preload
2. `cmn/inc/head.html` — meta + JSON-LD + common.html
3. `cmn/inc/header.html` — ヘッダー
4. main コンテンツ（ページ固有）
5. `cmn/inc/reserve_bnr.html` — 浮遊バナー
6. `cmn/inc/cv.html` — 予約セクション
7. `cmn/inc/footer.html` — フッター + jQuery + script.js

## ページ識別

`<body class="top">` 形式でページ識別子を付与。

## トップ／下層分岐

```php
<?php if ($_SERVER["SCRIPT_NAME"] !== "/index.html"): ?>
```

下層では:
- ロゴが `<h1>` → `<div>` に切替
- common.css を別途読込（head.html で分岐）

# 運用方針

1. 既存 class 名を変更しない
2. `c-` / `is-` / `js-` プレフィックスルールを維持
3. snake_case 命名を維持
4. Splide 初期化は既存記法を踏襲
5. PHP include 構造を壊さない
6. `common.css` は共通ルールのみ追加
7. ページ固有 CSS は個別 CSS へ記述
8. クリティカル CSS は既存方針を維持
9. vw ベースの流動設計を優先
10. picture タグ構成を維持
11. WebP / JPG の対応構成を維持
12. 不要なライブラリ追加禁止
13. GSAP 導入時は確認を取る
14. UTF-8（BOMなし）/ LF 改行を維持
15. 不要なコード整形禁止
16. CSS プロパティ順を既存実装に合わせる
17. JavaScript は jQuery 文化を優先
18. include ファイルを直接肥大化させない
19. 完全 BEM 化しない

# 禁止事項

- 既存 class 名変更禁止
- 完全 BEM 化禁止
- 不要なライブラリ追加禁止
- include 構造変更禁止
- 不要なコード整形禁止
- CSS 設計変更禁止
- UTF-8 / LF 変更禁止

# AI Instructions

- 既存実装を優先
- 推測でリファクタリングしない
- class 命名文化を変更しない
- 実装前に既存パターンを検索する
- 新規実装時は既存コンポーネントを再利用する
- 共通化は提案ベースに留める
- 大規模変更前は確認を取る

# 詳細ルール

コーディング詳細は [coding-rules.md](./coding-rules.md) を参照。

# 未確認事項

- ビルド・デプロイ手順（package.json / Makefile / CI 設定なし）
- サブページの HTML 実装方針（サブページ用 CSS は削除済み、再作成方針未定）
- `.claude/` ディレクトリ内設定の詳細
- 文字コード以外の社内コーディング規約文書の有無
- WebP 生成手順・自動化の有無
