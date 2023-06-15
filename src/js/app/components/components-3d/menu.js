import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, Cache, AnimationMixer, MeshStandardMaterial, DoubleSide } from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";
import { MessageDispatcher } from "../../../utils/black-engine.module";

export default class Menu extends Group {
    constructor(scene) {
        super();
        //=============================================
        // EVENTS
        //=============================================
        // this.messageDispatcher = new MessageDispatcher();
        // this.events = {
        //     someEvent: "someEvent",
        // };

        //=============================================
        // PROPERTIES
        //=============================================
        this._scene = scene;

        this._animations = {
            pour: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: 0,
                yoyo: false
            },
            raise: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: false
            },
            fillVessel: {
                tween: null,
                action: null,
                mixer: null,
                duration: null,
                time: 2000,
                repeat: Infinity,
                yoyo: false
            }
        }


        //=============================================
        // ELEMENTS
        //=============================================
        this._view = null;
        this._init();

    }
    _init() {
        const asset = Cache.get('assets').scene.children;
        let view = this._view = SkeletonUtils.clone(Cache.get('assets').scene);
        this.add(view);

        const childProperties = {
            Mesh006: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("detergent_poster")
                }),
                castShadow: true
            },
            Mesh006_1: {
                material: new MeshStandardMaterial({
                    color: 0xF59646,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                }),
                castShadow: true
            },
            Cap: {
                material: new MeshStandardMaterial({
                    color: 0x0000ff,
                    roughness: 0,
                    transparent: true,
                    opacity: 0.5,
                    side: DoubleSide,
                    skinning: true,
                }),
                castShadow: true
            },
            Liquid: {
                material: new MeshStandardMaterial({
                    color: 0x0000ff,
                    roughness: 0,
                    transparent: true,
                    opacity: 0.5,
                    side: DoubleSide,
                    skinning: true,
                }),
                castShadow: true,
                visible: false
            },
            Liquid_base: {
                material: new MeshStandardMaterial({
                    color: 0x0000ff,
                    roughness: 0,
                    transparent: true,
                    opacity: 0.5,
                    side: DoubleSide,
                    skinning: true,
                }),
                castShadow: true,
                visible: false
            },
            CornFlakes: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("corn_flakes")
                }),
                castShadow: true
            },
            Mesh002: {
                material: new MeshStandardMaterial({
                    color: 0x7DCCFF,
                    roughness: 0,
                    side: DoubleSide,
                }),
                castShadow: true
            },
            SentBooster: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("scent_booster")
                }),
                castShadow: true
            },
            Mesh002_1: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("scent_booster")
                }),
                castShadow: true
            },
            LandryDetergent: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("detergent")
                }),
                castShadow: true
            },
            Rice: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("rice_bag")
                }),
                castShadow: true
            },
            Mesh: {
                material: new MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    skinning: true,
                    map: Cache.get("rice_bag")
                }),
                castShadow: true
            }
        };

        view.traverse(child => {
            child.frustumCulled = false;
            console.log(child.name); // TO SEE ALL CHILDREN'S names in person

            if (child.type === "Mesh" || child.type === "SkinnedMesh") {
                const properties = childProperties[child.name];
                if (properties) {
                    child.material = properties.material;
                    child.castShadow = properties.castShadow;
                    if (properties.visible !== undefined) {
                        child.visible = properties.visible;
                    }
                }
            }
        });

        let animationsNames = ["pour", "raise", "fillVessel"];

        for (let index = 0; index < animationsNames.length; index++) {
            let animName = animationsNames[index];
            let anim = Cache.get('assets').animations[index];
            this._animations[animName].duration = anim.duration;
            this._animations[animName].mixer = new AnimationMixer(view);
            this._animations[animName].action = this._animations[animName].mixer.clipAction(anim);
        }
    }

    playAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();

        this._animations[name].action.play();

        this._animations[name].tween = new TWEEN.Tween(this._animations[name].action)
            .to({ time: this._animations[name].duration }, this._animations[name].time)
            .repeat(this._animations[name].repeat)
            .yoyo(this._animations[name].yoyo)
            .onUpdate(() => {
                this._animations[name].mixer.update(0.0000001);
            })
            .onComplete(() => {
                this.stopAnim(name);
            })
            .start();

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            Object.values(this._animations).forEach(animation => {
                animation.mixer.update(0.0167); // Update the mixer with a fixed delta time (60 FPS)
            });
        }
        animate.bind(this)();
    }


    //==========================================================================================
    // STOP ANIMATION
    //==========================================================================================
    stopAnim(name) {
        if (this._animations[name].tween != null) this._animations[name].tween.stop();
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

    stopIdle() {
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
    }

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