import { DisplayObject, Rectangle } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';

export default class ProgressBar extends DisplayObject {
    constructor() {
        super();

        this.scaleX = 1;
        this.scaleY = 1;
        this.visible = false;

        this._bg = null;
        this._fill = null;
        this._cropRect = null;
    }

    onAdded() {
        this._container = new DisplayObject(); // Create a new container element
        this.add(this._container);

        this._bg = new DisplayObject('base_blue');
        this._container.add(this._bg);

        this._fill = new DisplayObject('rect_yellow');
        this._container.add(this._fill);

        this._bg.x = -this._bg.width / 2;
        this._fill.x = -this._bg.width / 2;

        this._height = this._bg.height;
        this._width = this._bg.width;

        this._cropRect = new Rectangle(-this._height / 2, -this._height / 2, 1, this._height);
        this._fill.clipRect = this._cropRect;
    }

    fill(progress) {
        progress = Helpers.clamp(progress, 0, 1);

        this._cropRect.set(
            -this._height / 2,
            -this._height / 2,
            progress > 0 ? progress * (this._width + this._height) : 1,
            this._height * 2
        );
    }

    show() {
        this.visible = true;
    }
}
