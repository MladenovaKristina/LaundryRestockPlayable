import EmptyContainer from "./empty-container";
import DetergentBottle from "./detergent-bottle";
import Environment from "./environment";
import MoveController from "./move-controller.js";
import Menu from "./menu";
import Fill from "./fill";
import { MessageDispatcher } from "../../../utils/black-engine.module";
import { Group } from "three";

export default class Layout3D extends Group {
    constructor(camera, cameraController, scene, renderer, raycasterPlane) {
        super();
        this._camera = camera;
        this._cameraController = cameraController;
        this._scene = scene;
        this._renderer = renderer;
        this._raycasterPlane = raycasterPlane;

        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';

        this._3dclick = 0;
        this._gameplay = false;

        this._init();
        this.start();
    }

    _init() {
        this._initMoveController();
        this._initDetergentBottle();
        this._initEmptyContainer();
        this._initFill();
        this._initEnvironment();
        this._initMenu();
    }

    _initMoveController() {
        this._moveController = new MoveController(this._raycasterPlane, this._camera.threeCamera);
        this._scene.add(this._moveController);
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
        this._fill.messageDispatcher.on(this._fill.onFinishEvent, (msg) => {
            this._moveController._canMove = false;
            this._detergentBottle.end();
            this.onFinishEvent = 'onFinishEvent';
            this.messageDispatcher.post(this.onFinishEvent);

        });

    }

    _initMenu() {
        this._menu = new Menu();
        this._scene.add(this._menu);
    }

    _initEnvironment() {
        this._environment = new Environment();
        this._scene.add(this._environment);
    }

    setFillView(obj) {
        this._moveController.setBottleView(obj);
    }
    setBottleView(obj) {
        this._moveController.setBottleView(obj);
    }

    start() {
    }

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
