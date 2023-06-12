import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';
import { TutorialHand } from './tutorial-hand';

export default class Tutorial extends DisplayObject {
  constructor() {
    super();

    this._sign = null;

    this.scaleX = 1;
    this.scaleY = 1;

    this.visible = false;
  }

  onAdded() {
    this._hand = new TutorialHand();
    this._hand._rotation = 0;
    this.add(this._hand);

    this._text = new TextField(
      'HOLD',
      'arial',
      0xff0000,
      40,
      '',
      900
    );
    this._text.alignAnchor(0.5, -2);
    this._hand.add(this._text);

    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'INFINITY ONLY') this._hand.visible = false;
  }

  show() {
    this.visible = true;

    this._makeClick();
  }

  _makeClick() {
    const scaleTw = new Tween({
      scaleX: [1.5, 1],
      scaleY: [1.5, 1]
    }, 3, { ease: Ease.quadraticInOut, delay: 0, loop: true });
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

