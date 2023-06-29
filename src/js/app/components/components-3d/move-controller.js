import { Object3D, Box3, Vector3, MathUtils } from "three";

export default class MoveController extends Object3D {
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
        const bbox = new Box3().setFromObject(this._detergent);
        this.size = new Vector3();
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

    onDown(x, y) {
        this._isDown = true;
        // this._getMousePosition(x, y);
    }

    onUp() {
        this._detergent.rotateUp();
        this._isDown = false;
        if (this._fill.fillTween && this._fill.fillTween.isPlaying()) {
            this._fill.stop();
        }
    }

    _getMousePosition(x, y) {
        const normalizedX = x / this._screenWidth; // Normalize x coordinate to range [0, 1]
        this._playerX = normalizedX; // Map normalized x coordinate to range [-1, 1]
        this._moveDetergent(this._playerX);
    }

    _moveDetergent(x) {
        const center = 0;
        const speed = -0.002;
        const pourThresholdMin = center + 0.2;
        const pourThresholdMax = center + 0.3;

        if (this._canMove && this._isDown) {
            this._playerX = MathUtils.clamp(this._playerX, 0, 1); // Clamp _playerX between 0 and 1
            this._detergent.position.x = x - this.size.x * 0.3;

            if (
                this._detergent.position.x >= pourThresholdMin &&
                this._detergent.position.x <= pourThresholdMax
            ) {
                this.collision();
            } else {
                this._fill.stop();
                this._detergent.isPlaying = false;
                this._detergent.pause = false;
                this._detergent.rotateUp();
            }
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
