import { Black, Graphics, DisplayObject, Tween, Ease } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';
import ConfigurableParams from '../../../data/configurable_params';

export default class TargetLight extends DisplayObject {
    constructor() {
        super();

        this.visible = true;
        this._initView();
    }

    _initView() {
        const bb = Black.stage.bounds;
        const bgWidth = bb.width;
        const bgHeight = bb.height;

        this._bg = new Graphics();
        this._bg.alignAnchor(0.5, 0.5);

        this._bg.beginPath();
        this._bg.fillStyle(0x000000, 0.5);
        this._bg.rect(0, 0, bgWidth, bgHeight);
        this._bg.fill();
        this.add(this._bg);

        this._hole = new Graphics();
        this._holeX = 0;
        this._holeY = 0;
        this._height = 150;

        this._hole.beginPath();
        this._hole.alignAnchor(0.5, 0.5);

        this._hole.fillStyle(0x000000, 1);
        this._hole.circle(this._holeX, this._holeY, this._height);
        this._hole.cut();
        this.add(this._hole);
    }

    onResize() {
        this._resizeBg();
    }

    _resizeBg() {
        const bb = Black.stage.bounds;
        const bgWidth = bb.width;
        const bgHeight = bb.height;

        this._bg.clear();
        this._bg.beginPath();
        this._bg.fillStyle(0x000000, 0.5);
        this._bg.rect(0, 0, bgWidth, bgHeight);
        this._bg.fill();
    }


    setSpotlightPosition(bottleposition, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;

        this._holeX = bottleposition.x - centerX;
        this._holeY = bottleposition.y - centerY;

        this._hole.x = this._holeX;
        this._hole.y = this._holeY;
        this._height = height;
    }


    show() {
        this.visible = true;
    }

    hide() {
        const hideTween = new Tween({
            alpha: [1, 0]
        }, 0.2);

        this.add(hideTween);

        hideTween.on('complete', () => {
            this.visible = false;
        });
    }
}