# Contribution Guide

開発の際の指針です。

## 開発サーバーの起動方法

### 前提

開発サーバーを立ち上げるには以下の環境が必要です。

- Node.js バージョン20以降
- Bun バージョン1.1.7以降

### 起動

以下のコマンドを実行して全ての依存関係をインストールします。（初回のみ）

```sh
bun i
```

次に以下のコマンドを実行すると`http://localhost:3000`に開発サーバーが立ち上がります。

```sh
bun run dev
```

## 開発

### ディレクトリの説明

基本的にはNext.jsフレームワーク（[App Router](https://nextjs.org/docs/app/building-your-application/routing)）に従ってファイルを配置しています。

#### src/features

[features構成](https://zenn.dev/yodaka/articles/eca2d4bf552aeb)を参考にしたフォルダです。特定の機能をここに入れます。

### ブランチの命名規則

新機能を追加する際は`feature/<英数字でここにわかりやすい名前>`というブランチを作成し、作成したブランチにコミットします。

### コードの修正

GitHub上のリモートリポジトリにコードの修正を反映する際の手順について記述します。

以下のフロー通過を原則とします。

1. プルリクエストの作成
2. レビュー後のマージ

基本的には[GitHub フロー](https://docs.github.com/ja/get-started/using-github/github-flow)と同じです。
