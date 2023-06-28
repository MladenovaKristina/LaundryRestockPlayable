import { call } from "file-loader";
import * as THREE from "three";

export default class MoveController extends THREE.Object3D {
    constructor() {
        super();
        this._playFill = 0;
        this._screenWidth = window.innerWidth;
        this._canMove = false;
        this._isDown = null;
        this._layout2d = null;
        this._playerX = null;
        this._playerY = null;
        this._detergent = null;
        this.size = null;

        this._fill = null;
        this._emptyContainer = null;

        this._canPour = false;
        this._playFill = 0;
        this.time = 0;
    }

    start(layout2d, callback) {
        this._layout2d = layout2d;
        this._canMove = true;
        callback();
    }

    setBottleView(obj) {
        this._detergent = obj;
        const bbox = new THREE.Box3().setFromObject(this._detergent);
        this.size = new THREE.Vector3();
        bbox.getSize(this.size);
    }

    setFillView(obj) {
        this._fill = obj;
    }

    setEmptyContainerView(obj) {
        this._emptyContainer = obj;
    }

    setProgressBar(progressbar) {
        this._fill.setProgressBar(progressbar);
    }

    onMove(x, y) {
        if (this._canMove) {
            this._getMousePosition(x, y);
        }
    }

    onDown() {
        if (this._canMove) this._detergent.rotateDown();

        this._isDown = true;
    }

    onUp() {
        this._detergent.rotateUp();
        this._isDown = false;
    }

    _getMousePosition(x, y) {
        const normalizedX = (x / this._screenWidth) * 400 - 200;
        this._playerX = normalizedX - this.size.y;
        this._playerY = y;
        this._moveDetergent();
    }

    _moveDetergent(detergent, emptyContainer) {
        const speed = -0.002;
        const maxDistance = 300;
        const pourThresholdMin = 0.2;
        const pourThresholdMax = 0.3;

        if (this._canMove && this._isDown) {
            const clampPlayerX = Math.max(-maxDistance, Math.min(maxDistance, this._playerX));

            this._detergent.position.x = -clampPlayerX * speed;

            if (this._isDown) {
                if (
                    this._detergent.position.x >= pourThresholdMin &&
                    this._detergent.position.x <= pourThresholdMax
                ) {
                    console.log(this._detergent.position.x)
                    this.collision();
                } else {
                    this._fill.stop();
                    this._detergent.isPlaying = false;
                    this._detergent.pause = false;
                    this._detergent.rotateUp();

                }
            }
            // else {
            //     this._detergent.rotateUp();
            // }
        }
    }

    collision() {
        this._detergent.liquid.visible = true;
        this._detergent.pour();
        if (this._playFill === 0) {
            this._playFill++;
            this._fill.show();
            this._layout2d.showHint();
        } else {
            if (this._fill.fillTween && !this._fill.fillTween.isPlaying()) {
                this._layout2d.progressBar(this._fill.progress * 2);
                this._fill.resume();
            }
        }
    }
}
