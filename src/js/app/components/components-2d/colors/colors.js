import ConfigurableParams from '../../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../../utils/black-engine.module';
import Helpers from '../../../helpers/helpers';
import Hint from './hint';
import ColorCircle from './color-circle';

export default class Colors extends DisplayObject {
  constructor() {
    super();

    this.onColorClickEvent = 'onColorClickEvent';

    this._enabled = true;
    this.visible = false;
    this._colors = [];
  }

  onAdded() {
    const bg = this._bg = new Graphics();
    this.add(bg);

    const colors = [
      Number(ConfigurableParams.getData()['settings']['color_1']['value'].replace('#', '0x')),
      Number(ConfigurableParams.getData()['settings']['color_2']['value'].replace('#', '0x')),
      Number(ConfigurableParams.getData()['settings']['color_3']['value'].replace('#', '0x')),
      Number(ConfigurableParams.getData()['settings']['color_4']['value'].replace('#', '0x')),
      Number(ConfigurableParams.getData()['settings']['color_5']['value'].replace('#', '0x')),
      Number(ConfigurableParams.getData()['settings']['color_6']['value'].replace('#', '0x')),
    ];

    const colorsAmount = Number(ConfigurableParams.getData()['settings']['colors_amount']['value']);
    for (let i = 0; i < colorsAmount; i++) {
      const colorCircle = new ColorCircle(colors[i]);
      this.add(colorCircle);

      this._colors.push(colorCircle);
    }

    const hint = this._hint = new Hint();
    hint.visible = false;
    this.add(hint);
  }

  onResize(bb) {
    this._bg.clear();
    this._bg.fillStyle(0xF4EFFF, 1);
    this._bg.rect(-bb.width / 2, -300, bb.width, 300);
    this._bg.fill();

    this._colors.forEach((colorCircle, i) => {
      const width = (this._colors.length > 3 ? bb.width * 0.95 : bb.width * 0.8) * Helpers.LP(0.55, 1);
      const step = width / this._colors.length;

      colorCircle.y = -150;
      if (this._colors.length % 2 === 1)
        colorCircle.x = -step * Math.floor(this._colors.length / 2) + step * i;
      else
        colorCircle.x = -step * (Math.floor(this._colors.length / 2) - 0.5) + step * i;
    });
  }

  onDown(x, y) {
    if (!this._enabled) return;

    x -= this.x;
    y -= this.y;

    this._colors.forEach((colorCircle, i) => {
      const px = colorCircle.x;
      const py = colorCircle.y;

      if (Math.abs(x - px) < colorCircle.radius && Math.abs(y - py) < colorCircle.radius) {
        this._stopHint();
        colorCircle.onChoose();
        this._enabled = false;
        this.post(this.onColorClickEvent, colorCircle.color);
      }
    });
  }

  enableInput(value) {
    this._enabled = value;
  }

  show() {
    const baseY = this.y;
    this.y = Black.stage.bounds.bottom + 550;

    this.visible = true;
    this._enabled = true;
    this._startHint();

    const showTween = new Tween({
      y: baseY
    }, 0.5);
    this.add(showTween);
  }

  hide() {
    const baseY = this.y;
    this._stopHint();

    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 550
    }, 0.2);

    this.add(hideTween);
    hideTween.on('complete', msg => {
      this.y = baseY;
      this.visible = false;
      this._colors.forEach(colorCircle => colorCircle.outline(false));
    });
  }

  _startHint() {
    this._hintTimer = new Timer(0.8, Infinity);
    this.add(this._hintTimer);

    const getCounter = function () {
      let value = 0;
      return function () { return value++; }
    }
    const count = getCounter();

    this._hintTimer.on('tick', msg => {
      this._makeStep(count);
    });

    this._hint.visible = true;
    this._makeStep(count);
  }

  _makeStep(count) {
    const index = count() % this._colors.length;
    this._hint.x = this._colors[index].x;
    this._hint.y = this._colors[index].y;
    this._hint.tap();

    this._colors[index].pulseHint();
  }

  _stopHint() {
    this._hint.visible = false;
    this._hintTimer && this._hintTimer.stop();
  }
}

