import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { Pass } from './Pass';

export class Bloom extends Pass {
    private bloomPass: UnrealBloomPass;

    constructor (composer: EffectComposer) {
        super();

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 0.8, 0.2);
        composer.addPass(this.bloomPass);
    }

    public tick (_dt: number): void {}

    public resize (): void {}
}
