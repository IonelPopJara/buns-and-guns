import * as THREE from "three";

const meshes = new THREE.Group();

let layout = `
+---------------------+
|                     |
|                     |
|                     |
|                     |
|                     |
|           x  +-+  +-+
|              |      |
|              |      |
|              |      |
|              |      |
|              |      |
+--------------+      |
|                     |
|           +----+    |
|           |    |    |
|       +---+    |    |
|       |        |    |
|       +--------+    |
|                     |
+---------------------+
`;
parseLayout(layout);

function parseLayout(layout) {
  const lines = layout
    .split("\n")
    .map((line) => line.split(""))
    .filter((line) => line.length > 0);

  // Find the position of the 'x' character
  let startPos = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const xIndex = line.indexOf("x");

    if (xIndex !== -1) {
      startPos = { x: xIndex, y: i };
      break;
    }
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === " " || lines[y][x] === "x") {
        continue;
      }

      const actualX = x - startPos.x;
      const actualY = y - startPos.y;

      if (lines[y][x] === "+") {
        for (let position = -1; position <= 1; position++) {
          if (
            y + position >= 0 &&
            y + position < lines.length &&
            lines[y + position][x] === "|") {

            let mesh;
            if (position > 0) {
              mesh = createMesh(0.5, '/textures/level/wall_thin_left.png', '/textures/level/wall_thin_left_normal_map.png', '/textures/level/wall_light_map.png');
            } else {
              mesh = createMesh(0.5, '/textures/level/wall_thin_right.png', '/textures/level/wall_thin_right_normal_map.png', '/textures/level/wall_light_map.png');
            }

            mesh.position.x = actualX;
            mesh.position.z = actualY + position * 0.25;

            mesh.rotation.y = Math.PI / 2;

            meshes.add(mesh);
          }

          if (
            x + position >= 0 &&
            x + position < lines[y].length &&
            lines[y][x + position] === "-") {

            let mesh;
            if (position < 0) {
              mesh = createMesh(0.5, '/textures/level/wall_thin_left.png', '/textures/level/wall_thin_left_normal_map.png', '/textures/level/wall_light_map.png');
            } else {
              mesh = createMesh(0.5, '/textures/level/wall_thin_right.png', '/textures/level/wall_thin_right_normal_map.png', '/textures/level/wall_light_map.png');
            }
            mesh.position.x = actualX + position * 0.25;
            mesh.position.z = actualY;

            meshes.add(mesh);
          }
        }
      } else {
        const mesh = createMesh(1, '/textures/level/wall.png', '/textures/level/wall_normal_map.png', '/textures/level/wall_light_map.png');

        mesh.position.x = actualX;
        mesh.position.z = actualY;

        if (lines[y][x] === "|") {
          mesh.rotation.y = Math.PI / 2;
        }

        meshes.add(mesh);
      }
    }

    const texture = new THREE.TextureLoader().load('/textures/level/floor.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1000, 1000);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({
        map: texture,
        aoMap: new THREE.TextureLoader().load('/textures/level/wall_normal_map.png'),
        aoMapIntensity: 1.2,
        wireframe: false,
      })
    );
    floor.position.y = -1;
    floor.rotation.x = -Math.PI / 2;

    meshes.add(floor);
  }

  function createMesh(width, mapPath, uvMap, lightMapPath) {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, 2),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(mapPath),
        aoMap: new THREE.TextureLoader().load(uvMap),
        aoMapIntensity: 1.2,
        lightMap: new THREE.TextureLoader().load(lightMapPath),
        lightMapIntensity: 5,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true
      })
    );
  }
}

export { meshes };
