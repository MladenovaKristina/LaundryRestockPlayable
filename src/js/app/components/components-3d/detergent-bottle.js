import * as THREE from "three";
import { Tween, Easing } from "@tweenjs/tween.js";

export default class DetergentBottle extends THREE.Object3D {
    constructor() {
        super();

        this.tidelGroup = null;
        this.tideLiquid = null;
        this.height = 0;
        this._initView();

        this.idle = null;
    }

    _initView() {
        const asset = THREE.Cache.get("assets").scene.children;

        const tidelGroup = this._tidelGroup = asset[2].clone();

        tidelGroup.scale.set(0.013, 0.013, 0.013);
        tidelGroup.rotation.z = Math.PI;
        tidelGroup.position.z = -1;
        tidelGroup.position.x = -0.45;
        tidelGroup.position.y = 0;
        this.add(tidelGroup);

        this.tideBottle = tidelGroup.children.find(x => x.name === "Tide").children[1];
        this.tideBottle.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            color: 0xF59646,
            reflectivity: 10,
            side: THREE.DoubleSide,
        });
        this.tideBottle.castShadow = true;

        const tideLabel = tidelGroup.children.find(x => x.name === "Tide").children[0].material = new THREE.MeshPhysicalMaterial({
            roughness: 0.4,
            metalness: 0.15,
            map: THREE.Cache.get("detergent_poster"),
            reflectivity: 10,
            side: THREE.DoubleSide,
        });

        const tideBottleCap = this._tideBottleCap = tidelGroup.children.find(x => x.name === "Tide").children.find(x => x.name === "Cap").material = new THREE.MeshPhysicalMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.6,
        });

        const tideLiquid = this.tideLiquid = tidelGroup.children.find(x => x.name === "Tide").children.find(y => y.name === "Liquid_base").children[0];

        tideLiquid.material = new THREE.MeshPhysicalMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.6,
        });
        tideLiquid.castShadow = true;
        tideLiquid.visible = false;
        tideLiquid.scale.set(this.height, 0.013,);

    }

    raiseDetergent(callback) {
        const startX = this._tidelGroup.position.x;
        const startY = this._tidelGroup.position.y;

        const removeCap = new Tween(this._tideBottleCap)
            .to({ opacity: 0 }, 1000)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {


                const rotate = new Tween(this._tidelGroup.rotation)
                    .to({ y: -1 }, 1000)
                    .easing(Easing.Quadratic.Out)
                    .start();

                function animateBottle() {
                    requestAnimationFrame(animateBottle);
                    raiseTween.update()
                    rotate.update()

                }
                const raiseTween = new Tween(this._tidelGroup.position)
                    .to({ x: startX, y: 1.8 }, 1000)
                    .easing(Easing.Quadratic.Out)
                    .onUpdate(() => {
                        this._tidelGroup.position.set(this._tidelGroup.position.x, this._tidelGroup.position.y, 0);
                    })
                    .onComplete(() => {
                        this.idleAnimateDetergent();
                        if (callback) callback();
                    })
                    .start();
                animateBottle();
            })
            .start();


        function animateRaise() {
            requestAnimationFrame(animateRaise);
            removeCap.update()
        }

        animateRaise();
    }

    idleAnimateDetergent() {
        const startX = this._tidelGroup.position.x;
        const startY = this._tidelGroup.position.y;

        const amplitude = 0.1; // Adjust the amplitude of the swaying motion
        const frequency = 1; // Adjust the frequency of the swaying motion
        const duration = 1000; // Adjust the duration of the animation

        const rotate = new Tween(this._tidelGroup.rotation)
            .to({ y: -1 }, duration)
            .easing(Easing.Quadratic.Out)
            .start();

        const currentX = this._tidelGroup.position.x;
        const currentY = this._tidelGroup.position.y;

        this.idle = new Tween(this._tidelGroup.position)
            .to({ x: currentX - amplitude, y: currentY - amplitude }, duration)
            .easing(Easing.Sinusoidal.InOut)
            .repeat(Infinity)
            .yoyo(true)
            .start();

        this.idle.onUpdate(() => {
            const time = performance.now() / 1000;
            const angle = Math.sin(time * frequency) * amplitude;
            this._tidelGroup.position.x = currentX - angle;

        });

        const animateIdle = () => {
            requestAnimationFrame(animateIdle);
            rotate.update();
            if (this.idle) { this.idle.update(); }
        }

        animateIdle();
    }

    stopIdle() {
        if (this.idle) {
            this.idle.stop();
            this.idle = null;
        }
    }
    showLiquid() {
        this.tideLiquid.visible = true;
        this.stopIdle();

        const rotate = new Tween(this._tidelGroup.rotation)
            .to({ y: -1.5 }, 1000)
            .easing(Easing.Quadratic.Out)
            .start();
        function animateLiquid() {
            requestAnimationFrame(animateLiquid);
            rotate.update();
        }
        animateLiquid();
    }

    pourLiquid() {
        if (this.height < 3) {
            this.height += 0.01;
            this.tideLiquid.scale.set(this.height, 0.013);
            console.log(this.tideLiquid.scale.x);
        }
        else this.tideLiquid.scale.set(3, 0.013);

    }

}
