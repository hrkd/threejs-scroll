import React, {useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import { isJSDocReturnTag } from 'typescript';
import * as THREE from 'three';

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: THREE.WebGLRenderer;
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  const scene = new THREE.Scene();
  let geo: THREE.PlaneBufferGeometry;
  let red = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000), wireframe:true });
  let plane: THREE.Mesh;

  const resizeHandler = () => {
    const w = window.innerWidth
    const h = window.innerHeight;
    geo = new THREE.PlaneBufferGeometry(window.innerWidth , window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const scrollHandler = (ev:Event) => {
    camera.position.setY(-window.scrollY);
  }

  useEffect(() => {
    geo = new THREE.PlaneBufferGeometry(window.innerWidth , window.innerHeight);
    plane = new THREE.Mesh(geo, red);
    scene.add(plane);

    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('scroll', scrollHandler);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    renderer = new THREE.WebGLRenderer({canvas: ref.current})
    resizeHandler();
    renderer.setClearColor(new THREE.Color(0x0000FF), 1);
    window.addEventListener('resize', resizeHandler);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.z = window.innerHeight/2/Math.tan(camera.fov/2 * Math.PI / 180.0);

      renderer.render(scene, camera)
    };
    animate();
  }, [ref]);
  return (
    <>
      <canvas ref={ref}></canvas>
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
