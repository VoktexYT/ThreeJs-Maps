import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Tween, Easing } from '@tweenjs/tween.js';

const OBJECT_SRC: string = new URL("../assets/map1.obj", import.meta.url).href;
const DEFAULT_POSITION: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const DEFAULT_SCALE: THREE.Vector3 = new THREE.Vector3(0.01, 0.01, 0.01);

export default class Map {
    tweensAnimation: Tween | undefined;
    object: THREE.Object3D | undefined;

    constructor(
        private readonly scene: THREE.Scene, 
        private readonly camera: THREE.PerspectiveCamera
    ) {
        this.loadObject();
    }

    loadObject(): void {
        const OBJ_LOADER = new OBJLoader();

        OBJ_LOADER.load(
            OBJECT_SRC,
            (object) => {
                object.position.copy(DEFAULT_POSITION);
                object.scale.copy(DEFAULT_SCALE);
                this.scene.add(object);
                this.camera.lookAt(object.position);

                console.log("End of loading");

                this.object = object;

                let positionY = { y: -5 };

                this.tweensAnimation = new Tween(positionY)
                    .to({ y: 0 }, 2000)
                    .easing(Easing.Bounce.Out)
                    .onUpdate(() => {
                        if (this.object) {
                            this.object.position.y = positionY.y;
                        }
                    })
                    .start();
            },

            (xhr) => {
                console.log(`OBJ File ${((xhr.loaded / xhr.total) * 100).toFixed(2)}% loaded`);
            },

            (error) => {
                console.error('An error happened', error);
            }
        );
    }

    update(): void {
        this.tweensAnimation?.update();
    }
}
