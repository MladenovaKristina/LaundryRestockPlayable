import * as THREE from "three";
import Helpers from "../../helpers/helpers";

export default class CameraController {
  constructor(camera) {
    this._camera = camera;

    this._playerPosition = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3(0, 0, 0);

    this._updatePositions();
    this._updateTransform();
  }

  onResize() {
    this._updatePositions();
    this._updateTransform();

    this._camera.lookAt(0, 1, 0);
  }

  _updateTransform() {
    const position = this._getPosition();
    this._camera.position.set(0, 2, 3);
  }

  _updatePositions() {
    if (Helpers.LP(false, true)) {
      this._position = new THREE.Vector3(0.25, 1.5, 1.5);

    }
    else {
      this._position = new THREE.Vector3(0.25, 1.5, 1.5);
    }

  }

  _getPosition() {
    return this._position;
  }
}
