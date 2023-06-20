import ConfigurableParams from '../../../../data/configurable_params';
import { Tween, Black, DisplayObject, Sprite } from '../../../../utils/black-engine.module';
import Helpers from '../../../helpers/helpers';

export default class Hint extends DisplayObject {
  constructor() {
    super();

    this.detergentBottle = null;
  }

  onAdded() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'MICKEY') {
      this.detergentBottle = new Sprite('hint_mickey');
      this.detergentBottle.scaleX = -0.7;
      this.detergentBottle.scaleY = -0.7;
      this.detergentBottle.alignAnchor(0, 0);
      this.detergentBottle.rotation = 0.7;
      this.add(this.detergentBottle);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'SIMPLE') {
      this.detergentBottle = new Sprite('hint_simple');
      this.detergentBottle.scaleX = -1;
      this.detergentBottle.scaleY = -1;
      this.detergentBottle.alignAnchor(0.25, -0.1);
      this.detergentBottle.rotation = 0.5;
      this.add(this.detergentBottle);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'ORIGINAL') {
      this.detergentBottle = new Sprite('hint_original');
      this.detergentBottle.scaleX = 0.35;
      this.detergentBottle.scaleY = -0.35;
      this.detergentBottle.alignAnchor(0.38, -0.2);
      // this.detergentBottle.rotation = -0.3;
      this.add(this.detergentBottle);
    }
  }

  tap() {
    this.detergentBottle.y = -30;

    const tw = new Tween({
      y: [0, -30]
    }, 0.5);
    this.detergentBottle.add(tw);
  }
}
