const GL_WIDTH = 500;
const GL_HEIGHT = 500;

function set_texture(n) {
    canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    context = canvas.getContext('2d');

    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgb(192,192,192)";
    context.fillRect(8, 8, canvas.width-8, canvas.height-8)

    if (n > 0) {

        switch (n) {
            case (1):
                context.fillStyle = "rgb(0,24,228)";
                break;
            case (2):
                context.fillStyle = "rgb(55,124,34)";
                break;
            default:
                context.fillStyle = "red";
                break;
        }

        context.font = "100px bold sans-serif";
        var metrics = context.measureText("2");
        var textWidth = metrics.width;
        var xPosition = (canvas.width / 2) - (textWidth / 2);
        var yPosition = (canvas.height / 2) + 40;

        context.fillText(n, xPosition, yPosition);

    }

    //document.body.appendChild(canvas)

    return canvas;
}

texture = {
    0: set_texture(0),
    1: set_texture(1),
    2: set_texture(2),
    3: set_texture(3),
    4: set_texture(4),
    5: set_texture(5),
    6: set_texture(6)
}


//シーン
var scene = new THREE.Scene();

//レンダラー
var renderer = new THREE.WebGLRenderer();
renderer.setSize(GL_WIDTH, GL_HEIGHT);
document.getElementById("gl").appendChild(renderer.domElement);

//カメラ
var camera = new THREE.PerspectiveCamera(100, GL_WIDTH / GL_HEIGHT, 1, 1000);
camera.position.set(0, 0, 100);

//マウスコントロール
var controls = new THREE.OrbitControls(camera);

//環境光
light2 = new THREE.AmbientLight(0xaaaaaa);
scene.add(light2);

//キューブ
function createCube(x, y, z, n) {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial();
    material.map = new THREE.Texture(texture[n]);
    // need to flag the map as needing updating.
    material.map.needsUpdate = true;
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(10 * x - 35, 10 * y - 35, 10 * z - 35);

    cube.name = `${x}-${y}-${z}`
    scene.add(cube);
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {
            var n = Math.floor(Math.random() * (6 + 1))
            createCube(i, j, k, n)
        }
    }
}

// レンダリング
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();

renderer.domElement.addEventListener('mousedown', clickPosition, false);

function clickPosition(event) {
    // 画面上のマウスクリック位置
    var x = event.clientX;
    var y = event.clientY;

    // マウスクリック位置を正規化
    var mouse = new THREE.Vector2();
    mouse.x = (x / GL_WIDTH) * 2 - 1;
    mouse.y = -(y / GL_HEIGHT) * 2 + 1;

    // Raycasterインスタンス作成
    var raycaster = new THREE.Raycaster();
    // 取得したX、Y座標でrayの位置を更新
    raycaster.setFromCamera(mouse, camera);
    // オブジェクトの取得
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects[0]) {
        console.log(intersects[0].object.name)
        intersects[0].object.visible = false
    }

}