import { TextureLoader, Cache } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import assets from '../../../data/models/Detergent3.glb';

import corn_flakes from '../../../data/textures/3d/corn_flakes.png';
import detergent_poster from '../../../data/textures/3d/Detergent_posterD.png';
import detergent from '../../../data/textures/3d/detergent.png';
import rice_bag from '../../../data/textures/3d/rice bag.png';
import rice_texture_seamless from '../../../data/textures/3d/rice-polished-seamless-texture.jpg';
import scent_booster from '../../../data/textures/3d/scent Booster.png';
import uv_names from '../../../data/textures/3d/uv namesD.jpg';
import bg_image from '../../../data/textures/3d/BG.png'

export default class Loader3D {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.GLBLoader = new GLTFLoader();

    this._count = 0;
  }

  load() {
    const objects = [
      { name: 'assets', asset: assets }
    ];

    const textures = [
      { name: 'corn_flakes', asset: corn_flakes },
      { name: 'detergent_poster', asset: detergent_poster },
      { name: 'detergent', asset: detergent },
      { name: 'rice_bag', asset: rice_bag },
      { name: 'rice_texture_seamless', asset: rice_texture_seamless },
      { name: 'scent_booster', asset: scent_booster },
      { name: 'uv_names', asset: uv_names },
      { name: 'bg_image', asset: bg_image }
    ];

    this._count = objects.length + textures.length;

    return new Promise((resolve, reject) => {
      if (this._count === 0)
        resolve(null);

      objects.forEach((obj, i) => {
        this.GLBLoader.load(obj.asset, (object3d) => {
          Cache.add(obj.name, object3d);
          this._count--;

          if (this._count === 0)
            resolve(null);
        });
      });

      textures.forEach((txt) => {
        const textureMain = this.textureLoader.load(txt.asset);
        textureMain.flipY = false;
        Cache.add(txt.name, textureMain);

        this._count--;

        if (this._count === 0)
          resolve(null);
      });
    });
  }
}