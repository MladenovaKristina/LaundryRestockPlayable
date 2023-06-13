import { Graphics, DisplayObject, CapsStyle, Rectangle, Black, Sprite } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';

export default class ProgressBar extends DisplayObject {
    constructor() {
        super();

        this.scaleX = 0.3;
        this.scaleY = 0.35;
        this.visible = false;
        this._bg = null;
        this._fill = null;
        this._cropRect = null;
    }

    onAdded() {
        //         this._bg = new Sprite('progress_bg');
        //         this.add(this._bg);
        // 
        //         this._fill = new Sprite('progress_fill');
        //         this.add(this._fill);

        //         this._bg.x = -this._bg.width / 2;
        //         this._fill.x = -this._bg.width / 2;
        // 
        //         this._height = this._bg.height;
        //         this._width = this._bg.width;
        // 
        //         this._cropRect = new Rectangle(-this._height / 2, -this._height / 2, 1, this._height);
        //         this._fill.clipRect = this._cropRect;
    }

    fill(progress) {
        // progress = Helpers.clamp(progress, 0, 1);
        console.log('progressing')
        // 
        //         this._cropRect.set(
        //             -this._height / 2,
        //             -this._height / 2,
        //             progress > 0 ? progress * (this._width + this._height) : 1,
        //             this._height * 2);
    }
    show() {
        this.visible = true;
    }
}