import EmptyContainer from "./empty-container";
import DetergentBottle from "./detergent-bottle";
import Environment from "./environment";
import MoveController from "./move-controller";
import Menu from "./menu";
import Fill from "./fill";
import { Group } from "three";

export default class Layout3D extends Group {
    constructor(camera, cameraController, scene, renderer) {
        super();
        this._camera = camera;
        this._cameraController = cameraController;
        this._scene = scene;
        this._renderer = renderer;
        this._canPlay = false;
        this._onFinish = false;

        this._init();
    }

    _init() {
        console.log("initializing 3d")
        this._initEmptyContainer();
        this._initMoveController();

        this._initDetergentBottle();
        this._initEnvironment();
        this._initMenu();
        this._initFill();
    }

    _initEmptyContainer() {
        this._emptyContainer = new EmptyContainer();
        this._scene.add(this._emptyContainer);
    }

    _initDetergentBottle() {
        this._detergentBottle = new DetergentBottle();
        this._scene.add(this._detergentBottle);
        this._moveController.setBottleView(this._detergentBottle);
    }

    _initFill() {
        this._fill = new Fill();
        this._scene.add(this._fill);
        this._moveController.setFillView(this._fill);
    }

    _initMenu() {
        this._menu = new Menu();
        this._scene.add(this._menu);
    }

    _initEnvironment() {
        this._environment = new Environment();
        this._scene.add(this._environment);
    }

    _initMoveController() {
        this._moveController = new MoveController();
        this._scene.add(this._moveController);
    }

    async animationController(state, callback = null) {
        if (state === "start") {
            await this._emptyContainer.removeCap();
            await this._detergentBottle.removeDetergentCap();
            this._detergentBottle.adjustDetergentPosition();

            if (callback && typeof callback === "function") {
                callback();
            }
        }

        if (state === "gameplay") {
            this._detergentBottle.stopIdleAnimation();
            this._canPlay = true;
            this._moveController.start();
        } else {
            return;
        }
    }

    setBottleView(obj) {
        this._moveController.setBottleView(obj);
    }

    start() { }

    onDown(x, y) {
        this._moveController.onDown();
    }

    onUp() {
        this._moveController.onUp();
    }

    onMove(x, y) {
        this._moveController.onMove(x, y);
    }

    enableStoreMode() { }

    update(dt) {
        TWEEN.update();
    }
}
