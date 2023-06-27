import { call } from "file-loader";
import * as THREE from "three";

export default class MoveController extends THREE.Object3D {
    constructor() {
        super();
        this._playFill = 0;
        //this one controls detergent movement
        this._screenWidth = window.innerWidth;
        this._canMove = false;
        this._isDown = false;
        this._layout2d = null;
        this._playerX = null;
        this._playerY = null;
        this._detergent = null;
        this._fill = null;
        this._emptyContainer = null;

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
            this._getMousePosition(x, y, this._detergent, this._emptyContainer);
        }
    }

    onDown() {
        if (this._canMove) {
            this._detergent.rotateDown();
        }
        this._isDown = true;
    }

    onUp() {
        if (this._canMove) {
            this._detergent.rotateUp();
        }
        this._isDown = false;
    }

    _getMousePosition(x, y, detergent, emptyContainer) {

        const normalizedX = (x / this._screenWidth) * 400 - 200;
        this._playerX = normalizedX;
        this._playerY = y;
        this._moveDetergent(detergent, emptyContainer);
    }

    _moveDetergent(detergent, emptyContainer) {
        const speed = -0.002;
        const maxDistance = 300;
        const maxY = 30;

        if (this._canMove && this._isDown) {
            const clampPlayerX = Math.max(-maxDistance, Math.min(maxDistance, this._playerX));
            const clampPlayerY = Math.max(-maxY, Math.min(maxY, this._playerY));
            detergent.position.x = -clampPlayerX * speed;
            detergent.position.y = -clampPlayerY * speed * detergent.position.x;
            detergent.rotation.z = -clampPlayerY * speed * detergent.position.x;

            if (detergent.position.x > 0.23 && detergent.position.x <= 0.45 && this._isDown) {
                this.collision();
            } else {
                this._fill.stop();
            }
        }
    }


    collision() {
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
