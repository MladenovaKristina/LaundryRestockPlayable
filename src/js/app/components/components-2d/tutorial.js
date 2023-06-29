
import { Tween, Black, Sprite, DisplayObject, Ease, Timer } from '../../../utils/black-engine.module';

export default class Tutorial extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 0.9;
    this.scaleY = 0.9;

    this.visible = false;
  }

  onAdded() {
    this._hand = new Sprite('hint_hold');
    this._hand.alignAnchor(0.5, 0.5);
    this.add(this._hand);

  }

  show() {
    this.visible = true;
    this.bounce();
  }

  bounce() {
    const scaleTw = new Tween({
      scaleX: [0.33, 0.45, 0.33, 0.4, 0.33, 0.35, 0.35],
      scaleY: [0.38, 0.28, 0.38, 0.3, 0.38, 0.35, 0.35],
    }, 2, { ease: Ease.sinusoidalOut, delay: 0 });
    this._hand.add(scaleTw);

    const timer = new Timer(2.2, 1);
    this.add(timer);

    timer.on('tick', msg => {
      this.bounce();
    });
  }

  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }
}

