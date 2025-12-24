const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 4, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Данные
fetch("data.json")
  .then(r => r.json())
  .then(data => initCube(data));

function initCube(data) {
  const labels = Object.keys(data);
  const materials = labels.map(l =>
    new THREE.MeshStandardMaterial({ color: 0x4f80ff })
  );

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener("click", e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length) {
      const faceIndex = Math.floor(intersects[0].faceIndex / 2);
      showInfo(labels[faceIndex], data[labels[faceIndex]]);
    }
  });

  animate();

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
}

// UI
function showInfo(title, text) {
  document.getElementById("title").innerText = title;
  document.getElementById("content").innerText = text;
  document.getElementById("info").style.display = "block";
}

document.getElementById("close").onclick = () =>
  document.getElementById("info").style.display = "none";

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
