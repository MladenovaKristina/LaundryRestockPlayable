import * as THREE from "three";

export default class MoveController extends THREE.Object3D {
    constructor() {
        super();
        this._playFill = 0;

        this._screenWidth = window.innerWidth;
        this._canMove = false;
        this._isDown = false;

        this._playerX = null;
        this._playerY = null;
        this._detergent = null;
        this._fill = null;
        this._playFill = 0;
    }

    start() {
        this._canMove = true;
    }

    setBottleView(obj) {
        this._detergent = obj;
    }

    setFillView(obj) {
        this._fill = obj;
    }

    onMove(x, y) {
        if (this._canMove) {
            this._getMousePosition(x, y, this._detergent);
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

    _getMousePosition(x, y, detergent) {

        const normalizedX = (x / this._screenWidth) * 400 - 200;
        this._playerX = normalizedX;
        this._playerY = y;
        console.log(this._playerX, this._playerY)
        this._moveDetergent(detergent);
    }

    _moveDetergent(detergent) {

        const speed = -0.01;
        const maxDistance = 500;

        const clampPlayerX = Math.max(-maxDistance, Math.min(maxDistance, this._playerX));
        detergent.position.x = -clampPlayerX * speed;

        if (detergent.position.x > 0.13 && detergent.position.x <= 0.3 && this._isDown) {
            this.collision();
        } else {
            this._fill.stop();
        }
    }

    collision() {
        if (this._playFill === 0) {
            this._playFill++;
            this._fill.show();
        } else {
            if (this._fill.fillTween && !this._fill.fillTween.isPlaying()) {
                this._fill.resume();
            }
        }
    }
}
