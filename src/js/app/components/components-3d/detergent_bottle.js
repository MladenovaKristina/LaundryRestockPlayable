import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, Cache, AnimationMixer, MeshStandardMaterial, DoubleSide } from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";
import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class DetergentBottle extends Group {
    constructor(scene) {
        super();
        //=============================================
        // EVENTS
        //=============================================
        // this.messageDispatcher = new MessageDispatcher();
        // this.events = {
        //     someEvent: "someEvent",
        // };

        this._scene = scene;

        this._animations = {
            pour: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 10000,
            },
            raise: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 3000,
            },
            fillVessel: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
            }
        }
        this._init();
        this.finalPosition = new THREE.Vector3(); // Store final position as a property


        this._view = null;

    }
    _init() {
        const asset = THREE.Cache.get('assets').scene.children;
        let view = this._view = asset[1];
        view.scale.set(0.013, 0.013, 0.013);

        this.add(view);

        view.traverse(child => {

            child.frustumCulled = false;
            // console.log(child.name); //TO SEE ALL CHILDREN'S names in person

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
                }

                else if (child.name === "Mesh006_1") {
                    child.material = new MeshStandardMaterial({
                        color: 0xF59646,
                        emissive: 0x000000,
                        roughness: 1,
                        metalness: 0.1,
                        side: DoubleSide,
                    });
                    child.castShadow = true;
                }

                else if (child.name === "Cap" || child.name === "Liquid" || child.name === "Liquid_base") {
                    child.material = new MeshStandardMaterial({
                        color: 0x0000ff,
                        roughness: 0,
                        transparent: true,
                        opacity: 0.5,
                        side: DoubleSide,
                    });
                    if (child.name === "Liquid" || child.name === "Liquid_base") { child.visible = false; }
                    child.castShadow = true;
                }
            }

        });


        //=============================================
        // INIT ANIMATIONs
        //=============================================
        let animationsNames = ["pour", "raise", "fillVessel"];

        for (let index = 0; index < animationsNames.length; index++) {

            let animName = animationsNames[index];

            let anim = Cache.get('assets').animations[index];
            console.log(anim);

            this._animations[animName].duration = anim.duration;
            this._animations[animName].mixer = new AnimationMixer(view);
            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);

        }

    }
    //==========================================================================================
    // PLAY ANIMATION
    //==========================================================================================
    playAnim(name) {
        if (this._animations[name].tween !== null) this._animations[name].tween.stop();

        this._animations[name].action.play();

        // Store the initial position as the final position
        const finalPosition = this.position.clone();

        this._animations[name].tween = new TWEEN.Tween(this._animations[name].action)
            .to({ time: this._animations[name].duration }, this._animations[name].time)
            .onUpdate(() => {
                this._animations[name].mixer.update(0.0000001);
            })
            .onComplete(() => {
                this.stopAnim(name);
                this.setposition();
            })
            .start();

        const animate = () => {
            requestAnimationFrame(animate);
            TWEEN.update();
            Object.values(this._animations).forEach(animation => {
                animation.mixer.update(0.0167); // Update the mixer with a fixed delta time (60 FPS)
            });
        };
        animate.bind(this)();
    }

    stopAnim(name) {
        if (this._animations[name].tween !== null) {
            this._animations[name].tween.stop();
            this._animations[name].action.stop();
        }
    }
    setposition() {
        const desiredPosition = new THREE.Vector3(0, 2, 0);
        this.position.copy(desiredPosition);
    }

    //==========================================================================================
    // CHANGE ANIMATION
    //==========================================================================================
    changeAnim(oldAnimName, newAnimName) {
        this.stopAnim(oldAnimName);
        this.playAnim(newAnimName);
    }

    updateMixer(delta) {
        Object.values(this._animations).forEach(animation => {
            animation.mixer.update(delta);
        });
    }

    //     raiseDetergent(callback) {
    //         const startX = this.position.x;
    //         const startY = this.position.y;
    // 
    //         const removeCap = new TWEEN.Tween(this._tideBottleCap)
    //             .to({ y: 3, rotation: { y: -Math.PI } }, 2000)
    //             .easing(TWEEN.Easing.Quadratic.Out)
    //             .delay(0)
    //             .onComplete(() => {
    //                 this._tideBottleCap.visible = false;
    // 
    //                 const rotate = new TWEEN.Tween(this.rotation)
    //                     .to({ y: -1 }, 1000)
    //                     .easing(TWEEN.Easing.Quadratic.Out)
    //                     .delay(500)
    //                     .start();
    // 
    //                 function animateBottle() {
    //                     requestAnimationFrame(animateBottle);
    //                     TWEEN.update();
    //                 }
    //                 if (callback) callback();
    //                 animateBottle();
    //             });
    // 
    //         function animateRaise() {
    //             requestAnimationFrame(animateRaise);
    //             TWEEN.update();
    //         }
    // 
    //         removeCap.start();
    //         animateRaise();
    //     }
    // 
    // 
    //     idleAnimateDetergent() {
    //         const amplitude = 0.1;
    //         const frequency = 1;
    //         const duration = 1000;
    // 
    //         this.idle = new Tween(this._tidelGroup.position)
    //             .to({ x: this._tidelGroup.position.x - amplitude, y: this._tidelGroup.position.y - amplitude }, duration)
    //             .easing(Easing.Sinusoidal.InOut)
    //             .onUpdate(() => {
    //                 const time = performance.now() / 1000;
    //                 const angle = Math.sin(time * frequency) * amplitude;
    //                 this._tidelGroup.position.x = this._tidelGroup.position.x - angle;
    //             })
    //             .repeat(Infinity)
    //             .yoyo(true)
    //             .start();
    // 
    //         const animateIdle = () => {
    //             if (this.idle) {
    //                 requestAnimationFrame(animateIdle);
    //                 this.idle.update();
    //             }
    //         };
    //         animateIdle();
    //     }

    // stopIdle() {
    //     if (this.idle) {
    //         this.idle.stop();
    //         this.idle = null;
    //     }
    // }

    showLiquid() {
        this.tideLiquid.visible = true;

        const rotate = new Tween(this._tidelGroup.rotation)
            .to({ y: -1.5 }, 1000)
            .start();

        function animateLiquid() {
            requestAnimationFrame(animateLiquid);
            rotate.update();
        }

        animateLiquid();
    }

    pourLiquid() {
        //this needs to be edited, instead of growing the tideliquid to this.height, grow until it colides with the bottle object in the collider
        if (this.height < 3) {
            this.height += 0.01;
            this.tideLiquid.scale.set(this.height, 0.013);
        } else {
            this.tideLiquid.scale.set(3, 0.013);
        }
    }
}