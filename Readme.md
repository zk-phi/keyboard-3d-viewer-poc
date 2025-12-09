https://zk-phi.github.io/keyboard-3d-viewer-poc

自作キーボードたちを 3D プレビューできるページのプロトタイプ。

過去の作品たちのアーカイブ化に向けて。

## 技術的なこと
### レンダリング

https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js

このあたりを参考に Three.js で。

`RoomEnvironment` くんが色々いい感じにしてくれてすごい。

キーキャップとか大量に描画されるジオメトリは `mergeGeometries` で最適化。

### モデルデータの難読化

念の為、将来データを有料販売する可能性も想定して、モデルデータを難読化。

原本は Private repo に置いて、 `update_models.js` で暗号化しつつ `public` dir にコピー（ZipCrypto は弱いので、 AES を使う）。

クライアント側で復号化してから Three.js に読ませる（この時、 `Loader.load` に Blob URL を渡すと、 Devtool の Network タブに平文の Blob が残ってしまうので注意。直接 `Loader.parse` に `ArrayBuffer` を投げるようにする）。

暗号化のキーは `.env` と GitHub Actions の secret で管理。

バンドルは `javascript-obfuscator` で難読化（この時 `splitStrings` を設定しないと、キーがまるっとバンドルに入ってしまうので注意。細かく刻んで復元しづらくする）。

クライアント側で復号化する以上、当然ながら完璧はありえないことに注意。今回の用途では、「これ解読するくらいなら金払った方が早いわ」と思ってもらえればそれで十分なので、これでよしとする。
