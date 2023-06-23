import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { call } from "file-loader";

export default class SceneController extends THREE.Object3D {
    constructor(layout2d, layout3d, camera) {
        super();
        this._camera = camera;
        this._canMove = false;
        this._interacions = 0
        this._layout2d = layout2d;
        this._layout3d = layout3d;
        this.start();
    }
    start() {
        this.sceneOne();
    }
    onDown() {
        this._interacions++;

        if (this._interacions == 1) this.sceneTwo();
        if (this._interacions == 3)
            this.sceneThree();
    }

    zoom(callback) {
        if (!this._canMove) {
            const targetFov = this._camera.fov - 10;
            const targetPositionY = this._camera.position.y + 8;
            const duration = 1000;


            new TWEEN.Tween(this._camera)
                .to({ fov: targetFov, positionY: targetPositionY }, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this._camera.updateProjectionMatrix();
                })
                .onComplete(() => {
                    callback();
                })
                .start();
        }

    }

    zoomtest(callback) {
        this._camera.updateProjectionMatrix();
        this._camera.rotation.y = Math.PI / 2;
        this._camera.position.x = 3;
        this._camera.position.z = 0;
        callback();
    }

    sceneOne() {
        console.log("scene1");
        this._layout2d.showCTA1();
    }

    sceneTwo() {
        console.log("scene2");
        this._layout2d._cta1.hide();
        this._layout2d._targetlight.hide(() => {
            this._layout3d._emptyContainer.removeCap();
            this._layout3d._detergentBottle.removeDetergentCap(() => {
                this._layout3d._detergentBottle.raise(this._layout3d._emptyContainer.position.z, () => {
                    this.zoom(() => {
                        this._layout2d.showCTA2();
                    });
                    this._layout3d._detergentBottle.idle();
                });
            });
        });
    }

    sceneThree() {
        setTimeout(() => {
            this._layout3d._detergentBottle.stopIdle(() => {
                this._layout3d._moveController.start();
                this._layout2d._cta2.hide();
            });

        }, 500);
        setTimeout(() => { }, 500);
    }
}
