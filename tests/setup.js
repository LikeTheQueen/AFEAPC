import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import * as matchers from '@testing-library/jest-dom/matchers';
import "../src/app.css"

// DOMMatrix polyfill - must be at top level for pdfjs-dist
global.DOMMatrix = class DOMMatrix {
  constructor() {
    this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
    this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
    this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
    this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
    this.is2D = true; this.isIdentity = true;
  }
  static fromMatrix() { return new DOMMatrix(); }
  static fromFloat32Array() { return new DOMMatrix(); }
  static fromFloat64Array() { return new DOMMatrix(); }
  multiply() { return new DOMMatrix(); }
  inverse() { return new DOMMatrix(); }
  translate() { return new DOMMatrix(); }
  scale() { return new DOMMatrix(); }
  rotate() { return new DOMMatrix(); }
  transformPoint(p) { return p || { x: 0, y: 0 }; }
};

// WebGL mock - also at top level
HTMLCanvasElement.prototype.getContext = function(type) {
  if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
    return {
      canvas: this,
      getExtension: () => null,
      getParameter: () => null,
      getShaderPrecisionFormat: () => ({ rangeMin: 127, rangeMax: 127, precision: 23 }),
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enable: () => {},
      disable: () => {},
      blendFunc: () => {},
      depthFunc: () => {},
      clear: () => {},
      clearColor: () => {},
      viewport: () => {},
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      uniform4f: () => {},
      uniformMatrix4fv: () => {},
      drawArrays: () => {},
      drawElements: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      createFramebuffer: () => ({}),
      bindFramebuffer: () => {},
      framebufferTexture2D: () => {},
      createRenderbuffer: () => ({}),
      bindRenderbuffer: () => {},
      renderbufferStorage: () => {},
      framebufferRenderbuffer: () => {},
      deleteBuffer: () => {},
      deleteTexture: () => {},
      deleteFramebuffer: () => {},
      deleteRenderbuffer: () => {},
      deleteShader: () => {},
      deleteProgram: () => {},
      isContextLost: () => false,
      ARRAY_BUFFER: 34962,
      ELEMENT_ARRAY_BUFFER: 34963,
      STATIC_DRAW: 35044,
      FRAGMENT_SHADER: 35632,
      VERTEX_SHADER: 35633,
      COMPILE_STATUS: 35713,
      LINK_STATUS: 35714,
      COLOR_BUFFER_BIT: 16384,
      DEPTH_BUFFER_BIT: 256,
      DEPTH_TEST: 2929,
      BLEND: 3042,
      SRC_ALPHA: 770,
      ONE_MINUS_SRC_ALPHA: 771,
      TEXTURE_2D: 3553,
      RGBA: 6408,
      UNSIGNED_BYTE: 5121,
      LEQUAL: 515,
      TRIANGLES: 4,
      UNSIGNED_SHORT: 5123,
      FLOAT: 5126,
    };
  }
  return null;
};

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});