import { AmbientLight, DirectionalLight } from 'three';

export default class Light {
  constructor(scene) {
    this._scene = scene;
    this._init();
  }

  _init() {
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    ambientLight.visible = true;
    this._scene.add(ambientLight);
    Light.ambientLight = ambientLight;

    const directionalLight = new DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(-1, 4, 0.5); // looks at (0; 0; 0)
    directionalLight.visible = true;
    this._scene.add(directionalLight);

    const bidirectionalLight = new DirectionalLight(0xffffff, 0.4);
    bidirectionalLight.position.set(4, 3, 0.5); // looks at (0; 0; 0)
    bidirectionalLight.visible = true;
    this._scene.add(bidirectionalLight);
    Light.bidirectionalLight = bidirectionalLight;

    Light.directionalLight = directionalLight;

    directionalLight.shadow.camera.left = -6;
    directionalLight.shadow.camera.right = 6;
    directionalLight.shadow.camera.top = 8;
    directionalLight.shadow.camera.bottom = -6;

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;

    bidirectionalLight.shadow.camera.left = -6;
    bidirectionalLight.shadow.camera.right = 6;
    bidirectionalLight.shadow.camera.top = 8;
    bidirectionalLight.shadow.camera.bottom = -6;

    bidirectionalLight.castShadow = true;
    bidirectionalLight.shadow.mapSize.width = 1024;
    bidirectionalLight.shadow.mapSize.height = 1024;
    bidirectionalLight.shadow.camera.near = 0.1;
    bidirectionalLight.shadow.camera.far = 100;
  }
}

Light.ambientLight = null;
Light.directionalLight = null;
Light.bidirectionalLight = null;
