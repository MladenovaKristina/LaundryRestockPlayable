import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import {
    Group,
    AnimationMixer,
    MeshStandardMaterial,
    DoubleSide,
    VectorKeyframeTrack,
} from "three";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        this.amplitude = 0.1;
        this.frequency = 1;
        this.duration = 1000;

        this._scene = scene;
        this.detergentBottle = null;
        this._init();
        let progressPercent = 0;
        this.detergentTweenPosition = null;
        this.detergentTweenRotation = null;
    }

    _init() {
        const asset = THREE.Cache.get("assets").scene.children;

        this.detergentBottle = asset[1];

        this._liquid = asset[1].children[0].children[3];
        this._liquid.children[0].scale.set(0, 0, 1);

        this._tideBottleCap = asset[1].children[0].children[2];
        this.detergentBottle.scale.set(0.013, 0.013, 0.013);
        this.add(this.detergentBottle);

        this.detergentBottle.traverse((child) => {
            child.frustumCulled = false;

            if (child.type === "Mesh" || child.type === "SkinnedMesh") {
                if (child.name === "Mesh006") {
                    child.material = new MeshStandardMaterial({
                        color: 0xffffff,
                        emissive: 0x000000,
                        roughness: 1,
                        metalness: 0.1,
                        side: DoubleSide,
                        map: THREE.Cache.get("detergent_poster"),
                    });
                    child.castShadow = true;
                } else if (child.name === "Mesh006_1") {
                    child.material = new MeshStandardMaterial({
                        color: 0xF59646,
                        emissive: 0x000000,
                        roughness: 1,
                        metalness: 0.1,
                        side: DoubleSide,
                    });
                    child.castShadow = true;
                } else if (
                    child.name === "Cap" ||
                    child.name === "Liquid" ||
                    child.name === "Liquid_base"
                ) {
                    child.material = new MeshStandardMaterial({
                        color: 0x0000ff,
                        roughness: 0,
                        transparent: true,
                        opacity: 0.5,
                        side: DoubleSide,
                    });

                    if (child.name === "Liquid" || child.name === "Liquid_base") {
                        child.visible = false;
                    }
                    child.castShadow = true;
                }
            }
        });
    }

    adjustDetergentPosition() {
        console.log('raising');
        this.wobbleDetergent();

        const targetZ = 0.12;
        const targetY = 1.5;

        const positionTween = new TWEEN.Tween(this.detergentBottle.position)
            .to({ y: targetY, z: targetZ }, 2000)
            .onComplete(() => {
                this.detergentBottle.position.set(this.detergentBottle.position.x, targetY, targetZ);
                this.idleAnimateDetergent();
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }



    removeDetergentCap() {
        return new Promise((resolve) => {
            const removeCap = new TWEEN.Tween(this._tideBottleCap.rotation)
                .to({ y: -Math.PI / 2 }, 1000)
                .delay(1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    this._tideBottleCap.visible = false;
                    resolve();
                })
                .start();

            const removeCapTween = () => {
                requestAnimationFrame(removeCapTween);
                TWEEN.update();
            };

            removeCapTween();
        });
    }

    idleAnimateDetergent() {
        this.wobbleDetergent();

        this.detergentTweenPosition = new TWEEN.Tween(this.detergentBottle.position)
            .to(
                { x: this.detergentBottle.position.x - this.amplitude, y: this.detergentBottle.position.y - this.amplitude },
                this.duration
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency) * this.amplitude;
                this.detergentBottle.position.x = this.detergentBottle.position.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();


    }

    stopIdleAnimation() {
        if (this.detergentTweenPosition) {
            this.detergentTweenPosition.stop();
            this.detergentTweenPosition = null;
        }
        if (this.detergentTweenRotation) {
            this.detergentTweenRotation.stop();
            this.detergentTweenRotation = null;
        }
    }

    wobbleDetergent() {
        this.detergentTweenRotation = new TWEEN.Tween(this.detergentBottle.rotation)
            .to(
                { x: this.detergentBottle.rotation.x - this.amplitude, y: this.detergentBottle.rotation.y + this.amplitude },
                this.duration * 1.2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency) * this.amplitude;
                this.detergentBottle.rotation.x = this.detergentBottle.rotation.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    pourLiquid() {
        this._liquid.visible = true;
        this._liquid.children[0].visible = true;

        const targetScaleX = 1;
        const duration = 2000;

        new TWEEN.Tween(this._liquid.children[0].scale)
            .to({ x: targetScaleX - 0.1, y: targetScaleX }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(duration * 0.22)
            .onComplete(() => {
                new TWEEN.Tween(this._liquid.children[0].scale)
                    .to({ x: 0, y: 0 }, duration)
                    .delay(duration * 0.875)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(this._liquid.visible = false)
                    .start();
            })
            .start();
    }

    rotateDown() {
        console.log("down")
        // new TWEEN.Tween(this.detergentBottle.rotation)
        //     .to(
        //         { y: this.detergentBottle.rotation.y - Math.PI / 2 },
        //         1000)
        //     .easing(TWEEN.Easing.Sinusoidal.InOut)
        //     .repeat(1)
        //     .start();
    }

    rotateUp() {
        console.log("up")

        // new TWEEN.Tween(this.detergentBottle.rotation)
        //     .to(
        //         { y: this.detergentBottle.rotation.y + Math.PI / 2 },
        //         1000)
        //     .easing(TWEEN.Easing.Sinusoidal.InOut)
        //     .repeat(1)
        //     .start();
    }

}
