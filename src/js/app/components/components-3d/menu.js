
import { Group, Cache, MeshPhysicalMaterial, DoubleSide } from "three";
import { SkeletonUtils } from "../../../utils/skeleton-utils";

export default class Menu extends Group {
    constructor(scene) {
        super();
        this._scene = scene;

        this.detergentBottle = null;
        this._init();
    }

    _init() {
        const asset = Cache.get('assets').scene.children;
        let view = this.detergentBottle = SkeletonUtils.clone(Cache.get('assets').scene);
        this.add(view);

        const childProperties = {
            Mesh006: {
                visible: false

            },
            Mesh006_1: {
                visible: false

            },
            Cap: {
                visible: false
            },
            Liquid: {

                visible: false
            },
            Liquid_base: {
                visible: false
            },
            CornFlakes: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("corn_flakes")
                }),
                castShadow: true
            },
            Mesh002: {
                material: new MeshPhysicalMaterial({
                    color: 0x7DCCFF,
                    roughness: 0,
                    side: DoubleSide,
                }),
                castShadow: true
            },
            SentBooster: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("scent_booster")
                }),
                castShadow: true
            },
            Mesh002_1: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("scent_booster")
                }),
                castShadow: true
            },
            LandryDetergent: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("detergent")
                }),
                castShadow: true
            },
            Rice: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("rice_bag")
                }),
                castShadow: true
            },
            Mesh: {
                material: new MeshPhysicalMaterial({
                    color: 0xffffff,
                    emissive: 0x000000,
                    roughness: 1,
                    metalness: 0.1,
                    side: DoubleSide,
                    map: Cache.get("rice_bag")
                }),
                castShadow: true
            }
        };

        view.traverse(child => {
            child.frustumCulled = false;

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
    }
}