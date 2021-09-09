export class Cubic_Spline_Interpolation {
  constructor(xOrigin, yOrigin) {
    this.dataSet = [{ x: xOrigin, y: yOrigin }];
    this.matrix = [];
    this.reducedRowEchelonForm = [];
    this.coefficents = [];
    this.functionSet = [];
    this.n = 0;
  }
  addDataToSet(dataPoint) {
    this.dataSet.push({ x: dataPoint.x, y: dataPoint.y });
  }
  changeSizeOfSet() {
    this.n = this.dataSet.length - 1;
  }
  initMatrix() {
    this.matrix = [];

    if (this.n >= 2) {
      for (let i = 0; i < this.n * 4; i++) {
        this.matrix.push([]);
        for (let j = 0; j <= this.n * 4; j++) {
          this.matrix[i][j] = 0;
        }
      }
    }
  }
  fillMatrix() {
    const yColumn = this.n * 4;
    let row = 0;
    let iterateN = this.n * 2;

    if (this.n < 2) {
      return;
    }
    // Equations(n * 2)

    for (let column = 0, dataIndex = 0; row < iterateN; row++) {
      if (row !== 0 && row % 2 === 0) {
        column += 4;
      }
      if (row % 2 === 1) {
        dataIndex++;
      }
      this.matrix[row][column] = this.dataSet[dataIndex].x ** 3;
      this.matrix[row][column + 1] = this.dataSet[dataIndex].x ** 2;
      this.matrix[row][column + 2] = this.dataSet[dataIndex].x;
      this.matrix[row][column + 3] = 1;
      this.matrix[row][yColumn] = this.dataSet[dataIndex].y;
    }

    iterateN += this.n - 1;
    // First-Derivative(n - 1)
    for (let column = 0, dataIndex = 1; row < iterateN; row++) {
      this.matrix[row][column] = 3 * this.dataSet[dataIndex].x ** 2;
      this.matrix[row][column + 1] = 2 * this.dataSet[dataIndex].x;
      this.matrix[row][column + 2] = 1;
      this.matrix[row][column + 4] = -3 * this.dataSet[dataIndex].x ** 2;
      this.matrix[row][column + 5] = -2 * this.dataSet[dataIndex].x;
      this.matrix[row][column + 6] = -1;

      column += 4;
      dataIndex++;
    }

    iterateN += this.n - 1;
    // Second-Derivative(n - 1)
    for (let column = 0, dataIndex = 1; row < iterateN; row++) {
      this.matrix[row][column] = 6 * this.dataSet[dataIndex].x;
      this.matrix[row][column + 1] = 2;
      this.matrix[row][column + 4] = -6 * this.dataSet[dataIndex].x;
      this.matrix[row][column + 5] = -2;

      column += 4;
      dataIndex++;
    }

    iterateN += 2;
    // Boundary-condition(Natural, 2)
    for (let column = 0, dataIndex = 0; row < iterateN; row++) {
      this.matrix[row][column] = 6 * this.dataSet[dataIndex].x;
      this.matrix[row][column + 1] = 2;

      column += 4 * (this.n - 1);
      dataIndex = this.dataSet.length - 1;
    }
  }
  initGaussian() {
    this.gaussian = new Gaussian_Elimination(this.matrix);
  }
  updateGaussian() {
    this.gaussian.matrix = this.matrix;
    this.gaussian.operate_entire_process();
    this.reducedRowEchelonForm = this.gaussian.matrix;
  }
  getCoefficients() {
    this.coefficents = [];
    this.reducedRowEchelonForm.forEach((item, index) => {
      this.coefficents.push(item[this.reducedRowEchelonForm[index].length - 1]);
    });
  }
  createFunctionSet() {
    if (this.n < 2) {
      return;
    }
    this.functionSet = [];
    for (let i = 0; i < this.n; i++)
      this.functionSet.push({
        a: this.coefficents[0 + i * 4],
        b: this.coefficents[1 + i * 4],
        c: this.coefficents[2 + i * 4],
        d: this.coefficents[3 + i * 4],
        xGap: this.dataSet[1 + i].x - this.dataSet[0 + i].x,
        x: this.dataSet[0 + i].x,
      });
    // console.log(this.n, this.functionSet);
  }
  drawSpline(ctx) {
    if (this.n < 2) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(this.dataSet[0].x, this.dataSet[0].y);
    this.functionSet.forEach((f) => {
      for (let x = f.x; x < f.x + f.xGap; x += 0.1) {
        const y = f.a * x ** 3 + f.b * x ** 2 + f.c * x + f.d;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.closePath();
  }
}

export class Gaussian_Elimination {
  constructor(matrix) {
    this.matrix = matrix;
  }
  test() {
    var lead = 0;
    for (var r = 0; r < this.matrix.length; r++) {
      if (this.matrix[0].length <= lead) {
        return;
      }
      var i = r;
      while (this.matrix[i][lead] == 0) {
        i++;
        if (this.matrix.length == i) {
          i = r;
          lead++;
          if (this.matrix[0].length == lead) {
            return;
          }
        }
      }

      var tmp = this.matrix[i];
      this.matrix[i] = this.matrix[r];
      this.matrix[r] = tmp;

      var val = this.matrix[r][lead];
      for (var j = 0; j < this.matrix[0].length; j++) {
        this.matrix[r][j] = math.divide(this.matrix[r][j], val);
      }

      for (var i = r; i < this.matrix.length; i++) {
        if (i == r) continue;
        val = math.bignumber(this.matrix[i][lead]);
        for (var j = 0; j < this.matrix[0].length; j++) {
          this.matrix[i][j] -= val * math.bignumber(this.matrix[r][j]);
        }
      }
      lead++;
    }
  }

  partial_pivoting(row, pivotColumn, changePivotColumn) {
    let pivotElementRow = row;
    //find largest absoulte element in each column below the pivot position
    for (let i = row; i < this.matrix.length - 1; i++) {
      if (
        math.abs(this.matrix[pivotElementRow][pivotColumn]) <
        math.abs(this.matrix[i + 1][pivotColumn])
      ) {
        pivotElementRow = i + 1;
      }
      if (
        i === this.matrix.length - 2 &&
        this.matrix[pivotElementRow][pivotColumn] === 0
      ) {
        i = row;
        pivotColumn++;
        if (pivotColumn === this.matrix[row].length - 1) {
          return;
        } else {
          changePivotColumn(pivotColumn);
        }
      }
    }

    //interchange rows
    const prevRow = this.matrix[row];
    const interchangeRow = this.matrix[pivotElementRow];

    this.matrix[row] = interchangeRow;
    this.matrix[pivotElementRow] = prevRow;
  }
  convert_pivot_to_one(row, pivotColumn) {
    const pivotValue = this.matrix[row][pivotColumn];
    for (let i = 0; i < this.matrix[row].length; i++) {
      this.matrix[row][i] /= pivotValue;
    }
  }
  forward_elimination(row, pivotColumn) {
    for (let i = row + 1; i < this.matrix.length; i++) {
      const multiplier = this.matrix[i][pivotColumn];

      for (let j = 0; j < this.matrix[i].length; j++) {
        this.matrix[i][j] -= multiplier * this.matrix[row][j];
      }
    }
  }
  backward_elimination(row, pivotColumn) {
    if (row === 0) {
      return;
    }

    for (let i = row - 1; i >= 0; i--) {
      const multiplier = this.matrix[i][pivotColumn];

      for (let j = 0; j < this.matrix[i].length; j++) {
        this.matrix[i][j] -= multiplier * this.matrix[row][j];
      }
    }
  }
  //coefficent 받아오고 그걸로 function 만들기 그리고 잇기 ㅇㅇㅇ.... bignumber함수 고려

  operate_entire_process() {
    if (this.matrix.length < 2) {
      return;
    }

    for (
      let row = 0, pivotColumn = 0;
      row < this.matrix.length && pivotColumn <= this.matrix[0].length - 1;
      row++, pivotColumn++
    ) {
      const changePivotColumn = (p) => {
        pivotColumn = p;
      };

      this.partial_pivoting(row, pivotColumn, changePivotColumn);
      if (this.matrix[row][pivotColumn] !== 0) {
        this.convert_pivot_to_one(row, pivotColumn);
        this.forward_elimination(row, pivotColumn);
        this.backward_elimination(row, pivotColumn);
      }
    }

    // this.test();
  }
}
