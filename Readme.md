https://zk-phi.github.io/keyboard-3d-viewer-poc

自作キーボードたちを 3D プレビューできるページのプロトタイプ。

過去の作品たちのアーカイブ化に向けて。

## 技術的なこと

https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js

このあたりを参考に Three.js で。

`RoomEnvironment` くんがライティングとか色々いい感じにしてくれてすごい。

### 最適化

キーキャップとか大量に描画されるジオメトリは `mergeGeometries` で最適化。

基板の glb モデルは gltfpack でポリゴン数を削減。

これらをやらないと、スマホで開いた時クラッシュする程度には重かった。

## License

3D モデルの一部に以下のものを含みます

- `kbd` ライブラリ (@foostan) の 3D モデル (MIT License)
- KiCAD 同梱ライブラリの 3D モデル (例外条項付き CC-BY-SA 4.0)
