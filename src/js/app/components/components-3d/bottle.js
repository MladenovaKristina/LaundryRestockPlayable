import * as THREE from "three";
import Helpers from "../../helpers/helpers";

import { Tween, } from "../../../utils/black-engine.module";
export default class Bottle extends THREE.Object3D {
    constructor() {
        super();

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

        const bottleCap = bottle.children[0].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            reflectivity: 10,
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        bottleCap.visible = true;

        const fillGeometry = new THREE.CylinderGeometry(0.28, 0.24, 0.5, 32);
        const fillMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3 });
        const cylinder = new THREE.Mesh(fillGeometry, fillMaterial);
        cylinder.position.set(0, 0.3, 0);
        this.add(cylinder);
        cylinder.visible = true;


    }
    fillAnimate() {

    }
}