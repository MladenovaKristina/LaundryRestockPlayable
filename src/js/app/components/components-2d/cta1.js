import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';
import { TutorialHand } from './tutorial-hand';
import TargetLight from './targetlight';

export default class CTA1 extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {
    this._targetlight = new TargetLight();
    this.add(this._targetlight);

    this._hand = new TutorialHand();
    this._hand.x = 260;
    this._hand.y = 200;

    this.add(this._hand);

    this._targetlight = new TargetLight();
    this.add(this._targetlight);

    this._text = new TextField(
      'TAP TO START!',
      'arial',
      0xffffff,
      100
    );
    this._text.alignAnchor(0.5, 0.5);
    this._text.y = -650;
    this.add(this._text);

    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'INFINITY ONLY') this._hand.visible = false;
  }

  show() {
    this.visible = true;
    const textTween = new Tween({
      scaleX: [1.2, 1],
      scaleY: [1.2, 1],
    }, 1, { loop: true });
    this._text.add(textTween);

    this._makeClick();
  }

  _makeClick() {
    const scaleTw = new Tween({
      scaleX: [1.2, 1],
      scaleY: [1.2, 1],
    }, 1, { ease: Ease.sinusoidalIn, delay: 0, loop: true });
    this._hand.add(scaleTw);
  }


  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }
}

