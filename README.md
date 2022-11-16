<p align="center">
    <img src="public/icon.jpg" width="200" height="200" alt="Logo">
</p>
<div align="center">

# Danbooru ラベルスーパーマーケット

https://tags.novelai.dev

</div>

## 主な機能

-   タグの分類、解釈、図解
-   インスタント検索
-   タグの組み合わせの構築とウェイトの展開
-   アドバンストラベルエンジニアリングのブレンドに対応([Prompt Editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing) / [Alternating Words](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#alternating-words)）
-   既存のタグの組み合わせをインポートして自動的にマッチングさせ、複雑なタグの解析をサポート
-   プリセット（固定ラベルの組み合わせ）照合、図版、イラストレーション
-   エンベデッドモデルインデックスとダウンロード
-   ハイパーネットワークモデルのインデックスとダウンロード

## 開発・改善

### ラベルやプリセットの修正

ファイル `data/tags/**/*.yaml` と `data/presets/**/*.yaml` を編集してください。

#### 広める

ラベルの追加には、ラベルの英語名と中国語名の両方が必要であることが最低条件です。

タグ名の場合は、アンダースコアをスペースに置き換えてください。他のタグと重複しないようにご注意ください。`npm run dupcheck`を使用するか、または
`yarn dupcheck` で重複をチェックします。

##### タグ

```yaml
name: <分類名>
category: 
  - <分類レベル1>
  - <分類レベル2>
restricted: false # 制限の有無
content:
    tag-name1: # 英語ラベル
        name: <ラベル 中国語名 1>
    tag-name2: # 英語ラベル
        name: <ラベル 中国語名 2>
```

##### プリセット

```yaml
name: <プリセットカテゴリー名>
category: 
  - <分類レベル1>
  - <分類レベル2>
restricted: false # 制限の有無
content:
    预设中文名:
        description: プリセットの説明
        content:
            - tag1
            - tag2
```

#### 精修

クオリティタグには、画像、説明文、エイリアス、だんぼーるWikiへのリンクが必要です。

画像サイズはなるべく512pxに近い方がきれいに表示されます。

`npm run importimage <path>` または `yarn importimage <path>` で、公開ディレクトリに画像を追加してください。
これにより、自動的に画像が切り取られ、適切に圧縮されます。

`npm run importuncroppedimage <path>` または `yarn importuncroppedimage <path>` を使用します。
追加された画像は、トリミングされずにそのまま追加されます。ワイドプリセットデモ画像に適しています。

児童ポルノに関連する画像や、GitHubの利用規約に違反する画像をプロジェクトに追加しないでください。

##### タグ

```yaml
name: <分類名>
category: 
  - <分類レベル1>
  - <分類レベル2>
restricted: false # 制限の有無
content:
    tag-name1: # 英語ラベル
        name: <ラベル 中国語名 1>
        description: <ラベルの説明>
        wikiURL: <Danbooru Wiki リンク>
        image: <写真 SHA256>
        restricted: false # 制限の有無
```

##### プリセット

```yaml
name: <プリセットカテゴリー名>
category: 
  - <分類レベル1>
  - <分類レベル2>
restricted: false # 制限の有無
description: <プリセットされた分類の説明>
content:
    预设中文名:
        description: プリセットの説明
        content:
            - tag1
            - tag2
        preview: # プレビュー画像 SHA256 (オプション)
            - <hash1>
            - <hash2>
```

### エンベッディングモデルのアップロード (TI Embeddings)

モデルの埋め込みは、最新版の画像形式（`Save images with embedding in PNG chunks`）にのみ対応しています。
セキュリティ上の理由から、現時点では `.pt` モデルファイルは受け付けられません。

`.pt` 形式のモデルファイルについては [このColab notebook](https://colab.research.google.com/gist/wfjsw/2b2a26349bef1ce891f6ab4d4fb3030a/convert-pt-embedding-to-png.ipynb) フォーマット変換を行う。

`npm run importembedding <path>` または `yarn importembedding <path>` を使ってください。
モデル画像を公開ディレクトリに追加します。次に、`data/embeddings/**/*.yaml`に記述ファイルを作成します。

```yaml
# モデルを呼び出すのに使用したコマンド（モデル画像左上の括弧の内容）
prompt: victorian-lace
# モデル名
name: Victorian Lace
# モデル作成者／出典
author: u/depfakacc @ Reddit
# モデル説明
description: 'A lace pattern that looks like it was made in the Victorian era.'
# モデル分類
category: 
  - 未分類
# このモデルに対応するマスターモデルの名前
modelName: model-aa-waifu
# このモデルに対応するマスターモデルのHash（WebUIドロップダウン・ボックスに表示されるHash）。
modelHash: '2037c511'
# モデル写真の右下にあるv文字の横の数字
vectorSize: 10
# モデル写真の右下にあるsの文字の横にある数字
steps: 675
# モデルファイルのSHA256ハッシュ値
payloadHash: df0641662fb2fc8190a4508c34926243843484495e6d9b0e500f8a8e409aa84e
# 制限の有無（任意）
restricted: false
# 推奨ポジティブラベル（オプション）
suggestPositive:
    - cute
# 推奨リバースタギング（オプション）
suggestNegative:
    - futa
```

### スーパーネットワークモデルのアップロード (Hypernetworks)

スーパーネットワークモデルの記述ファイルは、以下の場所にあります。 `data/hypernetworks/**/*.yaml`。

モデル用のデモ画像をアップロードする手順は通常のタグと同様で、それ以外は埋め込みモデルと同様です。スーパーネットモデル自体のサイズが大きいため、ウェブサーバーもGitHubも保存できない。
モデルファイル `.pt` は、私たちの [HuggingFace モデルリポジトリ](https://huggingface.co/novelai-dev/DDPB-hypernetworks/tree/main) にアップロードしてください。
をダウンロードし、そのアドレスを記述ファイルに記載する。

```yaml
prompt: demo-model # 英語名内蔵モデル
name: 演示模型 # 機種名（中国語
author: John Doe @ Tieba # モデルソース
category: # モデル分類
  - 风景
modelName: demo model # このモデルに対応するマスターモデルの名前
modelHash: 'deadbeef' # このモデルに対応するマスターモデルのHash（WebUIドロップダウン・ボックスに表示されるHash）。
steps: 2600 # モデル内に記録されたトレーニングステップの数

# モデルプレビュー画像のSHA256ハッシュ（オプション）
previewHash: 9b55d1f1a03861c01cd72b4952191660f87c7bc0e9a0dfc4447022852a2be147

# HuggingFaceのモデルファイルのダウンロード
payloadURL: https://huggingface.co/novelai-dev/DDPB-hypernetworks/resolve/main/demo.pt

# 推奨ポジティブラベル（オプション）
suggestPositive:
    - demo tag
# 推奨リバースタギング（オプション）
suggestNegative:
    - demo tag 2
```

### 開発環境

> Proのアイコンを一部使用しているため、このプロジェクトの構築には[Font Awesome v6 Proライセンス](https://fontawesome.com/plans)が必要になります。
> を実行し、Font AwesomeのプライベートNPMサーバーに接続します。開発中に一時的にFreeアイコンに置き換えることができます。

```bash
# 依存関係のインストール
yarn
# 開発サーバーの起動
yarn dev
# 建築プロジェクト
yarn build
```

### TODO

改善すべき点

-   [ ] Masonry 多くのインターフェース最適化（例：Collapse）と非互換
