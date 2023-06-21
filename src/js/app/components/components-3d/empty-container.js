import * as THREE from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
export default class EmptyContainer extends THREE.Object3D {
    constructor() {
        super();
        this.height = 0;
        this.top = 0.24;
        this.bottom = 0.25;
        this._initView();
    }

    _initView() {
        const asset = THREE.Cache.get('assets').scene.children;

        const bottle = this._bottle = asset[1];
        bottle.castShadow = true;
        bottle.scale.set(0.01, 0.01, 0.01);
        bottle.position.set(0, 0, 0);
        bottle.rotation.z = -0.3;
        this.add(bottle);

        const bottleLabel = bottle.children ? bottle.children.find(x => x.name === 'detergent1') : null;
        bottleLabel.children[1].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0,
            map: THREE.Cache.get('uv_names'),
            reflectivity: 10,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        });
        bottleLabel.children[1].castShadow = true;

        const bottleVessel = bottle.children ? bottle.children.find(x => x.name === 'detergent1') : null;

        bottleVessel.children[0].material = new THREE.MeshPhysicalMaterial({
            color: 0x999999,
            roughness: 0,
            metalness: 0,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
        });
        bottleVessel.castShadow = true;
        bottleVessel.children[0].castShadow = true;

        const bottleCap = this.bottleCap = bottle.children[0];
        bottleCap.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            reflectivity: 10,
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        bottleCap.visible = true;
        bottleCap.castShadow = true;

    }

    removeCap() {
        const removeCap = new Tween(this.bottleCap.rotation)
            .to({ y: Math.PI }, 2000)
            .delay(500)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {
                this.bottleCap.visible = false;
            })
            .start();

        function remove() {
            requestAnimationFrame(remove);
            removeCap.update();
        }

        remove();
    }


}
