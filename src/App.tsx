import React, {useEffect, useRef, useMemo, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: THREE.WebGLRenderer;
  let effect: AsciiEffect;
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  const scene = new THREE.Scene();
  let geo: THREE.PlaneBufferGeometry;
  let red = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) });
  let plane: THREE.Mesh;
  const loader = new THREE.ImageBitmapLoader();
  loader.setOptions({ imageOrientation: 'flipY' });
  let canvas;
  let context: WebGL2RenderingContext | null | undefined;

  let mat: THREE.MeshBasicMaterial;

  const resizeHandler = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    geo = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    effect.setSize(w, h);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const scrollHandler = (ev: Event) => {
    camera.position.setY(-window.scrollY);
  };

  useEffect(() => {
    geo = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);

    window.addEventListener('scroll', scrollHandler);

    loader.load(
      // resource URL
      './pexels-michael-morse-7536592.jpg',

      // onLoad callback
      function (imageBitmap) {
        const texture = new THREE.CanvasTexture(imageBitmap);
        mat = new THREE.MeshBasicMaterial({ map: texture });
        plane = new THREE.Mesh(geo, mat);
        scene.add(plane);
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function (err) {
        console.log('An error happened');
      }
    );
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;

    renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true });
    effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: false });

    resizeHandler();
    renderer.setClearColor(new THREE.Color(0x000000), 1);
    const wrapper = document.querySelector('#root');

    //add ascii layer
    wrapper?.appendChild(effect.domElement);
    effect.domElement.setAttribute('class', 'ascii');

    window.addEventListener('resize', resizeHandler);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.z = window.innerHeight / 2 / Math.tan(((camera.fov / 2) * Math.PI) / 180.0);

      // renderer.render(scene, camera);
      effect.render(scene, camera);
    };
    animate();
  }, [ref]);

  return (
    <>
      <canvas ref={ref}/>
      <div className="App" style={{ height: 10000 }}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}

export default App;
