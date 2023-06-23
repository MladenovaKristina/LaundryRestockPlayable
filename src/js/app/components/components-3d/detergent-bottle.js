import * as TWEEN from "@tweenjs/tween.js";
import { Cylinder } from "cannon";
import * as THREE from "three";
import { Group, MeshStandardMaterial } from "three";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        this.amplitude = 0.1;
        this.frequency = 1;
        this.duration = 1000;


        this.height = 0;
        this.top = 0.009;
        this.bottom = 0.02;


        this._scene = scene;
        this.asset = THREE.Cache.get("assets").scene;
        this.detergentBottle = null;
        this.liquidBase = null;
        this.liquid = null;
        this.tideBottleCap = null;

        this.canIdle = false;

        this.detergentTweenRotation = null;
        this.detergentTweenPosition = null;

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
        this.tideBottleCap.visible = true;

        this.liquid.scale.set(0, 0, 1);
        this.detergentBottle.rotation.x = Math.PI / 2;
        this.detergentBottle.position.z = 0.75;
        this.detergentBottle.position.x = 0.4;
        this.detergentBottle.scale.set(0.013, 0.013, 0.013);
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


        const geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        this.cylinder = new THREE.Mesh(geometry, material);
        this.cylinder.visible = false;
        this.add(this.cylinder);
    }

    raise(z, callback) {
        const targetZ = z; console.log(targetZ)

        const targetY = 1.6;
        const duration = 2000;
        this.canIdle = true;

        new TWEEN.Tween(this.detergentBottle.position)
            .to({ y: targetY, z: targetZ }, duration)
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

        new TWEEN.Tween(this.detergentBottle.rotation)
            .to(
                {
                    x: this.detergentBottle.rotation.x - (this.amplitude * 2),
                    y: this.detergentBottle.rotation.y + (this.amplitude * 2),
                },
                this.duration * 1.2
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * this.frequency * 2) * (this.amplitude * 2);
                this.detergentBottle.rotation.x = this.detergentBottle.rotation.x - angle;
            })
            .yoyo()
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    idle() {
        this.detergentTweenRotation = new TWEEN.Tween(this.detergentBottle.rotation)
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
                this.detergentBottle.rotation.x = this.detergentBottle.rotation.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.detergentTweenPosition = new TWEEN.Tween(this.detergentBottle.position)
            .to(
                {
                    x: this.detergentBottle.position.x - this.amplitude,
                    y: this.detergentBottle.position.y + this.amplitude,
                },
                this.duration * 1.2
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
        this.detergentTweenPosition.end();
        this.detergentTweenRotation.end();

        callback();
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

    rotateDown() {
        this.detergentBottle.rotation.set(Math.PI / 2, 0, 0);
        let currentTime = 0;
        const duration = 1000;
        new TWEEN.Tween(this.detergentBottle.rotation)
            .to({ y: Math.PI / 2, z: 0 }, duration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() => {
                const targetScaleX = 1;
                const targetScaleY = 1;


                this.cylinder.visible = true;
                this.liquidBase.visible = true;

                new TWEEN.Tween(this.cylinder.scale)
                    .to({ y: targetScaleY, x: targetScaleX, z: 1 }, duration)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onUpdate(() => {
                        this.cylinder.position.x = this.detergentBottle.position.x - 0.5;
                        this.cylinder.position.y = this.detergentBottle.position.y - 0.002;

                        if (this.height <= 2) this.height += 0.01;

                        this.cylinder.geometry = new THREE.CylinderGeometry(
                            this.top,
                            this.bottom,
                            this.height,
                            32
                        );
                        this.cylinder.geometry.translate(0, -this.height / 2, 0);

                    })
                    .start();

            })
            .start();



    }

    rotateUp() {
        new TWEEN.Tween(this.detergentBottle.rotation)
            .to({ y: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();

        new TWEEN.Tween(this.cylinder.scale)
            .to({ y: 0, x: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
    }
}