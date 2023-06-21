import * as THREE from "three";

export default class Fill extends THREE.Object3D {
    constructor() {
        super();
        this.height = 0;
        this.top = 0.25;
        this.bottom = 0.24;
        this.visible = false;
        this._initView();
    }

    _initView() {
        console.log("fill");
        var geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
        var fill = new THREE.Mesh(geometry, material);
        this.add(fill);
    }

    show() {
        this.visible = true;
    }

    fill() {
        if (this.height <= 1) {
            this.height += 0.01;
            if (this.top <= 0.28) this.top += 0.001;
            if (this.bottom <= 0.25) this.bottom += 0.001;

            this.children[0].geometry.dispose(); // Dispose previous geometry
            this.children[0].geometry = new THREE.CylinderGeometry(this.top, this.bottom, this.height, 32);
            this.children[0].geometry.translate(0, this.height / 2, 0); // Translate the geometry to align the bottom to 0,0,0
        }
    }
}