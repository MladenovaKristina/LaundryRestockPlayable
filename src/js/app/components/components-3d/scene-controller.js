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
        this._sceneOnePlayed = false;
        this._sceneTwoPlayed = false;
        this.isLandscape = null;
        this.start();
    }

    start() {
        this.sceneZero();
    }

    onDown() {
        if (this._interactions === 0 && !this._sceneOnePlayed) {
            this._interactions++;
            this.sceneOne();
        }
    }

    onMove() {
        if (this._sceneOnePlayed && !this._sceneTwoPlayed) {
            this.sceneTwo();
        }
    }

    zoom(callback) {
        if (!this._canMove) {
            let targetPositionY = 0;
            const targetFov = this._camera.fov - 12;
            const duration = 1000;

            new TWEEN.Tween(this._camera)
                .to({ fov: targetFov }, duration)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .onUpdate(() => {
                    if (this.isLandscape) {
                        this._camera.position.y += 0.008;
                    } else {
                        this._camera.position.y += 0.005;
                    }
                    this._camera.updateProjectionMatrix();
                })
                .delay(500)
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
        this._sceneOnePlayed = true;
        this._layout2d._cta1.hide();
        this._layout2d._targetlight.hide(() => {
            this._layout3d._emptyContainer.removeCap();
            this._layout3d._detergentBottle.removeDetergentCap(() => {
                this._layout3d._detergentBottle.raise(this._layout3d._emptyContainer, () => {
                    this._layout3d._detergentBottle.idle(); //smooth it out
                });
                this.zoom(() => {
                    this.updateCTAPosition();
                    this._layout2d.showCTA2();
                    this._layout2d._progressbar.show();
                });
            });
        });
    }

    sceneTwo() {
        if (!this._sceneTwoPlayed) {
            console.log("scene2");
            this._layout3d._detergentBottle.stopIdle(() => {
                this._layout2d._cta2.hide();
                this._sceneTwoPlayed = true;
                this.sceneThree();
            });
        }
    }

    sceneThree() {
        console.log("scene3");
        this._layout3d._moveController.start(this._layout2d, () => {
            this._gameplay = true;
            this._canMove = true;
        });
        this._layout3d._moveController.setProgressBar(this._layout2d._progressbar);
    }

    updateCTAPosition() {
        const detergent = new Vector3(
            this._layout3d._detergentBottle.detergentBottle.position.x,
            this._layout3d._detergentBottle.detergentBottle.position.y,
            this._layout3d._detergentBottle.detergentBottle.position.z
        );
        const position = Helpers.vector3ToBlackPosition(
            detergent,
            this._renderer.threeRenderer,
            this._camera
        );
        const boundingBox = new Box3().setFromObject(
            this._layout3d._detergentBottle.detergentBottle
        );
        const size = new Vector3();
        boundingBox.getSize(size);
        const height = size.y;
        this._layout2d.update2dPos(position, height);
    }

    onResize() {
        this.updateCTAPosition();
        console.log("i update");
        if (window.innerWidth > window.innerHeight) {
            this.isLandscape = true;
        } else {
            this.isLandscape = false;
        }
    }
}
