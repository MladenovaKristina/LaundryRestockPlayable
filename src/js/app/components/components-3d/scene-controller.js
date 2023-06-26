import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

export default class SceneController extends THREE.Object3D {
    constructor(layout2d, layout3d, camera) {
        super();
        this._camera = camera;
        this._canMove = false;
        this._interactions = 0;
        this._gameplay = false;
        this._sceneHasPlayed = false;
        this._layout2d = layout2d;
        this._layout3d = layout3d;
        this.start();
    }

    start() {
        this.sceneZero();
    }

    onDown() {
        this._interactions++;

        if (this._interactions === 1) {
            this.sceneOne();
        } else if (this._interactions > 1 && this._gameplay && !this._sceneHasPlayed) {
            this.sceneTwo();
        }
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

    sceneZero() {
        console.log("scene0");
        this._layout2d.showCTA1();
    }

    sceneOne() {
        console.log("scene1");
        this._layout2d._cta1.hide();
        this._layout2d._targetlight.hide(() => {
            this._layout3d._emptyContainer.removeCap();
            this._layout3d._detergentBottle.removeDetergentCap(() => {
                this._layout3d._detergentBottle.raise(this._layout3d._emptyContainer.position.z, () => {
                    this.zoom(() => {
                        this._layout2d.showCTA2();
                        this._layout2d._progressbar.show();

                        this._gameplay = true;
                    });
                    this._layout3d._detergentBottle.idle();
                });
            });
        });
    }

    sceneTwo() {
        this._sceneHasPlayed = true;
        console.log("scene2");
        this._layout3d._detergentBottle.stopIdle(() => {
            this._layout3d._moveController.start(this._layout2d);
            this._layout2d._cta2.hide();
        });
    }
}
