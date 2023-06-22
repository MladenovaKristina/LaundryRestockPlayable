import * as THREE from "three";
import { MessageDispatcher } from "../../../utils/black-engine.module";
export default class MoveController extends THREE.Object3D {
    constructor() {
        super();
        this.playerX = 0;
        this.playerY = 0;
        this.detergent = null;
        this.fill = null;
        this.playFill = 0;

        this.screenWidth = window.innerWidth;
        this._canMove = false;
    }
    start() {
        this.detergent.stopIdleAnimation();
        this._canMove = true;
    }
    setBottleView(obj) {
        this.detergent = obj;
    }
    setFillView(obj) {
        this.fill = obj;
    }

    onMove(x, y) {
        if (this._canMove) {
            this.getMousePosition(x, y, this.detergent);
            this.moveDetergent(this.detergent);
        }
    }

    onDown() {
        if (this._canMove) {
            this.detergent.rotateDown();
        }
        this.isDown = true;
    }

    onUp() {
        if (this._canMove) this.detergent.rotateUp();
        this.isDown = false;
    }

    getMousePosition(x, y, detergent) {
        const normalizedX = (x / this.screenWidth) * 400 - 200;
        this.playerX = normalizedX;
        this.playerY = y;

    }

    moveDetergent(detergent) {
        const speed = -0.01;
        const maxDistance = 500;

        const clampPlayerX = Math.max(-maxDistance, Math.min(maxDistance, this.playerX));
        detergent.position.x = -clampPlayerX * speed;

        if (detergent.position.x > 0.13 && detergent.position.x <= 0.3 && this.isDown) {
            this.collision();
        } else { this.fill.stop(); }
    }

    collision() {
        if (this.playFill === 0) {
            this.playFill++;
            this.fill.show();
        } else {
            if (!this.fill.fillTween || !this.fill.fillTween.isPlaying()) {
                this.fill.resume();
            }
        }
    }


}
