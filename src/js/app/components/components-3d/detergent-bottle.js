import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, MeshStandardMaterial } from "three";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        this.amplitude = 0.1;
        this.frequency = 2;
        this.duration = 1000;

        this.height = 0;
        this.top = 0.005;
        this.bottom = 0.02;

        this._scene = scene;
        this.asset = THREE.Cache.get("assets").scene;
        this.detergentBottle = null;
        this.liquidBase = null;
        this.liquid = null;
        this.detergentBottleCap = null;
        this.pause = false;
        this.canIdle = false;
        this.isPlaying = false;
        this.detergentTweenRotation = null;
        this.detergentTweenPosition = null;
        this.liquidTween = null;
        this._init();
    }

    _init() {
        this.asset.traverse((child) => {
            switch (child.name) {
                case "Tide":
                    this.detergentBottle = child;
                    child.rotation.x = Math.PI / 2;
                    child.rotation.z = 0;
                    child.position.set(0.4, 0, 0.75);
                    break;
                case "Liquid":
                    this.liquid = child;
                    child.rotation.set(0, 0, 0);
                    break;
                case "Liquid_base":
                    this.liquidBase = child;
                    child.rotation.set(0, 0, 0);
                    break;
                case "Cap":
                    this.detergentBottleCap = child;
                    break;
                default:
                    break;
            }
        });
        this.detergentBottleCap.visible = true;
        this.detergentBottle.scale.set(0.013, 0.013, 0.013);
        this.liquid.rotation.y = Math.PI * 0.1;
        this.add(this.detergentBottle);

        this.detergentBottle.traverse((child) => {
            if (child.type === "Mesh" || child.type === "SkinnedMesh") {
                child.frustumCulled = false;
                switch (child.name) {
                    case "Mesh006":
                        child.material = new MeshStandardMaterial({
                            color: 0xffffff,
                            emissive: 0x000000,
                            roughness: 1,
                            metalness: 0.1,
                            map: THREE.Cache.get("detergent_poster"),
                        });
                        child.castShadow = true;
                        break;
                    case "Mesh006_1":
                        child.material = new MeshStandardMaterial({
                            color: 0xF59646,
                            emissive: 0x000000,
                            roughness: 1,
                            metalness: 0.1,
                        });
                        child.castShadow = true;
                        break;
                    case "Cap":
                    case "Liquid":
                    case "Liquid_base":
                        child.material = new MeshStandardMaterial({
                            color: 0x0000ff,
                            roughness: 0,
                            transparent: true,
                            opacity: 0.5,
                        });
                        if (child.name === "Liquid" || child.name === "Liquid_base") {
                            child.visible = false;
                        }
                        child.castShadow = true;
                        break;
                    default:
                        break;
                }
            }
        });
    }

    raise(emptyContainer) {
        this.idle();
        const targetZ = 0;
        const targetY = 1.8;
        const duration = 1500;
        let currentTime = 0;
        this.canIdle = true;

        new TWEEN.Tween(this.detergentBottle.scale)
            .to({ x: 0.0165, y: 0.0165, z: 0.0165 }, this.duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)

            .start();

        new TWEEN.Tween(this.detergentBottle.position)
            .to({ y: targetY, z: targetZ }, duration)
            .onUpdate(() => {
                if (currentTime == duration / 2) {
                    emptyContainer.removeCap();
                }
                this.detergentBottle.rotation.y -= 0.01;
            })
            .onComplete(() => {
                this.detergentBottle.position.set(
                    this.detergentBottle.position.x,
                    targetY,
                    targetZ,
                    this.canIdle = true
                );
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    idle() {
        this.detergentTweenRotation = new TWEEN.Tween(this.detergentBottle.rotation)
            .to(
                {
                    x: this.detergentBottle.rotation.x + this.amplitude,
                    y: this.detergentBottle.rotation.y - this.amplitude,
                },
                this.duration * 2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency) * this.amplitude;
                this.detergentBottle.rotation.x = this.detergentBottle.rotation.x + angle * 2;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.detergentTweenPosition = new TWEEN.Tween(this.detergentBottle.position)
            .to(
                {
                    x: this.detergentBottle.position.x - this.amplitude * 2,
                },
                this.duration * 1.3
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;

                if (time >= this.duration / 2) {
                    this.detergentTweenPosition = new TWEEN.Tween(this.detergentBottle.position.y)
                        .to(
                            {
                                y: this.detergentBottle.position.y - this.amplitude
                            },
                            this.duration * 1.2
                        ).easing(TWEEN.Easing.Sinusoidal.InOut)
                }
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();
        const animate = () => {
            this.detergentTweenPosition.update();
            this.detergentTweenRotation.update();

            requestAnimationFrame(animate);
        };

        animate();
    }

    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    stopIdle(callback) {
        if (this.detergentTweenPosition) {
            this.detergentTweenPosition.end();
            this.detergentTweenRotation.end();
            if (callback) callback();
        }
    }

    removeDetergentCap(callback) {
        const targetY = -Math.PI;
        new TWEEN.Tween(this.detergentBottleCap.rotation)
            .to({ y: targetY / 2, x: -Math.PI, z: -4 }, 1000)
            .delay(500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.detergentBottleCap.visible = false;
                callback();
            })
            .start();

        const removeCapTween = () => {
            requestAnimationFrame(removeCapTween);
            TWEEN.update();
        };

        removeCapTween();
    }

    rotateDown() {
        if (this.isPlaying || this.isRotatingUp) return;
        if (!this.pause) {
            this.isPlaying = true;

            const targetRotateY = Math.PI * 0.3;
            const duration = 500;

            new TWEEN.Tween(this.detergentBottle.rotation)
                .to({ y: targetRotateY, z: 0 }, duration)
                .easing(TWEEN.Easing.Quadratic.In)
                .onComplete(() => {
                    this.isPlaying = false;
                })
                .start();
        }
    }

    rotateUp(dur) {
        let duration = null;
        if (dur) { duration = dur; } else duration = 400;
        const targetRotateY = Math.PI * 0.3;
        if (!this.pause && this.detergentBottle.rotation.y > targetRotateY) {
            if (this.isRotatingUp) return;
            this.isPlaying = true;
            this.isRotatingUp = true;

            new TWEEN.Tween(this.detergentBottle.rotation)
                .to({ y: targetRotateY }, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (this.detergentBottle.rotation.y >= targetRotateY * 0.3)
                        new TWEEN.Tween(this.liquid.scale)
                            .to({ y: 0, x: 0, z: 0 }, duration * 0.1)
                            .easing(TWEEN.Easing.Sinusoidal.Out)
                            .onComplete(() => { this.liquid.visible = false; this.liquidBase.visible = false })
                            .start();
                })
                .onComplete(() => {
                    this.isPlaying = false;
                    this.isRotatingUp = false;
                })
                .start();

            const animate = () => {
                TWEEN.update();
                if (this.isPlaying || this.isRotatingUp) {
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }


    pour() {
        const duration = 300;
        const targetRotateY = Math.PI * 0.4;
        this.liquid.visible = true;
        if (this.detergentBottle.rotation.y >= Math.PI * 0.3) {
            new TWEEN.Tween(this.detergentBottle.rotation)
                .to({ y: Math.PI * 0.4 }, duration * 0.3)
                .onComplete(() => {
                    this.liquidTween.start();
                })
                .start();

            this.liquidTween = new TWEEN.Tween(this.liquid.scale)
                .to({ y: 2, x: 2, z: 2 }, duration * 0.4)
                .onUpdate(() => {
                    if (this.detergentBottle.rotation.y > targetRotateY * 0.6)
                        this.liquidBase.visible = true;
                    if (this.detergentBottle.rotation.y < targetRotateY * 0.5)
                        this.liquidBase.visible = false;
                    new TWEEN.Tween(this.liquid.scale)
                        .to({ y: this.liquid.scale.y, z: [1, 1.5] }, duration)
                        .repeat(Infinity)
                        .yoyo(true)
                        .start();
                });
        }
    }

    stopLiquid() {
        this.liquidBase.visible = false
        if (this.liquidTween && this.liquidTween.isPlaying()) this.liquidTween.end();
        new TWEEN.Tween(this.liquid.scale)
            .to({ y: 0, x: 0, z: 0 }, 200)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .start();
    }

    end() {

        this.rotateUp(1000);
        this.canIdle = false;
        this.pause = true;
        this.detergentBottle.traverse((object) => {
            if (object.userData.tween) {
                object.userData.tween.end();
                object.userData.tween = null;
            }
        });
    }
}
