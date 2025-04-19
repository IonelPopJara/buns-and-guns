import * as THREE from "three";
import { levels } from "./levels";

const PATH = "/textures/level/";

export default class LevelManager {
  _textures;

  constructor() {
    const textureLoader = new THREE.TextureLoader();

    const floorTexture = textureLoader.load(PATH + '/floor.png');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1000, 1000);

    this._textures = {
      wall: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + 'wall.png'),
        aoMap: textureLoader.load(PATH + 'wall_normal_map.png'),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + 'wall_light_map.png'),
        lightMapIntensity: 5,
        transparent: true
      }),
      wall_thin_left: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + 'wall_thin_left.png'),
        aoMap: textureLoader.load(PATH + 'wall_thin_left_normal_map.png'),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + 'wall_light_map.png'),
        lightMapIntensity: 5,
        transparent: true
      }),
      wall_thin_right: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + 'wall_thin_right.png'),
        aoMap: textureLoader.load(PATH + 'wall_thin_right_normal_map.png'),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + 'wall_light_map.png'),
        lightMapIntensity: 5,
        transparent: true
      }),
      floor: new THREE.MeshBasicMaterial({ map: floorTexture })
    }
  }

  _createMesh(width, material) {
    return new THREE.Mesh(new THREE.PlaneGeometry(width, 2), material);
  }

  loadLevel(level) {
    if (level > levels.length) {
      return null;
    }

    const lines = levels[level - 1]
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

    const meshes = new THREE.Group();

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
                mesh = this._createMesh(0.5, this._textures.wall_thin_left);
              } else {
                mesh = this._createMesh(0.5, this._textures.wall_thin_right);
              }

              mesh.position.x = actualX;
              mesh.position.z = actualY + position * 0.25;

              mesh.rotation.y = Math.PI / 2;

              meshes.add(mesh);
            }

            if (x + position >= 0 &&
              x + position < lines[y].length &&
              lines[y][x + position] === "-") {

              let mesh;
              if (position < 0) {
                mesh = this._createMesh(0.5, this._textures.wall_thin_left);
              } else {
                mesh = this._createMesh(0.5, this._textures.wall_thin_right);
              }

              mesh.position.x = actualX + position * 0.25;
              mesh.position.z = actualY;

              meshes.add(mesh);
            }
          }
        } else {
          const mesh = this._createMesh(1, this._textures.wall);

          mesh.position.x = actualX;
          mesh.position.z = actualY;

          if (lines[y][x] === "|") {
            mesh.rotation.y = Math.PI / 2;
          }

          meshes.add(mesh);
        }
      }

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        this._textures.floor
      );

      floor.position.y = -1;
      floor.rotation.x = -Math.PI / 2;

      meshes.add(floor);
    }

    return meshes;
  }
}
