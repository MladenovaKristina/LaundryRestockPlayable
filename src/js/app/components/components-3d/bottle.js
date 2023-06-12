import * as THREE from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
export default class Bottle extends THREE.Object3D {
    constructor() {
        super();
        this.height = 0;
        this.top = 0.24;
        this.bottom = 0.25;
        this._initView();
    }

    _initView() {
        const asset = THREE.Cache.get('assets').scene.children;

        const bottle = this._bottle = asset[1].clone();
        bottle.scale.set(0.01, 0.01, 0.01);
        bottle.position.set(0, 0, 0);
        bottle.rotation.z = Math.PI;
        this.add(bottle);

        const bottleLabel = bottle.children ? bottle.children.find(x => x.name === 'detergent1') : null;
        bottleLabel.children[1].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0,
            map: THREE.Cache.get('uv_names'),
            reflectivity: 10,
            side: THREE.DoubleSide,
        });
        bottleLabel.children[1].castShadow = true;

        const bottleVessel = bottle.children ? bottle.children.find(x => x.name === 'detergent1') : null;

        bottleVessel.children[0].material = new THREE.MeshPhysicalMaterial({
            color: 0x999999,
            roughness: 0,
            reflectivity: 10,
            metalness: 0,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
        });
        bottleVessel.castShadow = true;

        const bottleCap = this.bottleCap = bottle.children[0];
        bottleCap.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            reflectivity: 10,
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        bottleCap.visible = true;

        const fillGeometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
        const fillMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
        this._cylinder = new THREE.Mesh(fillGeometry, fillMaterial);
        this._cylinder.position.set(0, 0.1, 0);
        this.add(this._cylinder);
        this._cylinder.visible = false;
    }

    removeCap() {
        const removeCap = new Tween(this.bottleCap.rotation)
            .to({ y: Math.PI }, 2000)
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

    fillAnimate(callback) {
        this._cylinder.visible = true;

        if (this.height <= 0.4) {
            this.height += 0.002;
            if (this.bottom < this.top) {
                this.bottom += this.height;
            }
            this._cylinder.geometry.dispose();
            this._cylinder.geometry = new THREE.CylinderGeometry(0.28, this.bottom, this.height, 32);
            this._cylinder.position.setY(0.1 + this.height / 2);
        }

        if (this.height >= 0.4 && callback) {
            callback();
        }

    }
}
