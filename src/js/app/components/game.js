import { Black, MessageDispatcher, Timer, GameObject } from "../../utils/black-engine.module";
import * as THREE from 'three';
import { Tween, Easing } from "@tweenjs/tween.js";
import Model from "../../data/model";
import Helpers from "../helpers/helpers";
import Layout2D from "./components-2d/layout-2d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";
import Bottle from "./components-3d/bottle";
import Environment from "./components-3d/enviroment";
import DetergentBottle from "./components-3d/detergent-bottle";
import Menu from "./components-3d/menu";

export default class Game {
  constructor(scene, camera, renderer) {

    this.messageDispatcher = new MessageDispatcher();
    this.onFinishEvent = 'onFinishEvent';

    this._scene = scene;
    this._camera = camera;

    this._renderer = renderer;
    this._bottle = null;

    this._state = STATES.INTRO;

    this._clicks = 0;
    this._startTime = 0;

    this._storeOnDown = false;
    this._lastClickTime = 0;

    this._clicksToStore = ConfigurableParams.getData()["store_details"]["go_to_market_after_x_click"]["value"];
    this._timeToStore = ConfigurableParams.getData()["store_details"]["go_to_market_after_x_time"]["value"];

    this._init();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  _init() {
    this._initUI();
    this._cameraController = new CameraController(this._camera.threeCamera);
    console.log('og', this._cameraController._camera.position)
    this._initEnvironment();
    this._initBottle();
    this._initDetergentBottle();
    this._initMenu();
  }

  start() {
    this._layout2d.showCTA1();

    this._startTime = Date.now();

    if (ConfigurableParams.isXTime()) {
      setInterval(() => {
        this._countTime();
      }, 1000);
    }
  }

  _initUI() {
    this._layout2d = new Layout2D();
    Black.stage.add(this._layout2d);

    this._layout2d.on(this._layout2d.onPlayBtnClickEvent, (msg) => {
      this._state = STATES.FINAL;
      this.messageDispatcher.post(this.onFinishEvent);
    });
  }
  _initBottle() {
    this._bottle = new Bottle();
    this._scene.add(this._bottle);
  }

  _initDetergentBottle() {
    this._detergentBottle = new DetergentBottle();
    this._scene.add(this._detergentBottle);
  }
  _initMenu() {
    this._menu = new Menu();
    this._scene.add(this._menu);
  }
  _initEnvironment() {
    this._environment = new Environment();
    this._scene.add(this._environment);
  }

  onDown(x, y) {
    const downloadBtnClicked = this._layout2d.onDown(x, y);
    if (downloadBtnClicked) return;

    this._isDown = true;
    this._lastClickTime = Date.now();

    if (this._storeOnDown) {
      this._onFinish();
    }

    this._countClicks();
  }

  onMove(x, y) {
    // if (this._state !== STATES.GAMEPLAY) return;

    this._layout2d.onMove(x, y);
  }

  onUp() {
    // if (this._state !== STATES.GAMEPLAY) return;
    this._isDown = false;

    this._layout2d.onUp();
  }

  _countClicks() {
    if (this._isStore) return;

    this._clicks++;
    if (ConfigurableParams.isXClick() && this._clicks >= this._clicksToStore) {
      this._onFinish();
      console.log('clicks');
    }

    if (this._clicks === 1) {
      this._layout2d._cta1.hide();
      this._detergentBottle.raiseDetergent(() => {
        this._layout2d.showCTA2();
        this._zoomIn();
      });
    }

    if (this._clicks === 2) {
      this._layout2d._cta2.hide();
      this._resetCamera();
    }
  }


  _zoomIn() {
    const targetPosition = new THREE.Vector3(0, 2, -1.2);
    const zoomDuration = 1000;

    const currentPosition = this._cameraController._camera.position;
    const initialFOV = this._camera.fov;

    const zoomTween = new Tween({ t: 0 })
      .to({ t: 1 }, zoomDuration)
      .easing(Easing.Quadratic.Out)
      .onUpdate((obj) => {
        const t = obj.t;
        const newPosition = currentPosition.clone().lerp(targetPosition, t);
        const newFOV = THREE.MathUtils.lerp(initialFOV, desiredFOV, t);

        this._camera.position.copy(newPosition);
        this._camera.fov = newFOV;
        this._camera.updateProjectionMatrix();
      })
      .start();
  }

  _resetCamera() {
    const initialPosition = new Vector3(0, 0, 0);
    const initialFOV = 75;

    const resetDuration = 1000;

    const currentPosition = this._camera.position.clone();
    const currentFOV = this._camera.fov;

    const resetTween = new Tween({ t: 0 })
      .to({ t: 1 }, resetDuration)
      .easing(Easing.Quadratic.Out)
      .onUpdate((obj) => {
        const t = obj.t;
        const newPosition = currentPosition.clone().lerp(initialPosition, t);
        const newFOV = THREE.MathUtils.lerp(currentFOV, initialFOV, t);

        this._camera.position.copy(newPosition);
        this._camera.fov = newFOV;
        this._camera.updateProjectionMatrix();
      })
      .start();
  }



  _countTime() {
    if (this._isStore) return;

    if (ConfigurableParams.isXTime() && (Date.now() - this._startTime) / 1000 > this._timeToStore) {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown || ConfigurableParams.isPN())
        this._onFinish()
      else
        this._storeOnDown = true;

      console.log('time');
    }
  }

  onUpdate(dt) {
    if (this._isStore) return;
    dt = Math.min(dt, 0.02);

  }

  onResize() {
    this._cameraController.onResize();
  }

  _onFinish() {
    if (this._state === STATES.FINAL) return;
    this._state = STATES.FINAL;

    if (ConfigurableParams.isPN()) {
      if (Model.platform === 'vungle') {
        parent.postMessage('complete', '*');
      }

      if (ConfigurableParams.getData()['audio']['sound_final_enabled']['value'])
        SoundsController.playWithKey('win');

      this.enableStoreMode();
    }
    else {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown)
        this.messageDispatcher.post(this.onFinishEvent);
      else
        this._storeOnDown = true;
    }
  }

  enableStoreMode() {
    if (this._isStore) return;
    this._isStore = true;
    this._state = STATES.FINAL;

    SoundsController.playWithKey('win');

    this._layout2d.enableStoreMode();
  }
}

const STATES = {
  INTRO: 0, // if we want to make some action before the player interaction
  GAMEPLAY: 1,
  OUTRO: 2, // if we want to make some action before the end screen
  FINAL: 3 // end screen
};
