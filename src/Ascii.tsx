import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function Ascii() {
  const w = window.innerWidth
  const h = window.innerHeight;
  const r = Math.floor(h / 20);
  const c = Math.floor(w / 20);
  const [time, setTime] = useState<number>(0);
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d');
  let timer:NodeJS.Timer;

  useEffect(() => {
    const threeCanvas:HTMLCanvasElement|null = document.querySelector('canvas');

    timer = setInterval(() => {
      if (!threeCanvas) return;
      ctx?.drawImage(threeCanvas, 0, 0, window.innerWidth/20, window.innerHeight/20);
      window.pixels = ctx?.getImageData(0, 0, window.innerWidth/20, window.innerHeight/20).data
      // for (let row = 0; row < r; row ++ ){
      //   for (let col = 0; col < c; col ++ ){
      //     const i = row * c + col;
      //   }
      // }
      setTime(Math.random());
    },1000/20)

    return () => {
      clearInterval(timer);
    }
  }, []);

  // useEffect(() => {
  //   if (context === null) return;
  //   console.log(pixs)
  // }, [context]);

  const rgbToGray = (r:number, g:number, b:number):number => {
    return r*0.3+g*0.59+b*0.11
  }

  const getAscii = (i: number):string => {
    if(!window.pixels)return ''
    const r = window.pixels[i * 4];
    const g = window.pixels[i * 4 + 1];
    const b = window.pixels[i * 4 + 2];
    const gray = rgbToGray(r, g, b);
    console.log(gray)

    // 0.0 <= x <= 0.1 == '.'
    // 0.1 <= x <= 0.2 == ','
    // 0.2 <= x <= 0.3 == ';'
    // 0.3 <= x <= 0.4 == '!'
    // 0.4 <= x <= 0.5 == 'v'
    // 0.5 <= x <= 0.6 == 'l'
    // 0.6 <= x <= 0.7 == 'L'
    // 0.7 <= x <= 0.8 == 'F'
    // 0.8 <= x <= 0.9 == 'E'
    // 0.9 <= x <= 1.0 == '$'
    // https://github.com/ebenpack/laboratory/blob/master/ASCII/ASCII-grayscale-values.txt

    if (gray < 1) {
      return ''
    } else if (gray < 255/10*1) {
      return '.'
    } else if (gray < 255/10*2) {
      return ','
    } else if (gray < 255/10*3) {
      return ';'
    } else if (gray < 255/10*4) {
      return '!'
    } else if (gray < 255/10*5) {
      return 'v'
    } else if (gray < 255/10*6) {
      return 'l'
    } else if (gray < 255/10*7) {
      return 'L'
    } else if (gray < 255/10*8) {
      return 'F'
    } else if (gray < 255/10*9) {
      return 'E'
    } else {
      return '$'
    }
  }

  return (
    <div className="ascii">
      {Array(r).fill(null).map((item, row) => <div key={row}>
        <>
          {Array(c).fill(null).map((it, col) => <div key={col}>{getAscii(row * c + col)}</div>)}
        </>
      </div>
      )}
      <span style={{ display: 'none' }}>{time}</span>
    </div>
  );
}

export default Ascii;
