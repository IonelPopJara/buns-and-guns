import * as THREE from "three";
import { levels } from "./levelData";
import Entity from "../entity";
import { bool } from "three/tsl";

const PATH = "/textures/level/";
const WALL_MESH_NAME = "Wall";
const FLOOR_MESH_NAME = "Floor";

const ENTITY_MESH_NAME = "Entity";

export default class LevelManager {
  _textures;
  _levelData;

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

    this._levelData = null;
    this._currentLevel = 0;
  }

  _createMesh(width, material) {
    return new THREE.Mesh(new THREE.PlaneGeometry(width, 2), material);
  }

  _loadLevel(cameraWrapper, scene) {
    console.log(!!this._currentLevel)

    if (this._currentLevel === undefined ||
      this._currentLevel === null ||
      this._currentLevel < 0 ||
      this._currentLevel >= levels.length) {
      return null;
    }

    const lines = levels[this._currentLevel]
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

    const levelData = {
      meshes: new THREE.Group(),
      entities: []
    }

    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === " " || lines[y][x] === "x") {
          continue;
        }

        const actualX = x - startPos.x;
        const actualY = y - startPos.y;

        if (lines[y][x] === "e") {
          const enemy = new Entity(cameraWrapper, scene,
            { x: actualX, y: actualY }
          );

          levelData.entities.push(enemy);
          levelData.meshes.add(enemy.mesh);
        } else if (lines[y][x] === "+") {
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

              mesh.name = WALL_MESH_NAME;
              levelData.meshes.add(mesh);
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

              mesh.name = WALL_MESH_NAME;
              levelData.meshes.add(mesh);
            }
          }
        } else {
          const mesh = this._createMesh(1, this._textures.wall);

          mesh.position.x = actualX;
          mesh.position.z = actualY;

          if (lines[y][x] === "|") {
            mesh.rotation.y = Math.PI / 2;
          }

          mesh.name = WALL_MESH_NAME;
          levelData.meshes.add(mesh);
        }
      }

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        this._textures.floor
      );

      floor.position.y = -1;
      floor.rotation.x = -Math.PI / 2;

      floor.name = FLOOR_MESH_NAME;
      levelData.meshes.add(floor);
    }

    return levelData;
  }

  update(cameraWrapper, scene, delta) {
    if (!this._levelData) {
      this._levelData = this._loadLevel(cameraWrapper, scene)
      scene.add(this._levelData.meshes);

      return true;
    }

    let update = false;
    for (const entity of this._levelData.entities) {
      update = entity.update(delta) || update;
    }

    return update;
  }
}
