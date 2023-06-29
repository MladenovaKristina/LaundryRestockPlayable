import { Object3D, Box3, Vector3, Vector2, Raycaster, MathUtils } from "three";

export default class MoveController extends Object3D {
    constructor(raycasterPlane, camera) {
        super();
        this._raycasterPlane = raycasterPlane;
        this._camera = camera;

        this._playFill = 0;
        this._screenWidth = window.innerWidth;
        this._canMove = false;
        this._isDown = false;
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
        this.position.set(0, 2, 0);

        this._raycaster = new Raycaster();
        this._pointer = new Vector2();

        this._detergent = new Object3D();
        this._detergent.position.set(this.position.x, this.position.y, this.position.z);
        console.log(this._detergent.position);

        this._initRaycaster();
    }
    _initRaycaster() {
        this._raycaster = new Raycaster();
        this._pointer = new Vector2();
    }

    _onRaycast(x, y) {
        this._pointer.x = (x / window.innerWidth) * 2 - 1;
        this._pointer.y = -(y / window.innerHeight) * 2 + 1;

        this._raycaster.setFromCamera(this._pointer, this._camera);
        console.log(this._pointer.x);

        const intersects = this._raycaster.intersectObjects([this._raycasterPlane]);
        console.log(intersects);

        if (intersects.length < 1) return;

        this.position.x = intersects[0].point.x;
        this.position.y = intersects[0].point.y - 0.15;
        this.position.z = 0;
        this._moveDetergent(this.position.x, this.position.y, this.position.z);
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
        // this._detergent.position.set(this.position.x, this.position.y, this.position.z);

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
        if (!this._isDown) return;
        this._onRaycast(x, y);
    }

    onDown(x, y) {
        this._isDown = true;
        this._onRaycast(x, y);
    }

    onUp() {
        this._detergent.rotateUp();
        this._isDown = false;
        if (this._fill.fillTween && this._fill.fillTween.isPlaying()) {
            this._fill.stop();
        }
    }

    _moveDetergent(x, y, z) {
        const center = 0;
        const pourThresholdMin = center + 0.2;
        const pourThresholdMax = center + 0.3;
        this._detergent.position.set(x, y, z);

        if (this._canMove && this._isDown) {
            if (
                x >= pourThresholdMin &&
                x <= pourThresholdMax
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