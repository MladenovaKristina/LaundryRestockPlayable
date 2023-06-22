import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class Fill extends THREE.Object3D {
    constructor() {
        super();
        this.height = 0;
        this.top = 0.26;
        this.bottom = 0.20;
        this.progress = 0;
        this.canFill = false;
        this.fillTween = null;
        this.visible = false;
        this._initView();

        this.messageDispatcher = new MessageDispatcher();
        this.onSpawnedEvent = 'onFinishEvent';
    }

    _initView() {
        var geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
        geometry.translate(0, this.height * 1.3, 0); // Translate the geometry to align the bottom to 0,0,0
        var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
        var fill = new THREE.Mesh(geometry, material);
        this.add(fill);
    }

    show() {
        this.visible = true;
        this.canFill = true;
        this.fill();
    }

    stop() {
        if (this.fillTween && this.fillTween.isPlaying()) {
            this.fillTween.stop();
        } console.log("stop filling");

    }

    resume() {
        if (this.fillTween && !this.fillTween.isPlaying()) {
            this.fillTween.start();
        }
    }

    fill() {
        const targetHeight = 0.5;
        const targetTop = 0.27;
        const targetBottom = 0.23;
        const duration = 3000;
        let currentTime = 0;

        if (!this.fillTween && currentTime <= duration) {
            this.fillTween = new TWEEN.Tween({ time: currentTime })
                .to({ time: duration }, duration - currentTime)
                .easing(TWEEN.Easing.Quadratic.In)
                .onUpdate(({ time }) => {
                    currentTime = time;

                    this.progress = currentTime / duration;
                    this.height = this.lerp(this.height, targetHeight, this.progress);
                    this.top = this.lerp(this.top, targetTop, this.progress);
                    this.bottom = this.lerp(this.bottom, targetBottom, this.progress);

                    this.children[0].geometry.dispose();
                    this.children[0].geometry = new THREE.CylinderGeometry(
                        this.top,
                        this.bottom,
                        this.height,
                        32
                    );
                    this.children[0].geometry.translate(0, this.height / 2, 0);
                })
                .onComplete(() => {
                    // if (this.height <= targetHeight) {
                    this.messageDispatcher.post('onFinishEvent');
                    console.log("onfinisheventdispatched")
                    // }
                })
        }

        if (this.canFill) {
            this.fillTween.start();
        }

        const animate = () => {
            TWEEN.update();
            requestAnimationFrame(animate);
        };

        animate();
    }

    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
}
