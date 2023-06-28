import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class Fill extends THREE.Object3D {
    constructor(layout2d) {
        super();
        this.height = 0;
        this.top = 0.26;
        this.bottom = 0.20;
        this.progress = 0;
        this.trackTime = 0;
        this.canFill = false;
        this.visible = false;
        this.fillTween = null;
        this.progressbar = null;
        this.messageDispatcher = new MessageDispatcher();
        this.onFinishEvent = 'onFinishEvent';
        this._initView();
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
        if (!this.fillTween || !this.fillTween.isPlaying()) {
            this.fill();
        }
    }

    setProgressBar(progressbar) {
        this.progressbar = progressbar;
    }

    stop() {
        this.canFill = false;

        if (this.fillTween && this.fillTween.isPlaying()) {
            this.fillTween.stop();
        }
    }

    resume() {
        this.canFill = true;

        if (this.fillTween && !this.fillTween.isPlaying()) {
            this.fillTween.start();
        }
    }

    fill() {
        if (this.canFill) {
            const targetHeight = 0.55;
            const targetTop = 0.27;
            const targetBottom = 0.23;
            const duration = 10000;
            let currentTime = this.progress * duration;
            let currentProgress = this.progress;

            this.fillTween = new TWEEN.Tween({ time: currentTime })
                .to({ time: duration }, duration - currentTime)
                .easing(TWEEN.Easing.Quadratic.In)
                .onUpdate(({ time }) => {
                    this.progress = currentProgress + ((time - currentTime) / (duration - currentTime));
                    this.trackTime += 0.001;

                    this.height = this.lerp(this.height, targetHeight, this.progress);
                    this.top = this.lerp(this.top, targetTop, this.progress);
                    this.bottom = this.lerp(this.bottom, targetBottom, this.progress);

                    const fillMesh = this.children[0];
                    fillMesh.geometry.dispose();
                    fillMesh.geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
                    fillMesh.geometry.translate(0, this.height / 2, 0);
                    this.progressbar.fill(this.height / targetHeight / 2);
                    if (this.height / targetHeight >= 0.9) {
                        this.messageDispatcher.post(this.onFinishEvent);
                        this.canFill = false;
                    }
                })
                .onComplete(() => {
                    this.messageDispatcher.post(this.onFinishEvent);
                    this.canFill = false;
                });

            this.fillTween.start();

            const animate = () => {
                TWEEN.update();
                requestAnimationFrame(animate);
            };

            animate();
        } else return;
    }

    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
}
