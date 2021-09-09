export class DataPoint {
  constructor(data, xOrigin, yOrigin) {
    this.data = data;
    this.x = xOrigin + this.data.length * 30;
    this.y = yOrigin - this.data[data.length - 1];
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
