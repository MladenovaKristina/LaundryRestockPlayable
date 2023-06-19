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
        this._scene = scene;
        this._animations = {
            pour: { tween: null, action: null, mixer: null, duration: null, time: 10000 },
            raise: { tween: null, action: null, mixer: null, duration: null, time: 3000 },
            fillVessel: { tween: null, action: null, mixer: null, duration: null, currentTime: 0 },
        };
        this.finalPosition = new THREE.Vector3();
        this._view = null;
        this._init();
    }

    _init() {
        const asset = THREE.Cache.get("assets").scene.children;

        this._view = asset[1];

        this._liquid = asset[1].children[0].children[3];
        this._liquid.children[0].scale.set(0, 0, 1);

        this._tideBottleCap = asset[1].children[0].children[2];
        this._view.scale.set(0.013, 0.013, 0.013);
        this.add(this._view);

        this._fill = asset.find((child) => child.name === "Liquid_00");
        this._fill.material = new MeshStandardMaterial({
            color: 0x0000ff,
            roughness: 0,
            transparent: true,
            opacity: 0.5,
            side: DoubleSide,
        });
        this._fill.position.set(0, 0, 0);
        this._fill.visible = true;

        this.add(this._fill);

        this._view.traverse((child) => {
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

        const animations = THREE.Cache.get("assets").animations;
        const animationsNames = ["pour", "raise", "fillVessel"];
        animationsNames.forEach((animName, index) => {
            const anim = animations[index];

            this._animations[animName].duration = anim.duration;
            if (animName === "fillVessel") {
                this._animations[animName].mixer = new AnimationMixer(this._fill);
            } else {
                this._animations[animName].mixer = new AnimationMixer(this._view);
            }

            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

            if (animName === "pour") {
                const liquidTrack = anim.tracks.find(
                    (track) => track.name === "Liquid_00.morphTargetInfluences"
                );
                if (liquidTrack) {
                    liquidTrack.setInterpolation(THREE.InterpolateLinear); // Fix: Set the interpolation type if needed
                }
            }
        });
    }

    adjustDetergentPosition() {
        const targetZ = 0.12;
        const positionTween = new TWEEN.Tween(this._view.position).to(
            { z: targetZ },
            this._animations.raise.duration
        );
        positionTween.start();
    }

    playAnim(name, resume = false) {
        return new Promise((resolve) => {
            const animation = this._animations[name];
            const action = animation.action;

            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();

            this.adjustDetergentPosition();

            const tween = new TWEEN.Tween(action)
                .to({ time: animation.duration }, animation.time)
                .onUpdate(() => animation.mixer.update(0.0000001))
                .onComplete(() => {
                    resolve();
                });

            animation.tween = tween;
            tween.start();
        });
    }

    stopAnim(name) {
        const animation = this._animations[name];
        if (animation.tween) {
            animation.tween.stop();
            animation.action.stop();
            animation.tween = null;
        }
    }

    progressionAnim(animationName, callback) {
        const animation = this._animations[animationName];
        const action = animation.action;

        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();

        animation.currentTime += 0.001;
        animation.mixer.update(0.001);

        if (animation.currentTime >= animation.duration) {
            callback();
        }
        const progressPercent = (animation.currentTime / animation.duration) * 100;
    }



    changeAnim(oldAnimName, newAnimName, resume = false) {
        this.stopAnim(oldAnimName);
        return this.playAnim(newAnimName, resume);
    }

    updateMixer(delta) {
        Object.values(this._animations).forEach((animation) => {
            animation.mixer.update(delta);

            if (
                animation.action &&
                animation.action.getClip().name === "fillVessel"
            ) {
                this._fill.position.set(0, 0, 0);
            }
        });
    }

    removeDetergentCap() {
        return new Promise((resolve) => {
            const removeCap = new TWEEN.Tween(this._tideBottleCap.rotation)
                .to({ y: -Math.PI }, 2000)
                .delay(500)
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
        const amplitude = 0.1;
        const frequency = 1;
        const duration = 1000;

        this.idle = new TWEEN.Tween(this._view.position)
            .to(
                { x: this._view.position.x - amplitude, y: this._view.position.y - amplitude },
                duration
            )
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(() => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this._view.position.x = this._view.position.x - angle;
            })
            .repeat(Infinity)
            .yoyo(true)
            .start();

        const animateIdle = () => {
            if (this.idle) {
                requestAnimationFrame(animateIdle);
                TWEEN.update();
            }
        };

        animateIdle();
    }

    pourLiquid() {
        this._liquid.visible = true;
        this._liquid.children[0].visible = true;

        const targetScaleX = 1;

        const initialTween = new TWEEN.Tween(this._liquid.children[0].scale)
            .to({ x: targetScaleX - 0.1, y: targetScaleX }, 4000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(900)
            .onComplete(() => {
                const resetTween = new TWEEN.Tween(this._liquid.children[0].scale)
                    .to({ x: 0, y: 0 }, 800)
                    .delay(3500)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            })
            .start();
    }

    stopIdle() {
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
    }
}
