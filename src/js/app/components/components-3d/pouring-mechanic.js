import * as THREE from "three";

export default class SwipeMechanic extends THREE.Object3D {
    constructor() {
        super();
        this.playerX = 0;
        this.playerY = 0;
        this.screenWidth = window.innerWidth;
    }

    getMousePosition(x, y, bottle, detergent) {
        const normalizedX = (x / this.screenWidth) * 400 - 200;
        this.playerX = normalizedX;
        this.playerY = y;
        this.moveDetergent(detergent);
    }

    moveDetergent(detergent) {
        const speed = -0.01;
        const maxDistance = 150;

        if (this.playerX >= -maxDistance && this.playerX <= maxDistance) {
            detergent.position.x = -this.playerX * speed;
        } else if (this.playerX < -maxDistance) {
            detergent.position.x = maxDistance * speed;
        } else if (this.playerX > maxDistance) {
            detergent.position.x = -maxDistance * speed;
        }
    }
}
