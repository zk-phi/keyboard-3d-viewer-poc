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
