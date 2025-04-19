import * as THREE from "three";

const meshes = [];

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
          if (y + position >= 0 &&
            y + position < lines.length &&
            lines[y + position][x] === "|") {

            let mesh;
            if (position > 0) {
              mesh = createMesh(0.5, '/wall_thin_left.png', '/wall_light_map.png');
            } else {
              mesh = createMesh(0.5, '/wall_thin_right.png', '/wall_light_map.png');
            }

            mesh.position.x = actualX;
            mesh.position.z = actualY + position * 0.25;

            mesh.rotation.y = Math.PI / 2;

            meshes.push(mesh);
          }

          if (x + position >= 0 &&
            x + position < lines[y].length &&
            lines[y][x + position] === "-") {

            let mesh;
            if (position < 0) {
              mesh = createMesh(0.5, '/wall_thin_left.png', '/wall_light_map.png');
            } else {
              mesh = createMesh(0.5, '/wall_thin_right.png', '/wall_light_map.png');
            }

            mesh.position.x = actualX + position * 0.25;
            mesh.position.z = actualY;

            meshes.push(mesh);
          }
        }
      } else {
        const mesh = createMesh(1, '/wall.png', '/wall_light_map.png');

        mesh.position.x = actualX;
        mesh.position.z = actualY;

        if (lines[y][x] === "|") {
          mesh.rotation.y = Math.PI / 2;
        }

        meshes.push(mesh);
      }
    }
  }

  function createMesh(width, mapPath, lightMapPath) {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, 2),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(mapPath),
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
