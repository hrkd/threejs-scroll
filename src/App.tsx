import React, {useEffect, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import * as MathUtils from 'three/src/math/MathUtils';
import GUI from 'lil-gui'; 
import { getDistortionShaderDefinition } from './shaders/getDistortionShaderDefinition';

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: THREE.WebGLRenderer;
  let composer: EffectComposer;
  let effect:ShaderPass;

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  const scene = new THREE.Scene();
  let geo: THREE.PlaneBufferGeometry;
  let red = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000), wireframe:true});
  let plane: THREE.Mesh;
  const gui = new GUI();
  gui.add({
    strength: 0.25
  }, 'strength',0,1 );

  const resizeHandler = () => {
    const w = window.innerWidth
    const h = window.innerHeight;
    geo = new THREE.PlaneBufferGeometry(window.innerWidth , window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    composer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const scrollHandler = (ev:Event) => {
    camera.position.setY(-window.scrollY);
  }

  useEffect(() => {
    geo = new THREE.PlaneBufferGeometry(window.innerWidth , window.innerHeight,10,10);
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
    composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera ) );
    effect = new ShaderPass( getDistortionShaderDefinition() );
    composer.addPass( effect );
    effect.renderToScreen = true;

    // Setup distortion effect
    var horizontalFOV = 140;
    var cylindricalRatio = 2;
    var height = Math.tan(MathUtils.degToRad(horizontalFOV) / 2) / camera.aspect;
    camera.fov = Math.atan(height) * 2 * 180 / 3.1415926535;

    effect.uniforms[ "strength" ].value = 0.25;
    effect.uniforms[ "height" ].value = height;
    effect.uniforms[ "aspectRatio" ].value = camera.aspect;
    effect.uniforms[ "cylindricalRatio" ].value = cylindricalRatio;

    gui.onChange(ev => {
      if(effect.uniforms[ "strength" ].value)effect.uniforms[ "strength" ].value = ev.value
    })

    resizeHandler();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1);
    window.addEventListener('resize', resizeHandler);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.z = window.innerHeight/2/Math.tan(camera.fov/2 * Math.PI / 180.0);

      renderer.render(scene, camera)
      composer.render();
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
