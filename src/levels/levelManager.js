import * as THREE from "three";
import { levels } from "./levelData";
import Entity from "../entity";
import Goal from "../goal";

const PATH = "./textures/level/";
const ENTITY_MESH_TYPE = "Entity";
const WALL_MESH_TYPE = "Wall";
const FLOOR_MESH_TYPE = "Floor";
const GOAL_MESH_TYPE = "Goal";

let winHandler;
document.addOnWinHandler = function (handler) {
  winHandler = handler;
};

export default class LevelManager {
  _forceFrameUpdate;
  _levelData;
  _textures;
  _player;
  _goal;

  constructor(player, cameraWrapper, scene) {
    this._player = player;
    this._cameraWrapper = cameraWrapper;
    this._scene = scene;
    this._forceFrameUpdate = false;
    const textureLoader = new THREE.TextureLoader();

    const floorTexture = textureLoader.load(PATH + "/floor.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1000, 1000);

    this._textures = {
      wall: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + "wall.png"),
        aoMap: textureLoader.load(PATH + "wall_normal_map.png"),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + "wall_light_map.png"),
        lightMapIntensity: 5,
        transparent: true,
      }),
      wall_thin_left: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + "wall_thin_left.png"),
        aoMap: textureLoader.load(PATH + "wall_thin_left_normal_map.png"),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + "wall_light_map.png"),
        lightMapIntensity: 5,
        transparent: true,
      }),
      wall_thin_right: new THREE.MeshBasicMaterial({
        map: textureLoader.load(PATH + "wall_thin_right.png"),
        aoMap: textureLoader.load(PATH + "wall_thin_right_normal_map.png"),
        aoMapIntensity: 1.2,
        side: THREE.DoubleSide,
        lightMap: textureLoader.load(PATH + "wall_light_map.png"),
        lightMapIntensity: 5,
        transparent: true,
      }),
      floor: new THREE.MeshBasicMaterial({ map: floorTexture }),
    };

    this._levelData = null;
    this._currentLevel = 0;
  }

  _createMesh(width, material) {
    return new THREE.Mesh(new THREE.PlaneGeometry(width, 2), material);
  }

  _loadLevel() {
    if (
      this._currentLevel === undefined ||
      this._currentLevel === null ||
      this._currentLevel < 0 ||
      this._currentLevel >= levels.length
    ) {
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
      entities: [],
    };

    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === " " || lines[y][x] === "x") {
          continue;
        }

        const actualX = x - startPos.x;
        const actualY = y - startPos.y;

        if (lines[y][x] === "e") {
          const enemy = new Entity(
            this._cameraWrapper,
            this._scene,
            { x: actualX, y: actualY },
            this._player.damage.bind(this._player)
          );
          enemy.mesh.type = ENTITY_MESH_TYPE;

          levelData.entities.push(enemy);
          levelData.meshes.add(enemy.mesh);
        } else if (lines[y][x] === "+") {
          for (let position = -1; position <= 1; position++) {
            if (
              y + position >= 0 &&
              y + position < lines.length &&
              lines[y + position][x] === "|"
            ) {
              let mesh;
              if (position > 0) {
                mesh = this._createMesh(0.5, this._textures.wall_thin_left);
              } else {
                mesh = this._createMesh(0.5, this._textures.wall_thin_right);
              }

              mesh.position.x = actualX;
              mesh.position.z = actualY + position * 0.25;

              mesh.rotation.y = Math.PI / 2;

              mesh.type = WALL_MESH_TYPE;
              levelData.meshes.add(mesh);
            }

            if (
              x + position >= 0 &&
              x + position < lines[y].length &&
              lines[y][x + position] === "-"
            ) {
              let mesh;
              if (position < 0) {
                mesh = this._createMesh(0.5, this._textures.wall_thin_left);
              } else {
                mesh = this._createMesh(0.5, this._textures.wall_thin_right);
              }

              mesh.position.x = actualX + position * 0.25;
              mesh.position.z = actualY;

              mesh.type = WALL_MESH_TYPE;
              levelData.meshes.add(mesh);
            }
          }
        } else if (lines[y][x] === "g") {
          this._goal = new Goal({ x: actualX, y: actualY });
          this._goal.mesh.type = GOAL_MESH_TYPE;
          levelData.meshes.add(this._goal.mesh);
        } else {
          const mesh = this._createMesh(1, this._textures.wall);

          mesh.position.x = actualX;
          mesh.position.z = actualY;

          if (lines[y][x] === "|") {
            mesh.rotation.y = Math.PI / 2;
          }

          mesh.type = WALL_MESH_TYPE;
          levelData.meshes.add(mesh);
        }
      }

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        this._textures.floor
      );

      floor.position.y = -1;
      floor.rotation.x = -Math.PI / 2;

      floor.type = FLOOR_MESH_TYPE;
      levelData.meshes.add(floor);
    }

    this._player.setOnGunFireEventHandler(
      function (calculateDamage, origin, direction) {
        const raycaster = new THREE.Raycaster();
        raycaster.set(origin, direction);

        const intersects = raycaster.intersectObjects(
          levelData.meshes.children.filter((object) => {
            return !!object.type;
          })
        );

        if (
          intersects.length > 0 &&
          intersects[0].object.type == ENTITY_MESH_TYPE
        ) {
          for (const entity of levelData.entities) {
            if (entity.mesh.id == intersects[0].object.id) {
              entity.damage(
                calculateDamage(intersects[0].distance),
                function () {
                  levelData.meshes.remove(intersects[0].object);
                  this._scene.remove(intersects[0].object);

                  levelData.entities = levelData.entities.filter((object) => {
                    return object != entity;
                  });

                  this._requestFrame();
                }.bind(this)
              );

              break;
            }
          }
        }
      }.bind(this)
    );

    return levelData;
  }

  _requestFrame() {
    this._forceFrameUpdate = true;
  }

  isLevelLoaded() {
    return !!this._levelData;
  }

  goToNextLevel() {
    if (!this._levelData) {
      return;
    }

    this._levelData.meshes.clear();
    this._levelData.entities.forEach((entity) => {
      this._scene.remove(entity.mesh);
    });
    this._levelData = null;

    this._player._controls.reset();
    this._currentLevel++;

    if (this._currentLevel >= levels.length) {
      if (winHandler) {
        winHandler();
      }

      return;
    }
  }

  update(cameraWrapper, scene, delta) {
    if (!this.isLevelLoaded()) {
      console.log(`Level loaded: ${this.isLevelLoaded()}`);

      this._levelData = this._loadLevel(cameraWrapper, scene);

      if (!this._levelData) {
        // If loadlevel returns null, it means that there are no more levels to load
        return;
      }
      scene.add(this._levelData.meshes);

      this._requestFrame();
    }

    let update = false;
    for (const entity of this._levelData.entities) {
      update = entity.update(delta, cameraWrapper.camera) || update;
    }

    let goalUpdate = this._goal.update(delta);

    update = this._forceFrameUpdate || update || goalUpdate;
    this._forceFrameUpdate = false;
    return update;
  }
}
