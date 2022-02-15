import * as THREE from 'three';

export abstract class Actor extends THREE.Object3D {
    abstract tick (time: number, dt: number): void;
}
