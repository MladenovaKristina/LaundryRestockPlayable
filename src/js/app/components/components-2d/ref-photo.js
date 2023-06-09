import ConfigurableParams from '../../../data/configurable_params';
import { Sprite, DisplayObject } from '../../../utils/black-engine.module';

export default class ReferencePhoto extends DisplayObject {
  constructor() {
    super();

    this._bg = null;
    this._text = null;

    this.visible = ConfigurableParams.getData()["reference_photo"]["ref_photo_enabled"]["value"];
  }

  onAdded() {
    const imageScale = Number(ConfigurableParams.getData()["reference_photo"]["scale"]["value"]);
    const imageRotation = Number(ConfigurableParams.getData()["reference_photo"]["rotation"]["value"]);

    this.detergentBottle = new Sprite('ref_image');
    this.detergentBottle.alignAnchor(0.5, 0.5);
    this.add(this.detergentBottle);

    this.detergentBottle.rotation = imageRotation / 180 * Math.PI;
    this.detergentBottle.scaleX = imageScale;
    this.detergentBottle.scaleY = imageScale;
    this.detergentBottle.x = this.detergentBottle.width * 0.5;
    this.detergentBottle.y = this.detergentBottle.height * 0.5;
  }
}

