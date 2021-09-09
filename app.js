import { DataPoint } from "./dataPoint.js";
import { Cubic_Spline_Interpolation } from "./mathematics.js";
import { Graph } from "./graph.js";

const DUMMY_DATA = [];
const dataPoints = [];

const getValue = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dataOrder = 0;

    document.body.appendChild(this.canvas);

    addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    this.graph = new Graph(
      this.stageWidth,
      this.stageHeight,
      -100,
      100,
      -100,
      100,
      500,
      500
    );

    this.cubic = new Cubic_Spline_Interpolation(
      this.graph.xOrigin,
      this.graph.yOrigin
    );

    this.cubic.initGaussian();

    setInterval(() => {
      DUMMY_DATA.push(getValue(-80, 80));
      this.dataPoint = new DataPoint(
        DUMMY_DATA,
        this.graph.xOrigin,
        this.graph.yOrigin
      );

      dataPoints.push(this.dataPoint);

      this.cubic.addDataToSet(this.dataPoint);
      this.cubic.changeSizeOfSet();
      this.cubic.initMatrix();
      this.cubic.fillMatrix();
      this.cubic.updateGaussian();
      this.cubic.getCoefficients();
      this.cubic.createFunctionSet();

      console.log(this.cubic.reducedRowEchelonForm);
    }, 200);

    requestAnimationFrame(this.animate.bind(this));
  }
  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.graph.drawAxes(this.ctx);

    if (this.dataPoint) {
      dataPoints.forEach((dataPoint) => {
        dataPoint.draw(this.ctx);
      });
    }
    this.cubic.drawSpline(this.ctx);
  }
}

window.onload = () => {
  new App();
};
