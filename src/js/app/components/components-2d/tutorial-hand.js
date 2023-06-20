import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, DisplayObject, Sprite } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';

export class TutorialHand extends DisplayObject {
  constructor() {
    super();

    this.animate = false;
    this.detergentBottle = null;

    this._distX = 150;
    this._distY = 60;
    this._xdt = -4.682145855324444;
    this._ydt = 9.364291710648889;
    this._interpolation = 0;
    this._rotation = -0.3;
  }

  onAdded() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'MICKEY') {
      this.detergentBottle = new Sprite('hint_mickey');
      this.detergentBottle.scaleX = 0.7;
      this.detergentBottle.scaleY = 0.7;
      this.detergentBottle.alignAnchor(0.15, -0.1);
      this.detergentBottle.rotation = this._rotation;
      this.add(this.detergentBottle);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'SIMPLE') {
      this.detergentBottle = new Sprite('hint_simple');
      this.detergentBottle.scaleX = 1;
      this.detergentBottle.scaleY = 1;
      this.detergentBottle.alignAnchor(0.4, -0.1);
      this.detergentBottle.rotation = this._rotation;
      this.add(this.detergentBottle);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'ORIGINAL') {
      this.detergentBottle = new Sprite('hint_original');
      this.detergentBottle.scaleX = 0.35;
      this.detergentBottle.scaleY = 0.35;
      this.detergentBottle.alignAnchor(0.5, -0.2);
      this.detergentBottle.rotation = this._rotation;
      this.add(this.detergentBottle);
    }
  }

  start() {
    if (!this.visible) return;
    // center hand ~(0;0) at start

    this.animate = true;
  }

  stop() {
    this.animate = false;
  }

  update(value) {
    if (!this.animate || !this.visible) return;

    this._xdt = value;
    this._ydt = -value * 2;

    this.detergentBottle.x = Math.cos(this._xdt) * this._distX;
    this.detergentBottle.y = Math.sin(this._ydt) * this._distY;
  }
}
