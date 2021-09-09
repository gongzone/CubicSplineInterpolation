export class Graph {
  constructor(stageWidth, stageHeight, xMin, xMax, yMin, yMax, xWidth, yWidth) {
    this.xOrigin = stageWidth / 2;
    this.yOrigin = stageHeight / 2;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.xWidth = xWidth;
    this.yWidth = yWidth;

    this.x_scaling = (xMax - xMin) / xWidth;
    this.y_scaling = (yMax - yMin) / yWidth;

    this.xMin_relative = xMin / this.x_scaling;
    this.xMax_relative = xMax / this.x_scaling;
    this.yMin_relative = yMin / this.y_scaling;
    this.yMax_relative = yMax / this.y_scaling;

    this.xMin_absolute = this.xMin_relative + this.xOrigin;
    this.xMax_absolute = this.xMax_relative + this.xOrigin;
    this.yMin_absolute = this.yOrigin - this.yMin_relative;
    this.yMax_absolute = this.yOrigin - this.yMax_relative;

    this.xGap = this.xMin_absolute;
    this.yGap = this.yOrigin;
  }
  drawAxes(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.xMin_absolute, this.yOrigin);
    ctx.lineTo(this.xMax_absolute, this.yOrigin);
    ctx.moveTo(this.xOrigin, this.yMax_absolute);
    ctx.lineTo(this.xOrigin, this.yMin_absolute);
    ctx.stroke();
  }
}
