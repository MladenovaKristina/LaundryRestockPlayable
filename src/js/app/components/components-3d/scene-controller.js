import * as THREE from "three";
import { Vector3, Box3 } from "three";
import Helpers from "../../helpers/helpers";
import * as TWEEN from "@tweenjs/tween.js";

export default class SceneController extends THREE.Object3D {
    constructor(layout2d, layout3d, camera, renderer) {
        super();

        this._camera = camera;
        this._renderer = renderer;
        this._layout2d = layout2d;
        this._layout3d = layout3d;
        this._canMove = false;
        this._interactions = 0;
        this._gameplay = false;
        this._sceneHasPlayed = false;

        this.start();
    }

    start() {
        this.sceneZero();
    }

    onDown() {
        this._interactions++;
        this.switch();
    }
    onMove() {
        this._interactions++;
        this.switch();
    }

    switch() {
        if (this._interactions === 1) {
            this.sceneOne();
        } else if (this._interactions > 1 && this._gameplay && !this._sceneHasPlayed) {
            this.sceneTwo();
            //make it fast
        }
    }

    zoom(callback) {
        if (!this._canMove) {

            const targetFov = this._camera.fov - 12;
            const targetPositionY = this._camera.y + 10;
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
                this._layout3d._detergentBottle.raise(this._layout3d._emptyContainer, () => {
                    this.zoom(() => {
                        this.updateCTAPosition();
                        this._layout2d.showCTA2();
                        this._layout2d._progressbar.show();

                        this._gameplay = true;
                    });
                    this._layout3d._detergentBottle.idle(); //smooth it out
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
            this._layout3d.updateCTAPosition();
        });
    }

    updateCTAPosition() {
        const detergent = new Vector3(this._layout3d._detergentBottle.detergentBottle.position.x, this._layout3d._detergentBottle.detergentBottle.position.y, this._layout3d._detergentBottle.detergentBottle.position.z);
        const position = Helpers.vector3ToBlackPosition(detergent, this._renderer.threeRenderer, this._camera);
        const boundingBox = new Box3().setFromObject(this._layout3d._detergentBottle.detergentBottle);
        const size = new Vector3();
        boundingBox.getSize(size);
        const height = size.y;
        this._layout2d.update2dPos(position, height);
    }
    onResize() {
        this.updateCTAPosition();
    }
}
