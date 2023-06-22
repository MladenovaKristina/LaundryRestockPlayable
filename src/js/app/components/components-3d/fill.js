import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export default class Fill extends THREE.Object3D {
    constructor() {
        super();
        this.height = 0;
        this.top = 0.26;
        this.bottom = 0.20;

        this.fillTween = null;
        this.visible = false;
        this._initView();
    }

    _initView() {
        console.log("fill");
        var geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
        geometry.translate(0, this.height * 1.3, 0); // Translate the geometry to align the bottom to 0,0,0
        var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
        var fill = new THREE.Mesh(geometry, material);
        this.add(fill);
    }

    show() {
        this.visible = true;
    }

    fill(callback) {
        const targetHeight = 0.5;
        const targetTop = 0.27;
        const targetBottom = 0.23;

        this.fillTween = new TWEEN.Tween(this)
            .to({ top: targetTop, bottom: targetBottom, height: targetHeight, }, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                console.log("filling");
                this.children[0].geometry.dispose();
                this.children[0].geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
                this.children[0].geometry.translate(0, this.height / 2, 0);
                if (this.height >= targetHeight) {
                    callback();
                }
            })
            .onComplete(() => {
                this.fillTween = null; // Reset the fillTween reference after completion
            })
            .start();
        animate();

    }
    stopFill() {
        if (this.fillTween) {
            this.fillTween.stop();
        }
    }
    animate() {
        if (TWEEN.update()) {
            requestAnimationFrame(animate);
        }
    }

}
