import * as THREE from "three";

const Direction = {
    FORWARD: 0,
    BACKWARD: 1,
    LEFT: 2,
    RIGHT: 3,
}

class Collider {
    _scene;
    _object;

    constructor(object, scene) {
        this._scene = scene;
        this._object = object;
    }

    _raycast(direction) {
        const raycaster = new THREE.Raycaster();

        raycaster.set(this._object.position, direction);
        const intersects = raycaster.intersectObjects(
            this._scene.children.filter((object) => {
                return object.type != "GridHelper";
            })
        );

        if (intersects.length > 0) {
            return intersects[0];
        } else {
            return null;
        }
    }

    getAllowedTravelDistance(direction) {
        const worldDirection = new THREE.Vector3();
        this._object.getWorldDirection(worldDirection);
        worldDirection.normalize();

        if (direction == Direction.RIGHT) {
            worldDirection.applyEuler(new THREE.Euler(
                0,
                Math.PI * 1.5,
                0,
                'XYZ'
            ))
        } else if (direction == Direction.BACKWARD) {
            worldDirection.applyEuler(new THREE.Euler(
                0,
                Math.PI,
                0,
                'XYZ'
            ))
        } else if (direction == Direction.LEFT) {
            worldDirection.applyEuler(new THREE.Euler(
                0,
                Math.PI * 0.5,
                0,
                'XYZ'
            ))
        }

        const collideData = this._raycast(worldDirection);

        return collideData != null ?
            Math.max(0, collideData.distance - 0.5)
            : 1000; // big enough to not constraint movements
    }
}

export { Collider, Direction }
