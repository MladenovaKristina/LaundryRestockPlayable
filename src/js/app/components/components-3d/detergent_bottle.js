import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, Cache, AnimationMixer, MeshStandardMaterial, DoubleSide } from "three";
import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        this._scene = scene;
        this._animations = {
            pour: { tween: null, action: null, mixer: null, duration: null, time: 10000 },
            raise: { tween: null, action: null, mixer: null, duration: null, time: 3000 },
            fillVessel: { tween: null, action: null, mixer: null, duration: null, time: 2000 }
        };
        this.finalPosition = new THREE.Vector3();
        this._view = null;
        this._init();
    }

    _init() {
        const asset = THREE.Cache.get('assets').scene.children;
        this._view = asset[1];
        this._tideBottleCap = asset[1].children[0].children[2];
        this._view.scale.set(0.013, 0.013, 0.013);
        this.add(this._view);
        this._view.traverse(child => {
            child.frustumCulled = false;

            if (child.type === "Mesh" || child.type === "SkinnedMesh") {
                if (child.name === "Mesh006") {
                    child.material = new MeshStandardMaterial({
                        color: 0xffffff,
                        emissive: 0x000000,
                        roughness: 1,
                        metalness: 0.1,
                        side: DoubleSide,
                        map: THREE.Cache.get("detergent_poster")
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
                } else if (child.name === "Cap" || child.name === "Liquid" || child.name === "Liquid_base") {
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

        const animations = Cache.get('assets').animations;
        const animationsNames = ["pour", "raise", "fillVessel"];
        animationsNames.forEach((animName, index) => {
            const anim = animations[index];
            this._animations[animName].duration = anim.duration;
            this._animations[animName].mixer = new AnimationMixer(this._view);
            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);
        });
    }

    playAnim(name) {
        return new Promise(resolve => {
            if (this._animations[name].tween) {
                this._animations[name].tween.stop();
            }

            const action = this._animations[name].action;
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();

            const finalPosition = this.position.clone();

            this._animations[name].tween = new TWEEN.Tween(action)
                .to({ time: this._animations[name].duration }, this._animations[name].time)
                .onUpdate(() => {
                    this._animations[name].mixer.update(0.0000001);
                })
                .onComplete(() => {
                    this.stopAnim(name);
                    resolve();
                })
                .start();

            const animate = () => {
                requestAnimationFrame(animate);
                TWEEN.update();
                Object.values(this._animations).forEach(animation => {
                    animation.mixer.update(0.0167);
                });
            };

            animate();
        });
    }

    stopAnim(name) {
        if (this._animations[name].tween) {
            this._animations[name].tween.stop();
            this._animations[name].action.stop();
        }
    }

    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }

    updateMixer(delta) {
        Object.values(this._animations).forEach(animation => {
            animation.mixer.update(delta);
        });
    }

    removeDetergentCap() {
        return new Promise((resolve) => {
            const removeCap = new TWEEN.Tween(this._tideBottleCap)
                .to({ y: 3, rotation: { y: -Math.PI } }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .delay(0)
                .onComplete(() => {
                    this._tideBottleCap.visible = false;
                    resolve();
                })
                .start();

            const animateRaise = () => {
                requestAnimationFrame(animateRaise);
                TWEEN.update();
            };

            animateRaise();
        });
    }

    idleAnimateDetergent() {
        const amplitude = 0.1;
        const frequency = 1;
        const duration = 1000;

        this.idle = new TWEEN.Tween(this._tidelGroup.position)
            .to({ x: this._tidelGroup.position.x - amplitude, y: this._tidelGroup.position.y - amplitude }, duration)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this._tidelGroup.position.x = this._tidelGroup.position.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        const animateIdle = () => {
            if (this.idle) {
                requestAnimationFrame(animateIdle);
                this.idle.update();
            }
        };

        animateIdle();
    }

    stopIdle() {
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
    }
}
