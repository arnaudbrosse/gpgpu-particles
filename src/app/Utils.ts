import * as THREE from 'three';

export class Utils {
    static fillSphere (texture: THREE.DataTexture, width: number, height: number): void {
        const textureArraySize = width * height * 4;
        for (let i = 0; i < textureArraySize; i += 4) {
            const r = Math.random() * 0.2;
            const a = Math.random() * Math.PI;

            texture.image.data[i + 0] = r * Math.sin(a) * Math.cos(i);
            texture.image.data[i + 1] = r * Math.sin(a) * Math.sin(i);
            texture.image.data[i + 2] = r * Math.cos(a);
            texture.image.data[i + 3] = 1;
        }
    }

    static fillCube (texture: THREE.DataTexture, width: number, height: number): void {
        const size = 256;
        const textureArraySize = width * height * 4;
        for (let i = 0; i < textureArraySize; i += 4) {
            texture.image.data[i + 0] = (Math.random() - 0.5) * size;
            texture.image.data[i + 1] = (Math.random() - 0.5) * size;
            texture.image.data[i + 2] = (Math.random() - 0.5) * size;
            texture.image.data[i + 3] = 1;
        }
    }

    static fillFibonacciShpere (texture: THREE.DataTexture, width: number, height: number): void {
        const textureArraySize = width * height * 4;
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < textureArraySize; i += 4) {
            const y = 1 - (i / ((textureArraySize / 4) - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            texture.image.data[i + 0] = Math.cos(theta) * radius;
            texture.image.data[i + 1] = y;
            texture.image.data[i + 2] = Math.sin(theta) * radius;
            texture.image.data[i + 3] = 1;
        }
    }
}
