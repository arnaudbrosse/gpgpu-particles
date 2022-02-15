import * as THREE from 'three';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';

import { Actor } from './Actor';
import { Utils } from '../Utils';
import { ParticlesMaterial } from '../Materials/ParticlesMaterial';

import positionShader from '../../shaders/particles/gpu-compute/position.glsl';
import velocityShader from '../../shaders/particles/gpu-compute/velocity.glsl';

export class Particles extends Actor {
    private renderer: THREE.WebGLRenderer;
    private width: number;
    private height: number;
    private gpuCompute: GPUComputationRenderer;
    private positions: Variable;
    private velocity: Variable;
    private particles: THREE.Points;
    private particlesMaterial: ParticlesMaterial;

    constructor (renderer: THREE.WebGLRenderer) {
        super();

        this.renderer = renderer;

        this.width = 512;
        this.height = 512;

        this.initGpgpu();
        this.initParticles();
    }

    private initGpgpu (): void {
        this.gpuCompute = new GPUComputationRenderer(this.width, this.height, this.renderer);
        if (!!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)) {
            this.gpuCompute.setDataType(THREE.HalfFloatType);
        }

        const dataPosition: THREE.DataTexture = this.gpuCompute.createTexture();
        const dataVelocity: THREE.DataTexture = this.gpuCompute.createTexture();

        Utils.fillSphere(dataPosition, this.width, this.height);

        this.positions = this.gpuCompute.addVariable('v_samplerPosition', positionShader, dataPosition);
        this.velocity = this.gpuCompute.addVariable('v_samplerVelocity', velocityShader, dataVelocity);

        this.positions.material.uniforms.uTime = { value: 0.0 };
        this.positions.material.uniforms.uDelta = { value: 0.0 };
        this.velocity.material.uniforms.uTime = { value: 0.0 };
        this.velocity.material.uniforms.uDelta = { value: 0.0 };
        this.velocity.material.uniforms.uMouse = { value: new THREE.Vector2(0.0, 0.0) };

        this.gpuCompute.setVariableDependencies(this.positions, [this.velocity, this.positions]);
        this.gpuCompute.setVariableDependencies(this.velocity, [this.velocity, this.positions]);

        this.positions.wrapS = THREE.RepeatWrapping;
        this.positions.wrapT = THREE.RepeatWrapping;
        this.velocity.wrapS = THREE.RepeatWrapping;
        this.velocity.wrapT = THREE.RepeatWrapping;

        const gpuComputeError = this.gpuCompute.init();
        if (gpuComputeError) {
            console.error('ERROR', gpuComputeError);
        }
    }

    private initParticles (): void {
        this.particlesMaterial = new ParticlesMaterial();

        const vertices = new Float32Array(this.width * this.height * 3).fill(0);
        const references = new Float32Array(this.width * this.height * 2);

        for (let i = 0; i < references.length; i += 2) {
            const index = i / 2;

            references[i + 0] = (index % this.width) / this.width;
            references[i + 1] = Math.floor(index / this.width) / this.height;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('reference', new THREE.BufferAttribute(references, 2));

        this.particles = new THREE.Points(geometry, this.particlesMaterial);
        this.add(this.particles);
    }

    public tick (time: number, dt: number): void {
        this.gpuCompute.compute();

        this.positions.material.uniforms.uTime.value = time;
        this.positions.material.uniforms.uDelta.value = dt;

        this.velocity.material.uniforms.uTime.value = time;
        this.velocity.material.uniforms.uDelta.value = dt;

        const renderTarget = this.gpuCompute.getCurrentRenderTarget(this.positions);
        this.particlesMaterial.uniforms.uTexturePosition.value = (<any>renderTarget).texture;
        this.particlesMaterial.uniforms.uTime.value = time;
        this.particlesMaterial.uniforms.uDelta.value = dt;
    }
}
