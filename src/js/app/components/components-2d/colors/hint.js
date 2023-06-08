import ConfigurableParams from '../../../../data/configurable_params';
import { Tween, Black, DisplayObject, Sprite } from '../../../../utils/black-engine.module';
import Helpers from '../../../helpers/helpers';

export default class Hint extends DisplayObject {
  constructor() {
    super();

    this._view = null;
  }

  onAdded() {
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'MICKEY') {
      this._view = new Sprite('hint_mickey');
      this._view.scaleX = -0.7;
      this._view.scaleY = -0.7;
      this._view.alignAnchor(0, 0);
      this._view.rotation = 0.7;
      this.add(this._view);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'SIMPLE') {
      this._view = new Sprite('hint_simple');
      this._view.scaleX = -1;
      this._view.scaleY = -1;
      this._view.alignAnchor(0.25, -0.1);
      this._view.rotation = 0.5;
      this.add(this._view);
    }
    if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'ORIGINAL') {
      this._view = new Sprite('hint_original');
      this._view.scaleX = 0.35;
      this._view.scaleY = -0.35;
      this._view.alignAnchor(0.38, -0.2);
      // this._view.rotation = -0.3;
      this.add(this._view);
    }
  }

  tap() {
    this._view.y = -30;

    const tw = new Tween({
      y: [0, -30]
    }, 0.5);
    this._view.add(tw);
  }
}
