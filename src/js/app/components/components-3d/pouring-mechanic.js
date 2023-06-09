import * as THREE from "three";

export default class SwipeMechanic extends THREE.Object3D {
    constructor() {
        super();
        this._initView();
        this.playerX = 0;
        this.playerY = 0;
        this.screenWidth = window.innerWidth;
    }

    _initView() {
        console.log('mechanic exists in scene');
    }

    _getMousePosition(x, y, bottle, detergent, liquid) {
        const normalizedX = (x / this.screenWidth) * 400 - 200;
        this.playerX = normalizedX;
        this.playerY = y;
        console.log('player at', normalizedX, y);
        this._pourDetergent(bottle, detergent);
    }

    _pourDetergent(bottle, detergent) {

        const speed = 0.1;
        const velocity = 0.08;

        if (this.playerX >= 0 && this.playerX <= 200) {
            // Move the bottle to the left
            detergent.position.x -= speed * velocity;
        } else if (this.playerX >= -200 && this.playerX < 0) {
            // Move the detergent to the right
            detergent.position.x += speed * velocity;
        }
    }
}
