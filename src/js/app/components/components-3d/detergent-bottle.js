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

        this.canIdle = false;

        this.detergentTweenRotation = null; // Store the rotation tween
        this.detergentTweenPosition = null; // Store the position tween

        this._init();
    }

    _init() {
        this.asset.traverse((child) => {
            switch (child.name) {
                case "Tide":
                    this.detergentBottle = child;
                    break;
                case "Liquid":
                    this.liquid = child;
                    break;
                case "Liquid_base":
                    this.liquidBase = child;
                    break;
                case "Cap":
                    this.tideBottleCap = child;
                    break;
                default:
                    break;
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
            if (child.type === "Mesh" || child.type === "SkinnedMesh") {
                child.frustumCulled = false;
                switch (child.name) {
                    case "Mesh006":
                        child.material = new MeshStandardMaterial({
                            color: 0xffffff,
                            emissive: 0x000000,
                            roughness: 1,
                            metalness: 0.1,
                            side: DoubleSide,
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
                            side: DoubleSide,
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
                            side: DoubleSide,
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

    adjustDetergentPosition(callback) {
        const targetZ = -0.001;
        const targetY = 1.8;
        this.canIdle = true;

        new TWEEN.Tween(this.detergentBottle.position)
            .to({ y: targetY, z: targetZ }, 2000)
            .onComplete(() => {
                this.detergentBottle.position.set(
                    this.detergentBottle.position.x,
                    targetY,
                    targetZ
                );
                callback();
            })
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    removeDetergentCap(callback) {
        const targetY = -Math.PI;
        new TWEEN.Tween(this.tideBottleCap.rotation)
            .to({ y: targetY / 2 }, 1000)
            .delay(1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.tideBottleCap.visible = false;
                callback();
            })
            .start();

        const removeCapTween = () => {
            requestAnimationFrame(removeCapTween);
            TWEEN.update();
        };

        removeCapTween();
    }

    animateDetergent(property, target, onUpdate) {
        return new TWEEN.Tween(property)
            .to(target, this.duration * 1.2)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(onUpdate)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }

    idleAnimateDetergent() {
        if (this.canIdle) {

            console.log("idle");

            // Start the animation loop

        }
    }

    stopIdleAnimation(callback) {
        this.canIdle = false;
        // 
        //         if (this.detergentTweenRotation) {
        //             this.detergentTweenRotation.stop();
        //             this.detergentTweenRotation = null;
        //         }
        // 
        //         if (this.detergentTweenPosition) {
        //             this.detergentTweenPosition.stop();
        //             this.detergentTweenPosition = null;
        //         }
    }

    animateProperty(property, target, duration, easing = TWEEN.Easing.Sinusoidal.InOut) {
        return new TWEEN.Tween(property).to(target, duration).easing(easing).start();
    }

    rotateDown() {
        const duration = 1000;

        this.animateProperty(this.detergentBottle.rotation, { y: Math.PI / 2 }, duration);

        this.liquid.visible = true;
        this.liquidBase.visible = true;

        const targetScaleX = 1;

        this.animateProperty(this.liquid.scale, { x: targetScaleX - 0.1, y: targetScaleX }, duration * 0.2)
            .delay(duration * 0.8)
            .start();
    }

    rotateUp() {
        const duration = 1000;

        this.animateProperty(this.detergentBottle.rotation, { y: 0 }, duration);

        this.animateProperty(this.liquid.scale, { x: 0, y: 0 }, duration * 0.2)
            .onComplete(() => {
                this.liquid.visible = false;
                this.liquidBase.visible = false;
            })
            .start();
    }
}
