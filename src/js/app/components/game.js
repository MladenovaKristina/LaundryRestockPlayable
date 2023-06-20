import { Black, MessageDispatcher } from "../../utils/black-engine.module";
import * as THREE from 'three';
import Model from "../../data/model";
import Helpers from "../helpers/helpers";
import Layout2D from "./components-2d/layout-2d";
import CameraController from "./components-3d/camera-controller";
import SoundsController from "./kernel/soundscontroller";
import ConfigurableParams from "../../data/configurable_params";
import Bottle from "./components-3d/bottle";
import Environment from "./components-3d/enviroment";
import DetergentBottle from "./components-3d/animated-objects";
import Menu from "./components-3d/menu";
import SwipeMechanic from "./components-3d/pouring-mechanic";

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
    this.flag = false;
    this.playingFlag = false;
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
    this._initEnvironment();
    this._initBottle();
    this._initDetergentBottle();
    this._initMenu();
    this._initCameraPosition();
    this._initSwipeMechanic();
  }

  _initUI() {
    this._layout2d = new Layout2D();
    Black.stage.add(this._layout2d);

    this._layout2d.onPlayBtnClickEvent((msg) => {
      this._state = STATES.FINAL;
      this.messageDispatcher.post(this.onFinishEvent);
    });
  }

  _initBottle() {
    this._bottle = new Bottle();
    this._scene.add(this._bottle);
  }

  _initDetergentBottle() {
    this._animatedObject = new DetergentBottle();
    this._scene.add(this._animatedObject);
  }

  _initMenu() {
    this._menu = new Menu();
    this._scene.add(this._menu);
  }

  _initEnvironment() {
    this._environment = new Environment();
    this._scene.add(this._environment);
  }

  _initCameraPosition() {
    this._initCameraPos = this._cameraController._camera.position.clone();
  }

  _initSwipeMechanic() {
    this._swipeMechanic = new SwipeMechanic();
    this._scene.add(this._swipeMechanic);
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

  _gameplay(x, y) {
    if (this._state === STATES.GAMEPLAY) {
      this._animatedObject.stopIdle();

      this._swipeMechanic.getMousePosition(x, y, this._bottle, this._animatedObject.detergentBottle);
      this.collision(this._animatedObject.detergentBottle.position);
    }
  }

  onDown(x, y) {
    const downloadBtnClicked = this._layout2d.onDown(x, y);
    if (downloadBtnClicked)
      return;

    this._isDown = true;
    this._lastClickTime = Date.now();

    if (this._storeOnDown)
      this._onFinish();

    this._countClicks();

    if (this._state !== STATES.GAMEPLAY)
      return;

    this._layout2d.onMove(x, y);
  }

  onMove(x, y) {
    if (this._state !== STATES.GAMEPLAY)
      return;

    this._layout2d.onMove(x, y);
    this._gameplay(x, y);
  }

  onUp() {
    this._isDown = false;
    this._layout2d.onUp();
  }

  collision(liquid) {
    if (!this.playingFlag) {
      this.playingFlag = true;
      this._animatedObject.pourLiquid();
      this._animatedObject.playAnim("pour");
      setTimeout(() => {
        this.playingFlag = false;
      }, this._animatedObject._animations.pour.duration);
    }

    if (liquid.x >= 0.35 && liquid.x <= 0.45) {
      this._layout2d.progressBar(this._animatedObject.progressPercent / 2);
      this._animatedObject.progressionAnim("fillVessel", () => {
        this.win();
      });
    }
  }

  win() {
    this.flag = false;
    this._animatedObject._liquid.visible = false;
    this._animatedObject.stopIdle();
    this._onFinish();
  }

  _countClicks() {
    if (this._isStore)
      return;

    this._clicks++;
    if (ConfigurableParams.isXClick() && this._clicks >= this._clicksToStore) {
      this._onFinish();
      console.log('clicks');
    }

    if (this._clicks === 1) {
      this.runAnimationSequence();
      this._animationInProgress = true;
    }

    if (this._clicks > 1 && !this._animationInProgress) {
      this.flag = true;
      this._state = STATES.GAMEPLAY;

      this._layout2d._cta2.hide();
      this._layout2d.showHint();
    }
  }

  async runAnimationSequence() {
    if (this._animationInProgress)
      return;

    this._animationInProgress = true;

    this._layout2d._cta1.hide();
    this._layout2d._targetlight.hide();

    this._animatedObject.removeDetergentCap();
    this._bottle.removeCap();

    setTimeout(async () => {
      await this._animatedObject.playAnim("raise");
      this._zoomIn();
      this._layout2d.showCTA2();
      this._layout2d._progressbar.show();
      this._animatedObject.idleAnimateDetergent();
      this._animationInProgress = false;
    }, 2000);
  }

  _zoomIn() {
    const targetZ = this._cameraController._camera.position.z - 1;
    const duration = 1000;
    let startTime = null;
    const initialZ = this._cameraController._camera.position.z;

    const updateCameraPosition = (timestamp) => {
      if (!startTime)
        startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const interpolatedZ = initialZ + (targetZ - initialZ) * progress;

      this._cameraController._camera.position.z = interpolatedZ;

      if (progress < 1)
        requestAnimationFrame(updateCameraPosition);
    };

    requestAnimationFrame(updateCameraPosition);
  }

  _resetCamera() {
    this._cameraController._camera.position.set(this._initCameraPos);
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
    const pos = Helpers.vector3ToBlackPosition(
      new THREE.Vector3(this._animatedObject.detergentBottle.x, this._animatedObject.detergentBottle.y, this._animatedObject.detergentBottle.z),
      this._renderer.threeRenderer,
      this._camera.threeCamera);
    const adjustedPos = pos.clone();
    adjustedPos.x -= this._camera.threeCamera.position.z * 100;
    adjustedPos.y -= this._camera.threeCamera.position.y * 100 * 2;

    this._layout2d.update2dPos(adjustedPos)
  }
}
