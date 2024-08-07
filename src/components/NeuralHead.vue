<script lang="ts" setup>
import * as THREE from 'three';
import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { gsap } from 'gsap';
import { onMounted, ref, onBeforeUnmount } from 'vue';

const site = {
  Width: 0,
  Height: 0,
};

const Background: {
  camera: PerspectiveCamera | null;
  scene: Scene | null;
  renderer: WebGLRenderer | null;
  animate: (() => void) | null;
  ticker: typeof gsap.ticker | null;
} = {
  camera: null,
  scene: null,
  renderer: null,
  animate: null,
  ticker: null,
}

const particleHeadRef = ref<HTMLDivElement>();

const initBackground = () => {
  const container = particleHeadRef.value;

  if (!container) {
    throw Error("Container not initialized") //todo - give better errors
  }

  site.Width = container.clientWidth;
  site.Height = container.clientHeight;

  let mouseX = 0, mouseY = 0;
  let windowHalfX = site.Width / 2;
  let windowHalfY = site.Height / 2;

  Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
  Background.camera.position.z = 300;

  Background.scene = new THREE.Scene();

  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => {
    // Progress handling
  };

  const p_geom = new THREE.BufferGeometry();
  const p_material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 1.5
  });

  const loader = new OBJLoader(manager);
  loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', (object) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const scale = container.clientHeight / 100; // Adjust scaling based on height
        const vertices = child.geometry.attributes.position.array;
        const scaledVertices = new Float32Array(vertices.length);
        for (let i = 0; i < vertices.length; i += 3) {
          scaledVertices[i] = vertices[i] * scale;
          scaledVertices[i + 1] = vertices[i + 1] * scale;
          scaledVertices[i + 2] = vertices[i + 2] * scale;
        }
        p_geom.setAttribute('position', new THREE.Float32BufferAttribute(scaledVertices, 3));
      }
    });

    const p = new THREE.Points(p_geom, p_material);
    if (!Background.scene) {
      throw Error("Scene missing.")
    }
    Background.scene.add(p);
  });



  Background.renderer = new THREE.WebGLRenderer({ alpha: true });
  Background.renderer.setSize(site.Width, site.Height);
  Background.renderer.setClearColor(0x000000, 0);

  container.appendChild(Background.renderer.domElement);
  window.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onWindowResize);

  function onWindowResize() {
    if (!container) {
      throw Error("Container not initialized") //todo - give better errors
    }

    if (!Background.camera) {
      throw Error("Container not initialized") //todo - give better errors
    }

    if (!Background.renderer) {
      throw Error("Renderer not initialized") //todo - give better errors
    }

    site.Width = container.clientWidth;
    site.Height = container.clientHeight;
    windowHalfX = site.Width / 2;
    windowHalfY = site.Height / 2;

    Background.camera.aspect = site.Width / site.Height;
    Background.camera.updateProjectionMatrix();

    Background.renderer.setSize(site.Width, site.Height);
  }

  function onDocumentMouseMove(event: MouseEvent) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
  }

  function render() {
    if (!Background.camera) {
      throw Error("Container not initialized") //todo - give better errors
    }

    if (!Background.scene) {
      throw Error("Scene not initialized") //todo - give better errors
    }

    if (!Background.renderer) {
      throw Error("Renderer not initialized") //todo - give better errors
    }
    // Background.camera.position.x += ((-mouseX * 0.5) - Background.camera.position.x) * 0.05;
    // Background.camera.position.y += ((mouseY * 0.5) - Background.camera.position.y) * 0.05;

    Background.camera.position.x += ((mouseX * 0.5) - Background.camera.position.x) * 0.005;
    Background.camera.position.y += (-(mouseY * 0.5) - Background.camera.position.y) * 0.005;

    Background.camera.lookAt(Background.scene.position);

    Background.renderer.render(Background.scene, Background.camera);
  }

  Background.animate = () => {
    Background.ticker = gsap.ticker;
    Background.ticker.add(render);
  };

  render();
  Background.animate();
};

onMounted(() => {
  initBackground();
});

onBeforeUnmount(() => {
  const container = particleHeadRef.value;
  if (container) {
    window.removeEventListener('mousemove', onDocumentMouseMove);
    window.removeEventListener('resize', onWindowResize);
  }
});
</script>

<template>
  <div ref="particleHeadRef" class="particlehead h-full aspect-square"></div>
</template>
