# enrpg

A web-based map editor for [RPGEN](https://rpgen.org/dq/maps), designed for intuitive and efficient mouse-driven editing.

## 概要 / Overview

**enrpg** は [RPGEN](https://rpgen.org/dq/maps) 専用のマップエディタです。マウス操作で直感的かつ高速にマップを編集できます。

このツールはオープンソースで、誰でも自由に改変・利用可能です。

本家 RPGEN のマップ作成はゲーム内キャラクターの移動を通じて行われるため、  
マップ全体の一覧性や高速な編集に不向きでした。  
本エディタは、そうした課題を解決するために開発されました。

## 採用技術 / Tech Stack

- **開発言語**: TypeScript  
- **実行環境**: Bun  
- **フロントエンド**: Next.js

## 環境構築 / Getting Started

1. [Bun をインストール](https://bun.sh)
2. このリポジトリをローカルにクローン
3. この `README.md` があるディレクトリを VS Code で開く
4. 拡張機能タブから推奨拡張をインストール
5. `bun i` を実行して依存パッケージをインストール
6. よく使うコマンド:
   - `bun run dev` — 開発ビルド（ホットリロード有効）

## 使い方 / Usage

1. `bun run dev` で開発サーバーを起動
2. ブラウザで `http://localhost:3000/enrpg` にアクセス
3. マップをマウスで編集
4. 保存・エクスポート機能は今後追加予定

## よくある質問 / FAQ

### Q. RPGEN 以外のツールで使えますか？
A. 現時点では RPGEN 専用ですが、仕様を拡張すれば他ツールにも対応可能です。

### Q. スマホ対応していますか？
A. 現在は PC のブラウザを想定しています。スマホ対応は未定です。

### Q. マップのインポート／エクスポートはできますか？
A. できます。

## 今後の予定 / Roadmap

- 🚧 タイルセット対応
- ✅ マップのエクスポート / インポート
- 🚧 Undo / Redo 機能
- 🚧 スマホ UI 対応
- 🧪 オートセーブ機能

## ライセンス / License

- **MIT**  
  本プロジェクト全体には MIT ライセンスが適用されます。詳細は [`LICENSE`](./LICENSE) をご覧ください。

## コントリビュート / Contributing

バグ報告や機能追加の提案、大歓迎です！

1. Issue を立てる
2. Fork して PR を作る
3. レビュー後、マージします

---

Pull requests are welcome! 🎉
