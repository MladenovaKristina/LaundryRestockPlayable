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

        this.raycaster = new THREE.Raycaster();

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

        const tideBottleCap = this._tideBottleCap = tidelGroup.children.find(x => x.name === "Tide").children.find(x => x.name === "Cap");
        tideBottleCap.material = new THREE.MeshPhysicalMaterial({
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
        tideLiquid.scale.set(this.height, 0.013);

        this._initCollider(this.tideBottle);

    }

    createTween(options) {
        return new Tween(options.target)
            .to(options.to, options.duration)
            .easing(options.easing)
            .onUpdate(options.onUpdate)
            .onComplete(options.onComplete);
    }

    createRotateTween() {
        return new Tween(this._tidelGroup.rotation)
            .to({ y: -1 }, 1000)
            .easing(Easing.Quadratic.Out);
    }

    raiseDetergent(callback) {
        const startX = this._tidelGroup.position.x;
        const startY = this._tidelGroup.position.y;

        const removeCap = this.createTween({
            target: this._tideBottleCap,
            to: { y: 3, rotation: { y: -Math.PI } },
            duration: 2000,
            easing: Easing.Quadratic.Out,
            onComplete: () => {
                this._tideBottleCap.visible = false;

                const rotate = this.createRotateTween()
                    .start();

                function animateBottle() {
                    requestAnimationFrame(animateBottle);
                    raiseTween.update();
                    rotate.update();
                }

                const raiseTween = this.createTween({
                    target: this._tidelGroup.position,
                    to: { x: startX, y: 1.8 },
                    duration: 1000,
                    easing: Easing.Quadratic.Out,
                    onUpdate: () => {
                        this._tidelGroup.position.set(this._tidelGroup.position.x, this._tidelGroup.position.y, 0);
                    },
                    onComplete: () => {
                        this.idleAnimateDetergent();
                        if (callback) callback();
                    }
                }).start();

                animateBottle();
            }
        }).start();

        function animateRaise() {
            requestAnimationFrame(animateRaise);
            removeCap.update();
        }

        animateRaise();
    }

    createIdleAnimateTween() {
        const amplitude = 0.1; // Adjust the amplitude of the swaying motion
        const frequency = 1; // Adjust the frequency of the swaying motion
        const duration = 1000; // Adjust the duration of the animation

        const rotate = this.createRotateTween();

        const currentX = this._tidelGroup.position.x;
        const currentY = this._tidelGroup.position.y;

        return this.createTween({
            target: this._tidelGroup.position,
            to: { x: currentX - amplitude, y: currentY - amplitude },
            duration: duration,
            easing: Easing.Sinusoidal.InOut,
            onUpdate: () => {
                const time = performance.now() / 1000;
                const angle = Math.sin(time * frequency) * amplitude;
                this._tidelGroup.position.x = currentX - angle;
            },
            repeat: Infinity,
            yoyo: true
        });
    }

    idleAnimateDetergent() {
        this.stopIdle();

        const rotate = this.createRotateTween().start();

        this.idle = this.createIdleAnimateTween().start();

        const animateIdle = () => {
            requestAnimationFrame(animateIdle);
            rotate.update();
            if (this.idle) {
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

    showLiquid() {
        this.tideLiquid.visible = true;
        this.stopIdle();

        const rotate = this.createRotateTween()
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


    _initParticles() {
        const particleGeometry = new THREE.CircleGeometry(0.5, 10);

        this.particles = [];
        for (let i = 0; i < 4; i++) {
            const particle = new THREE.Mesh(particleGeometry, this._initView.fillMaterial);
            particle.position.set(0, 1, 0);
            this.add(particle);
            this.particles.push(particle);
        }
        this.add(this.particles);
    }
    _initCollider(bottle) {
        console.log('colliding with bottle');
        //code for collider based on received shape

    }
    spillAnimate() {
        console.log("spilling");
        const distance = 0.4;
        const duration = 1;

        //when the liquid height touches the bottle, animating particles by throwing them away from the collision point for 2 seconds, reset their position instead of destroying them and replay the animation again if it's still colliding
    }
}
