import * as THREE from "three";

const meshes = [];

let layout = `
+-----+
|     |
|  x  |
|     |
+-----+
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

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
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

// // Create 10 meshes
// for (let i = 0; i < 10; i++) {
//   if (i % 2 === 0) {
//     mesh.rotation.y = Math.PI / 2; // Rotate 90 degrees
//   }

//   mesh.position.x = i * 2;
//   mesh.position.z = i * 2;
//   meshes.push(mesh);
// }

export { meshes };
