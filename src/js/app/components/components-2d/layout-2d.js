import { Black, DisplayObject, Rectangle, Sprite } from '../../../utils/black-engine.module';
import model from '../../../data/model';
import Helpers from '../../helpers/helpers';
import PlayButton from './play-button';
import Endscreen from './endscreen';
import ConfigurableParams from '../../../data/configurable_params';
import TopText from './top-text';
import Tutorial from './tutorial';
import CTA2 from './cta2';
import CTA1 from './cta1';
import ReferencePhoto from './ref-photo';
import ProgressBar from './progressbar';
import TargetLight from './targetlight'

// works as a main class in 2D playables
export default class Layout2D extends DisplayObject {
  constructor() {
    super();
    this.onPlayBtnClickEvent = 'onPlayBtnClickEvent';
    this.onActionClickEvent = 'onActionClickEvent';
    this.fill = 0;
    this._platform = model.platform;
    this._downloadBtn = null;
    this._logoGoogle = null;
    this._endScreen = null;
    this._click = 0;
    this._isStaticStoreMode = false;
  }

  onAdded() {
    this._topText = new TopText();
    this.add(this._topText);

    this._refPhoto = new ReferencePhoto();
    this.add(this._refPhoto);

    this._tutorial = new Tutorial();
    this.add(this._tutorial);

    this._targetlight = new TargetLight();
    this.add(this._targetlight);

    this._cta1 = new CTA1();
    this.add(this._cta1);

    this._cta2 = new CTA2();
    this.add(this._cta2);
    this._createEndscreen();

    this._progressbar = new ProgressBar();
    this.add(this._progressbar);

    this._createLogo();
    this._createDownloadBtn();

    this.onResize();
    Black.stage.on('resize', this.onResize, this);
  }

  onResize() {
    const bb = Black.stage.bounds;

    this._topText.onResize();
    this._topText.x = bb.left;
    this._topText.y = bb.top + Number(ConfigurableParams.getData()["top_text"]["top_title_offset"]["value"]);

    this._refPhoto.x = bb.left + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["x"]);
    this._refPhoto.y = bb.top + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["y"]);
    if (this._topText.visible)
      this._refPhoto.y = this._topText.y + this._topText.height + Number(ConfigurableParams.getData()["reference_photo"]["offset"]["y"]);

    this._tutorial.x = Black.stage.centerX;
    this._tutorial.y = Black.stage.centerY + bb.height * 0.18;

    this._cta2.x = Black.stage.centerX;
    this._cta2.y = bb.top + (bb.height / 2) * 1.8;

    this._targetlight.x = Black.stage.centerX;
    this._targetlight.y = Black.stage.centerY;

    this._cta1.x = Black.stage.centerX;
    this._cta1.y = Black.stage.centerY + bb.height * 0.18;

    this._progressbar.x = Black.stage.centerX;
    this._progressbar.y = 100;


    this._endScreen.onResize(bb);

    if (this._logoGoogle) {
      this._logoGoogle.scaleX = 0.9;
      this._logoGoogle.scaleY = 0.9;

      this._logoGoogle.x = bb.right - 240;
      this._logoGoogle.y = bb.top + 15;
    }

    if (this._downloadBtn) {
      this._downloadBtn.scaleX = 0.6;
      this._downloadBtn.scaleY = 0.6;

      this._downloadBtn.x = Helpers.LP(bb.right - 170, Black.stage.centerX);
      this._downloadBtn.y = bb.bottom - 85;
    }
    this._targetlight.onResize();
  }

  _createEndscreen() {
    const endscreen = this._endScreen = new Endscreen();
    this.add(endscreen);

    endscreen.on(endscreen.onPlayBtnClickEvent, msg => {
      this.post(this.onPlayBtnClickEvent);
    });
  }

  _createLogo() {
    if (model.platform === "google_landscape" || model.platform === "google_portrait") {
      const logo = this._logoGoogle = new Sprite('logo');
      logo.alignAnchor(0, 0);
      this.add(logo);
    }
  }

  _createDownloadBtn() {
    if (model.platform === "mintegral" || ConfigurableParams.isNeedShowPN()) {
      const downloadBtn = this._downloadBtn = new PlayButton(ConfigurableParams.getData()["play_button"]["play_now_text"]["value"]);
      downloadBtn.visible = false;
      this.add(downloadBtn);
    }
  }

  showHint() {
    this._tutorial.show();

  }
  showCTA1() {
    this._cta1.show();
  }

  update2dPos(position, width, height) {
    this._targetlight.setSpotlightPosition(position, width, height);
  }


  showCTA2() {
    this._cta2.show();
  }

  showProgressBar() {
    this._progressbar.show();
  }
  progressBar() {
    this.fill += 0.005;
    this._progressbar.fill(this.fill);
  }

  onDown(x, y) {
    this.countClicks();
    const defaultPos = { x: x, y: y };
    const blackPos = Black.stage.worldTransformationInverted.transformVector(defaultPos);

    const ifDownloadButtonClicked = this._ifDownloadButtonClicked(blackPos.x, blackPos.y);
    if (ifDownloadButtonClicked) return true;

    this._endScreen.onDown(blackPos.x, blackPos.y);

  }
  countClicks(clicks) {
    this._click++;
  }

  onMove(x, y) {
    const defaultPos = { x: x, y: y };
    const blackPos = Black.stage.worldTransformationInverted.transformVector(defaultPos);
  }

  onUp() {
  }

  particleEmitter(x, y) {
    console.log('making spillage at', x, y);
  }


  enableStoreMode() {
    if (this._isStaticStoreMode) return;
    this._isStaticStoreMode = true;

    if (this._downloadBtn) this._downloadBtn.visible = false;
    if (this._logoGoogle) this._logoGoogle.visible = false;
    this._topText.visible = false;
    this._tutorial.visible = false;
    this._refPhoto.visible = false;
    this._cta2.visible = false;
    this._tutorial.visible = false;
    this._progressbar.visible = false;
    this._endScreen.show();
  }

  _ifDownloadButtonClicked(x, y) {
    if (!this._isStaticStoreMode && this._downloadBtn) {
      const isButtonClick = this._downloadBtn.isDown(x, y);
      if (isButtonClick) {
        this.post(this.onPlayBtnClickEvent);
        return true;
      }
    }

    return false;
  }
}
