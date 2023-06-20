import { Black, Graphics, DisplayObject, Tween, Ease } from '../../../utils/black-engine.module';
import Helpers from '../../helpers/helpers';
import ConfigurableParams from '../../../data/configurable_params';

export default class TargetLight extends DisplayObject {
    constructor() {
        super();

        this.visible = true;
        this._initView();
        this.onResize();
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
        this.addChild(this._bg);

        this._hole = new Graphics();
        this._radius = 150;

        this.addChild(this._hole);
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

    setTargetlightPosition(position) {
        let holeX = position.x + this._radius / 4;
        let holeY = position.y + this._radius / 8;

        this._hole.clear();
        this._hole.beginPath();
        this._hole.alignAnchor(0.5, 0.5);
        this._hole.fillStyle(0x000000, 1);
        this._hole.circle(holeX, holeY, this._radius);
        this._hole.cut();
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
