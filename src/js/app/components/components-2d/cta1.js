import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Easing, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';
import { TutorialHand } from './tutorial-hand';

export default class CTA1 extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {

    this._hand = new TutorialHand();
    this._hand.alignAnchor(-0.5, 0.5);
    this._hand.rotation = -0.5;

    this.add(this._hand);


    this._text = new TextField(
      'TAP TO START!',
      'arial',
      0xffffff,
      100
    );
    this._text.alignAnchor(0.5, 0.5);
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
      scaleX: [this.scaleX, this.scaleX + 0.13, this.scaleX],
      scaleY: [this.scaleY, this.scaleY + 0.18, this.scaleY],
    }, 2.8, { ease: Ease.sinusoidalOut, delay: 0.2, loop: true });
    this._hand.add(scaleTw);
    const rotate = new Tween({ rotation: [this._hand.rotation, this._hand.rotation - Math.PI * 0.2, this._hand.rotation] }, 3, { loop: true, easing: Ease.sinusoidalInOut })

    this._hand.add(rotate);
  }



  hide() {
    const hideTween = new Tween({
      y: Black.stage.bounds.bottom + 250
    }, 0.2);

    this.add(hideTween);

    hideTween.on('complete', msg => this.visible = false);
  }

  setPosition(position) {
    this._hand.x = position.x;
    this._hand.y = position.y + 500;
  }
}

