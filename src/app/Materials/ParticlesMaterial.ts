import * as THREE from 'three';

import fragmentShader from '../../shaders/Particles/fragment.glsl';
import vertexShader from '../../shaders/Particles/vertex.glsl';

export class ParticlesMaterial extends THREE.ShaderMaterial {
    constructor () {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uDelta: { value: 0.0 },
                uColor: { value: new THREE.Color(0x41a5ff) },
                uSize: { value: 1.0 },
                uTexturePosition: { value: null }
            },
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
    }
}
