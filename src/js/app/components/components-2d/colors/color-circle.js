import ConfigurableParams from '../../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../../utils/black-engine.module';;

export default class ColorCircle extends DisplayObject {
  constructor(color) {
    super();

    this._color = color;
  }

  onAdded() {
    const view = this._view = new Graphics();
    view.fillStyle(this._color, 1);
    view.lineStyle(15, 0xffffff);
    view.circle(0, 0, 55);
    view.fill();
    view.stroke();
    this.add(view);

    const outline = this._outline = new Graphics();
    outline.visible = false;
    outline.lineStyle(7, 0x111111);
    outline.circle(0, 0, 48);
    outline.stroke();
    this.add(outline);
  }

  outline(value) {
    this._outline.visible = value;
  }

  pulseHint() {
    const tw = new Tween({
      scaleX: [1.1, 1],
      scaleY: [1.1, 1],
    }, 0.5);
    this.add(tw);
  }

  onChoose() {
    this.outline(true);
  }

  get radius() {
    return 60;
  }

  get color() {
    return this._color;
  }
}

