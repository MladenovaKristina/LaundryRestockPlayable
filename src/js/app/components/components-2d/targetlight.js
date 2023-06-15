import { Heightfield } from 'cannon';
import ConfigurableParams from '../../../data/configurable_params';
import { Black, Graphics, DisplayObject, Tween, Ease } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';

export default class TargetLight extends DisplayObject {
    constructor() {
        super();

        this.visible = true;
        this._initView();
    }

    _initView() {
        const bb = Black.stage.bounds;

        this._bg = new Graphics();
        this._bg.alignAnchor(0.5, 0.5);

        const bgWidth = bb.width;
        const bgHeight = bb.height;

        this._bg.beginPath();
        this._bg.fillStyle(0x000000, 0.5);
        this._bg.rect(0, 0, bgWidth, bgHeight);
        this._bg.fill();
        this.add(this._bg);

        this._hole = new Graphics();
        this._holeX = 0;
        this._holeY = 0;
        this._height = 0;

        this._hole.beginPath();
        this._hole.alignAnchor(0.5, 0.5);

        this._hole.fillStyle(0x000000, 0.5);
        this._hole.circle(this._holeX, this._holeY, this._height);
        this._hole.cut();
        this.add(this._hole);
    }

    setSpotlightPosition(bottleposition, width, height) {
        const centerX = width * 1000 / 2;
        const centerY = height * 1000 / 2;

        this._holeX = bottleposition.x - centerX;
        this._holeY = bottleposition.y - centerY;

        this._hole.x = this._holeX;
        this._hole.y = this._holeY;
        this._height = height / 2;
    }

    show() { this.visible = true; }
    hide() {
        const hideTween = new Tween({
            alpha: [1, 0]
        }, 0.2);

        this.add(hideTween);

        hideTween.on('complete', msg => this.visible = false);
    }
}
