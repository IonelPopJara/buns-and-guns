import * as THREE from "three";

const meshes = [];

let layout = `
+------------+
|            |
|  x  +-+  +-|
|     |      |
+-----+      |
|            |
|            |
+------------+
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
    console.log("Y: ", i);
    const line = lines[i];
    const xIndex = line.indexOf("x");
    if (xIndex !== -1) {
      startPos = { x: xIndex, y: i };
      break;
    }
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === " " || lines[y][x] === "x") continue;

      const actualX = x - startPos.x;
      const actualY = y - startPos.y;

      let width = 2;
      let height = 1;
      let color = 0xff0000;

      if (lines[y][x] === "+") {
        continue;
        width = 1;
        height = 1;
        color = 0x00ff00;
      }

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          wireframe: true,
        })
      );

      console.log("X: ", actualX, "Y: ", actualY);

      mesh.position.x = actualX;
      mesh.position.z = actualY;

      if (lines[y][x] === "|") {
        mesh.rotation.y = Math.PI / 2; // Rotate 90 degrees
      }

      meshes.push(mesh);
    }
  }
}

export { meshes };
