import { DisplayObject } from "../../../utils/black-engine.module";

export default class TargetLight extends DisplayObject {
    constructor() {
        super();

        this.visible = true;
        this._initView();
    }

    _initView() {
        //         const sqLength = 80;
        // 
        //         const squareShape = new THREE.Shape()
        //             .moveTo(0, 0)
        //             .lineTo(0, sqLength)
        //             .lineTo(sqLength, sqLength)
        //             .lineTo(sqLength, 0)
        //             .lineTo(0, 0);
        // 
        //         const holePath = new THREE.Path()
        //             .moveTo(20, 10)
        //             .absarc(10, 10, 10, 0, Math.PI * 2, true);
        // 
        //         squareShape.holes.push(holePath);
        // 
        //         const geometry = new THREE.ShapeGeometry(squareShape);
        //         const material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: false });
        // 
        //         const mesh = new THREE.Mesh(geometry, material);
        //         mesh.position.set(0, 0, -0.5);
        //         mesh.scale.set(1, 1, 1);
        //         this.add(mesh); // Add the mesh to the TargetLight object
        console.log('grayedout spotlight');
    }
}
