import { Black, MessageDispatcher } from "../../utils/black-engine.module";
import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";
import Model from "../../data/model";
import Helpers from "../helpers/helpers";
import Layout2D from "./components-2d/layout-2d";
import Layout3D from "./components-3d/layout-3d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";

const STATES = {
  INTRO: 0, // if we want to make some action before the player interaction
  GAMEPLAY: 1,
  OUTRO: 2, // if we want to make some action before the end screen
  FINAL: 3 // end screen
};

export default class Game {
  constructor(scene, camera, renderer) {
    this.messageDispatcher = new MessageDispatcher();
    this.onFinishEvent = 'onFinishEvent';


    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;
    this._state = STATES.INTRO;

    this._clicks = 0;
    this.clicked = 0;
    this.isGameplay = false;
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
    this._init3D();
    this._cameraController = new CameraController(this._camera.threeCamera);
  }

  _initUI() {
    this._layout2d = new Layout2D();
    Black.stage.add(this._layout2d);

    this._layout2d.onPlayBtnClickEvent((msg) => {
      this._state = STATES.FINAL;
      this.messageDispatcher.post(this.onFinishEvent);
    });
  }

  _init3D() {
    this._layout3d = new Layout3D(this._camera, this._cameraController, this._scene, this._renderer);
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

  _countTime() {
    if (this._isStore) return;

    if ((Date.now() - this._startTime) / 1000 > this._timeToStore) {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown || ConfigurableParams.isPN())
        this._onFinish();
      else
        this._storeOnDown = true;

      console.log('time');
    }
  }
  _ctaController() {
    this.clicked++;
    if (this.clicked === 1) {
      this._layout2d._cta1.hide();
      this._layout2d._targetlight.hide();
      this._layout3d.animationController("start", () => {
        this.zoom();
        this.isGameplay = true;
        this._state = STATES.GAMEPLAY;
        this._layout2d._cta2.show();
        this._layout2d._progressbar.show();
      });
    }

    if (this.clicked > 1) {
      this._layout2d._cta2.hide();
      this._layout3d.animationController("gameplay", () => {
        this._layout2d.showHint();
      });
    }
  }

  zoom() {
    if (!this.isGameplay) {
      const targetFov = this._camera.threeCamera.fov - 15;
      const targetPositionY = this._camera.threeCamera.position.y + 4;
      const duration = 1000;

      new TWEEN.Tween(this._camera.threeCamera)
        .to({ fov: targetFov, positionY: targetPositionY }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => this._camera.threeCamera.updateProjectionMatrix())
        .delay(2000)
        .start();
    }
  }


  onDown(x, y) {
    this._ctaController();
    this._layout2d.onDown(x, y);
    this._layout3d.onDown(x, y);

    const downloadBtnClicked = this._layout2d.onDown(x, y);
    if (downloadBtnClicked)
      return;

    this._isDown = true;
    this._lastClickTime = Date.now();

    if (this._storeOnDown)
      this._onFinish();

    this._countClicks();
  }

  onMove(x, y) {
    if (this._state !== STATES.GAMEPLAY)
      return;

    this._layout2d.onMove(x, y);
    this._layout3d.onMove(x, y);
  }

  onUp() {
    this._isDown = false;
    this._layout2d.onUp();
    this._layout3d.onUp();
  }

  _countClicks() {
    if (this._isStore)
      return;

    this._clicks++;
    if (ConfigurableParams.isXClick() && this._clicks >= this._clicksToStore) {
      this._onFinish();
      console.log('clicks');
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

  _onFinish() {
    if (this._state === STATES.FINAL)
      return;

    this._state = STATES.FINAL;

    if (ConfigurableParams.isPN()) {
      if (Model.platform === 'vungle')
        parent.postMessage('complete', '*');

      if (ConfigurableParams.getData()['audio']['sound_final_enabled']['value'])
        SoundsController.playWithKey('win');

      this.enableStoreMode();
    } else {
      if (Date.now() - this._lastClickTime < 1500 || this._isDown)
        this.messageDispatcher.post(this.onFinishEvent);
      else
        this._storeOnDown = true;
    }
  }

  enableStoreMode() {
    if (this._isStore)
      return;

    this._isStore = true;
    this._state = STATES.FINAL;

    SoundsController.playWithKey('win');

    this._layout2d.enableStoreMode();
  }

  onUpdate(dt) {
    if (this._isStore)
      return;

    dt = Math.min(dt, 0.02);
  }

  onResize() {
    this._cameraController.onResize();
  }
}
