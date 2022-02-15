import * as THREE from 'three';

import { Renderer } from './Renderer';
import { Camera } from './Camera';
import { PostProcessing } from './PostProcessing';
import { Actor } from './Actors/Actor';
import { Particles } from './Actors/Particles';

export default class App {
    private scene: THREE.Scene;
    private renderer: Renderer;
    private camera: Camera;
    private postProcessing: PostProcessing;
    private actors: Array<Actor>;
    private clock: THREE.Clock;

    constructor () {
        this.scene = new THREE.Scene();
        this.renderer = new Renderer();
        this.camera = new Camera(this.renderer.get());
        this.postProcessing = new PostProcessing(this.renderer.get(), this.scene, this.camera.get());
        this.actors = new Array<Actor>();
        this.clock = new THREE.Clock();

        this.tick();

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);

        this.setActors();
    }

    private setActors (): void {
        this.actors.push(new Particles(this.renderer.get()));

        this.actors.forEach(actor => this.scene.add(actor));
    }

    private tick (): void {
        const time = this.clock.getElapsedTime();
        let dt = this.clock.getDelta();
        dt = Math.min(dt, 1 / 20);

        this.camera.tick();
        this.postProcessing.tick(dt);

        this.actors.forEach(actor => actor.tick(time, dt));

        requestAnimationFrame(() => {
            this.tick();
        });
    }

    private resize (): void {
        this.renderer.resize();
        this.camera.resize();
        this.postProcessing.resize();
    }
}
