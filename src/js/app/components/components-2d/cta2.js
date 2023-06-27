import ConfigurableParams from '../../../data/configurable_params';
import { Tween, Black, Graphics, Sprite, DisplayObject, TextField, Ease, Timer } from '../../../utils/black-engine.module';
import UTween from '../../helpers/../../utils/utween';
import { TutorialHand } from './tutorial-hand';

export default class CTA2 extends DisplayObject {
    constructor() {
        super();

        this._sign = null;

        this.scaleX = 1;
        this.scaleY = 1;

        this.visible = false;
    }

    onAdded() {
        this._text = new TextField(
            'SWIPE TO FILL!',
            'arial',
            0xffffff,
            100
        );
        this._text.alignAnchor(0.5, 0.5);
        this.add(this._text);

        this._pointer = new TutorialHand();
        this._pointer._rotation = 0;
        this.add(this._pointer);

        if (ConfigurableParams.getData()['hint']['starting_hint_type']['value'] === 'INFINITY ONLY') this._pointer.visible = false;
    }

    show() {
        this.visible = true;

        this._swipeAnimation();
        this._textPulse();
    }


    _swipeAnimation() {
        const swipe = new Tween({
            x: [this._pointer.x, this._pointer.x - 200, this._pointer.x],
            y: [this._pointer.y, this._pointer.y + 25, this._pointer.y]
        }, 1.5, { ease: Ease.sinusoidalOut, delay: 0, loop: true });

        this._pointer.add(swipe);
    }

    _textPulse() {
        const textTween = new Tween({
            scaleX: [1.2, 1],
            scaleY: [1.2, 1],
        }, 2, { loop: true });
        this._text.add(textTween);
    }

    hide() {
        const hideTween = new Tween({
            y: Black.stage.bounds.bottom + 250
        }, 0.2);

        this.add(hideTween);

        hideTween.on('complete', this.visible = false);
    }

    setPosition(position) {
        const bb = Black.stage.bounds;

        if (bb.width > bb.height) {
            this._pointer.scale = 0.8;
            this._pointer.x = position.x / bb.width + this._pointer.width * 2;
            this._pointer.y = position.y;

        }
        if (bb.width < bb.height) {
            this._pointer.scale = 1;

            this._pointer.x = position.x / bb.width + this._pointer.width * 1.8;
            this._pointer.y = position.y + this._pointer.height;
        }
    }
}

