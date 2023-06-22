import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, MeshStandardMaterial, DoubleSide } from "three";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        this.amplitude = 0.1;
        this.frequency = 1;
        this.duration = 1000;

        this._scene = scene;
        this.asset = THREE.Cache.get("assets").scene;
        this.detergentBottle = null;
        this.liquidBase = null;
        this.liquid = null;
        this.tideBottleCap = null;

        this.detergentTweenPosition = null;
        this.detergentTweenRotation = null;

        this._init();
    }

    _init() {
        this.asset.traverse((child) => {
            if (child.name === "Tide") {
                this.detergentBottle = child;
            } else if (child.name === "Liquid") {
                this.liquid = child;
            } else if (child.name === "Liquid_base") {
                this.liquidBase = child;
            } else if (child.name === "Cap") {
                this.tideBottleCap = child;
            }
        });

        this.detergentBottle.rotation.x = Math.PI / 2;
        this.detergentBottle.position.z = 0.75;
        this.detergentBottle.position.x = 0.4;
        this.tideBottleCap.visible = true;

        this.detergentBottle.scale.set(0.013, 0.013, 0.013);
        this.liquid.scale.set(0, 0, 1);

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
        const targetZ = -0.001;
        const targetY = 1.8;

        new TWEEN.Tween(this.detergentBottle.position)
            .to({ y: targetY, z: targetZ }, 2000)
            .onComplete(() => {
                this.detergentBottle.position.set(
                    this.detergentBottle.position.x,
                    targetY,
                    targetZ
                );
                this.idleAnimateDetergent();
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    removeDetergentCap() {
        return new Promise((resolve) => {
            const removeCap = new TWEEN.Tween(this.tideBottleCap.rotation)
                .to({ y: -Math.PI / 2 }, 1000)
                .delay(1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    this.tideBottleCap.visible = false;
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
        this.detergentTweenRotation = new TWEEN.Tween(
            this.detergentBottle.rotation
        )
            .to(
                {
                    x: this.detergentBottle.rotation.x - this.amplitude,
                    y: this.detergentBottle.rotation.y + this.amplitude,
                },
                this.duration * 1.2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency) * this.amplitude;
                this.detergentBottle.rotation.x =
                    this.detergentBottle.rotation.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.detergentTweenPosition = new TWEEN.Tween(
            this.detergentBottle.position
        )
            .to(
                {
                    x: this.detergentBottle.position.x - this.amplitude,
                    y: this.detergentBottle.position.y - this.amplitude,
                },
                this.duration
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency) * this.amplitude;
                this.detergentBottle.position.x =
                    this.detergentBottle.position.x - angle;
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

    rotateDown() {
        const duration = 1000;

        new TWEEN.Tween(this.detergentBottle.rotation)
            .to({ y: Math.PI / 2 }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                // this.detergentBottle.rotation.x = this.detergentBottle.rotation.x;
            })
            .start();

        this.liquid.visible = true;
        this.liquidBase.visible = true;

        const targetScaleX = 1;

        new TWEEN.Tween(this.liquid.scale)
            .to({ x: targetScaleX - 0.1, y: targetScaleX }, duration * 0.2)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(duration * 0.8)
            .start();
    }

    rotateUp() {
        const duration = 1000;
        this.detergentBottle.rotation.x = Math.PI / 2;

        new TWEEN.Tween(this.detergentBottle.rotation)
            .to({ y: 0 }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                // this.detergentBottle.rotation.x = this.detergentBottle.rotation.x;
            })
            .start();

        new TWEEN.Tween(this.liquid.scale)
            .to({ x: 0, y: 0 }, duration * 0.2)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.liquid.visible = false;
                this.liquidBase.visible = false;
            })
            .start();
    }
}
