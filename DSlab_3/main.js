'use strict';

const canvas1 = document.getElementById('c1');
const canvas2 = document.getElementById('c2');
const canvas3 = document.getElementById('c3');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
const term = document.getElementById('term');
const ways = document.getElementById('ways');
const blockComponents = document.getElementById('components');
const blockMatrixA = document.getElementById('matrixA')
const blockMatrixA2 = document.getElementById('matrixA2')
const blockMatrixA3 = document.getElementById('matrixA3')
const blockMatrixStronglyConnected = document.getElementById('matrixStronglyConnected')
const blockMatrixReachability = document.getElementById('matrixReachability')
const blockMatrixComponents = document.getElementById('matrixComponents')
ctx1.font = '20px Georgia';
ctx2.font = '20px Georgia';
ctx3.font = '20px Georgia';

const A = [
  [0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0], 
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1], 
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1], 
  [0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1], 
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0], 
  [1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1], 
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0], 
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
];


const
  width = 1000,
  height = 1000,
  n = A.length,
  id = 9320,
  n3 = id.toString().split('')[2],
  n4 = id.toString().split('')[3],
  multiplier = 0.8,
  condensationMultiplier = 0.7,
  radius = 40,
  kEvasion = 1.4,
  kLoop = 1.1,
  radiusLoop = 20,
  dAngle = Math.PI / 18;


const notDirectedEdges = new Map();
const directedEdges = new Map();
const condensationEdges = new Map();
const loops = new Map();
const Vertices = new Map();
const condensationVertices = new Map();
const arrowHeads = [];
const condensationArrowHeads = [];
let components;

const condensationRadiusVertex = (n) => {
  let R = n * 7.5 + 40;
  return R;
};

const centerCalculate = (width, height) => {
  const x = width / 2;
  const y = height / 2;
  return { x, y };
};


const center = centerCalculate(width, height);

const coordinateVertex = (n, center, multiplier, indexes) => {
  const xCenter = center.x;
  const yCenter = center.y;
  const dAngle = 2 * Math.PI / n;
  const radius = multiplier * Math.min(width, height) / 2;
  const vertexCoords = new Map();
  const angle = -1 * dAngle;
  if (indexes) {
    for (let i = 1; i <= indexes.length; i++) {
      const dx = radius * Math.sin(angle + dAngle * i);
      const dy = radius * Math.cos(angle + dAngle * i);
      const x = xCenter + Math.floor(dx);
      const y = yCenter - Math.floor(dy);
  
      console.log({ i, dx, dy });
      console.log({ x, y });
  
      vertexCoords.set(i, { i: indexes[i - 1], x, y });
    }
  } else {
    for (let i = 1; i <= n; i++) {
      const dx = radius * Math.sin(angle + dAngle * i);
      const dy = radius * Math.cos(angle + dAngle * i);
      const x = xCenter + Math.floor(dx);
      const y = yCenter - Math.floor(dy);
  
      console.log({ i, dx, dy });
      console.log({ x, y });
  
      vertexCoords.set(i, { i, x, y });
    }
  }
  console.log(vertexCoords)
  return vertexCoords;
};


const vertexCoords = coordinateVertex(n, center, multiplier);
console.log(vertexCoords);

function TransMatrix(A) {
  const m = A.length, n = A[0].length, AT = [];
  for (let i = 0; i < n; i++) {
    AT[i] = [];
    for (let j = 0; j < m; j++) AT[i][j] = A[j][i];
  }
  return AT;
}

const AT = TransMatrix(A);

function SumMatrix(A, B) {
  const
    m = A.length,
    n = A[0].length,
    C = [];
  for (let i = 0; i < m; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C;
}

function booleanTransformation(A) {
  const
    n = A.length,
    C = [];
  for (let i = 0; i < n; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++)
      if (A[i][j] === 0) {
        C[i][j] = 0;
      } else {
        C[i][j] = 1;
      }
  }
  return C;
}

function diagonalZero (A) {
  const
    n = A.length,
    C = [];
  for (let i = 0; i < n; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++)
      if (i === j) {
        C[i][j] = 0;
      } else {
        C[i][j] = A[i][j];
      }
  }
  return C;
}


const symmetricA = booleanTransformation(SumMatrix(A, AT));
console.log(symmetricA);

function MultiplyMatrix(A, B) {
  let rowsA = A.length,
    colsA = A[0].length,
    rowsB = B.length,
    colsB = B[0].length,
    C = [];
  
  if (colsA != rowsB) return false;
  for (let i = 0; i < rowsA; i++) C[i] = [];
  for (let k = 0; k < colsB; k++) {
    for (let i = 0; i < rowsA; i++){
      let t = 0;
      for (let j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
      C[i][k] = t;
    }
   }
  return C;
}

function MatrixPow(A, n) { 
  if (n == 1) return A;
  else return MultiplyMatrix( A, MatrixPow(A, n-1) );
};

function transitiveClosure(A) {
  let result = A;
  const degreesRelation = new Map();
  for (let n = 2; n < A.length; n++) {
    degreesRelation.set(n, MatrixPow(A, n))
  }
  for (const i of degreesRelation) {
    const temp = SumMatrix(result, i[1]);
    result = temp;
  }
  return result
}


function zeroMatrix(n) {
  const matrix = [];
  for(let i = 0; i < n; i++) {
    matrix[i] = [];
    for(let j = 0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function diagonalMatrix(n) {
  const matrix = zeroMatrix(n)
  for(let i = 0; i < matrix.length; i++) {
    matrix[i][i] = 1;
  }
  return matrix
}

function reachability(A) {
  const transitiveClosureMatrix = transitiveClosure(A);
  console.log(transitiveClosureMatrix)
  const reachabilityMatrix = SumMatrix(transitiveClosureMatrix,diagonalMatrix(A.length))
  const result = booleanTransformation(reachabilityMatrix);
  return result
}

function stronglyConnected(A) {
  const reachabilityMatrix = reachability(A);
  const transpReachabilityMatrix = TransMatrix(reachabilityMatrix);
  console.log(transpReachabilityMatrix)
  const matrixOfStrongConnectivity = elementalMultiplyMatrices(reachabilityMatrix,transpReachabilityMatrix);
  return matrixOfStrongConnectivity
}

function elementalMultiplyMatrices(A, B) {
  const
    m = A.length,
    n = A[0].length,
    C = [];
  for (let i = 0; i < m; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] * B[i][j];
    }
  }
  return C;
}

function checkEquivalenceArrays(A, B) {
  let equivalence = true;
  for(let i = 0; i < A.length; i++) {
    if(A[i] !== B[i]) {
      equivalence = false
      break
    }
  }
  return equivalence
}

function searchEquivalenceArrays(matrix) {
  const rows = new Map();
  for (let i = 0; i < matrix.length; i++) {
    rows.set(i + 1, matrix[i])
  }
  console.log(rows);
  const components = [];
  const visitedRows = new Map()
  
  for (let elementIndex = 1; elementIndex <= rows.size; elementIndex++) {
    if (!visitedRows.has(elementIndex)) {
      const component = new Map()
      const element = rows.get(elementIndex);
      console.log(elementIndex)
      for (let i = elementIndex; i <= rows.size; i++) {
        if (checkEquivalenceArrays(element, rows.get(i))) {
          if (!component.has(i)) {
            component.set(i,i)  
            visitedRows.set(i,i)      
          }
        }
      }
      console.log(component)
      components.push(component)
    }
  }
  return components
}

console.log(searchEquivalenceArrays(booleanTransformation(stronglyConnected(A))))

class VERTEX {
  constructor(obj, radius) {
    this.x = obj.x;
    this.y = obj.y;
    this.i = obj.i;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.stroke();
    // Fill text
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.i, this.x, this.y);
  }

  vertexPower(directedGraph) {
    if (directedGraph) {
      this;
    } else if (!directedGraph) {
      this;
    }
  }

  calculatePowerNotDirected() {
    this.degree = 0;
    const arr = symmetricA[this.i - 1];
    for (let j = 0; j < arr.length; j++) {
      const item = arr[j];
      if (item === 1) {
        if (j === this.i - 1) {
          this.degree += 2;
        } else {
          this.degree += 1;
        }
      }
    }

    term.innerHTML += `Degree of Vertex #${this.i} = ${this.degree}; `;
    term.innerHTML += '<br>';
  }

  calculateHalfPowers() {
    this.degreeIn = 0;
    this.degreeOut = 0;

    const arr = A[this.i - 1];
    for (let j = 0; j < arr.length; j++) {
      const item = arr[j];
      if (item === 1) {
        this.degreeOut += 1;
      }
    }

    for (let i = 0; i < A.length; i++) {
      const item = A[i][this.i - 1];
      if (item === 1) {
        this.degreeIn += 1;
      }
    }

    term.innerHTML += `Degree(In) of Vertex #${this.i} = ${this.degreeIn}; `;

    term.innerHTML += `Degree(Out) of Vertex #${this.i} = ${this.degreeOut}; `;
    term.innerHTML += '<br>';
  }

  checkForIsolate() {
    if (this.degree === 0) {
      return true;
    }
  }

  checkForHanging() {
    if (this.degree === 1) {
      return true;
    }
  }
}

class CondensationVertex {
  constructor(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.indexes = obj.i;
    this.radius = condensationRadiusVertex(this.indexes.size)
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.stroke();
    // Fill text
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let text = ''
    let counter = 0;
    for (const item of this.indexes.values()) {
      counter += 1;
      if (counter === this.indexes.size) {
        text += `${item}`
      } else {
        text += `${item}, `
      }
    }
    ctx.fillText(text, this.x, this.y);
  } 
}

class ArrowHead {
  constructor(vertexStart, vertexEnd, start, end) {
    this.start = start;
    this.end = end;
    this.startX = start.x;
    this.startY = start.y;
    this.endX = end.x;
    this.endY = end.y;
  }

  draw(ctx) {
    const lateralSide = 15;
    const arrowAngle = Math.PI / 8;
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x0 = this.endX;
    const y0 = this.endY;
    const x1 = x0 - lateralSide * Math.cos(angle + arrowAngle);
    const y1 = y0 - lateralSide * Math.sin(angle + arrowAngle);
    const x2 = x0 - lateralSide * Math.cos(angle - arrowAngle);
    const y2 = y0 - lateralSide * Math.sin(angle - arrowAngle);


    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
    ctx.stroke();
  }
}

class EDGE {
  constructor(objStart, objEnd) {
    this.vertexStart = objStart;
    this.vertexEnd = objEnd;
    this.startX = objStart.x;
    this.startY = objStart.y;
    this.endX = objEnd.x;
    this.endY = objEnd.y;
    this.startI = objStart.i;
    this.endI = objEnd.i;

    // AX+By+C=0
    this.A = this.endY - this.startY;
    this.B = this.startX - this.endX;
    this.C = this.endX * this.startY - this.startX * this.endY;
  }

  draw(ctx) {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx) + Math.PI;
    const x1 = this.startX + this.vertexStart.radius * Math.cos(angle);
    const y1 = this.startY + this.vertexStart.radius * Math.sin(angle);
    const x2 = this.endX - this.vertexEnd.radius * Math.cos(angle);
    const y2 = this.endY - this.vertexEnd.radius * Math.sin(angle);

    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd, notDirectedEdges, false);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

class DirectedEdge extends EDGE {
  draw(ctx) {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x1 = this.startX + this.vertexStart.radius * Math.cos(angle);
    const y1 = this.startY + this.vertexStart.radius * Math.sin(angle);
    const x2 = this.endX - this.vertexEnd.radius * Math.cos(angle);
    const y2 = this.endY - this.vertexEnd.radius * Math.sin(angle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };

    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd, directedEdges, true);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
    }
  }
}

class DirectedEdgeCondensation extends DirectedEdge {
  draw(ctx) {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x1 = this.startX + this.vertexStart.radius * Math.cos(angle);
    const y1 = this.startY + this.vertexStart.radius * Math.sin(angle);
    const x2 = this.endX - this.vertexEnd.radius * Math.cos(angle);
    const y2 = this.endY - this.vertexEnd.radius * Math.sin(angle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    condensationArrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
  }
}

class ParallelDirectedEdge {
  constructor(objStart, objEnd, dAngle) {
    this.vertexStart = objStart;
    this.vertexEnd = objEnd;
    this.startX = objStart.x;
    this.startY = objStart.y;
    this.endX = objEnd.x;
    this.endY = objEnd.y;
    this.startI = objStart.i;
    this.endI = objEnd.i;
    this.dAngle = dAngle;
    this.A = this.endY - this.startY;
    this.B = this.startX - this.endX;
    this.C = this.endX * this.startY - this.startX * this.endY;
  }

  draw(ctx) {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x1 = this.startX + this.vertexStart.radius * Math.cos(angle + this.dAngle);
    const y1 = this.startY + this.vertexStart.radius * Math.sin(angle + this.dAngle);
    const x2 = this.endX - this.vertexEnd.radius * Math.cos(angle - this.dAngle);
    const y2 = this.endY - this.vertexEnd.radius * Math.sin(angle - this.dAngle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };


    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd, directedEdges, true);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
    }
  }
}

class EVASION_EDGE extends EDGE {
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    if (Vertices.has(this.vertexEnd.i)) {
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      const angle = Math.atan2(dy, dx);
      const x2 = this.endX - radius * Math.cos(angle);
      const y2 = this.endY - radius * Math.sin(angle);
      const startPoint = { x: this.startX, y: this.startY };
      const endPoint = { x: x2, y: y2 };
      console.log(this.directedGraph);
      if (this.directedGraph === true) {
        arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
      }
    }
  }
}

class LOOP {
  constructor(obj) {
    this.vertex = obj;
    this.x = obj.x;
    this.y = obj.y;
  }

  draw(ctx) {
    const dx = center.x - this.x;
    const dy = center.y - this.y;
    const angle = Math.atan2(dy, dx);
    const xLoop = this.x - radius * kLoop * Math.cos(angle);
    const yLoop = this.y - radius * kLoop * Math.sin(angle);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(xLoop, yLoop, radiusLoop, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function checkForTouch(A, B, C, edgeStart, edgeEnd, edges, directedGraph) {
  for (const array of Vertices) {
    const vertex = array[1];
    const i = vertex.i;
    if (vertex === edgeStart || vertex === edgeEnd) continue;
    const distance = Math.abs((A * vertex.x + B * vertex.y + C) / (Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2))));
    if (distance <= radius) {
      console.log('true');
      console.log(A, B, C, edgeStart, edgeEnd);
      console.log({ distance, i });
      evasionPoint(A, B, C, edgeStart, edgeEnd, vertex, edges, directedGraph);
      return true;
    }
  }
  return false;
}

function evasionPoint(A, B, C, edgeStart, edgeEnd, vertex, edges, directedGraph) {
  const edgeStartI = edgeStart.i;
  const edgeEndI = edgeEnd.i;
  const normalVectorLength = Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
  const directionCosX = A / normalVectorLength;
  const directionCosY = B / normalVectorLength;
  console.log(vertex.x, vertex.y);
  console.log({ directionCosX, directionCosY });
  const evasionPointX = vertex.x + (directionCosX * radius * kEvasion);
  const evasionPointY = vertex.y + (directionCosY * radius * kEvasion);
  const evasionPointObj = { x: evasionPointX, y: evasionPointY };
  console.log({ evasionPointX, evasionPointY });
  const evasionEdgeStart = new EVASION_EDGE(edgeStart, evasionPointObj);
  const evasionEdgeEnd = new EVASION_EDGE(evasionPointObj, edgeEnd);
  evasionEdgeEnd.directedGraph = directedGraph;
  evasionEdgeStart.directedGraph = directedGraph;
  console.log({ evasionEdgeStart, evasionEdgeEnd });

  if (edges.has({ edgeStartI, edgeEndI })) {
    edges.get({ edgeStartI, edgeEndI }).push(evasionEdgeStart, evasionEdgeEnd);
  } else {
    edges.set({ edgeStartI, edgeEndI }, [evasionEdgeStart, evasionEdgeEnd]);
  }
}


console.log(A);

for (const obj of vertexCoords) {
  const vertex = new VERTEX(obj[1],radius);
  Vertices.set(vertex.i, vertex);
}


const createDirectedGraphElements = () => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j) {
          const v = Vertices.get(i + 1);
          const loop = new LOOP(v);
          loops.set(v, loop);
        } else if (A[i][j] === A[j][i]) {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          const parallelDirectedEdge = new ParallelDirectedEdge(vi, vj, dAngle);
          directedEdges.set({ i, j }, parallelDirectedEdge);
        } else {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          const directedEdge = new DirectedEdge(vi, vj);
          directedEdges.set({ i, j }, directedEdge);
        }
      }
    }
  }
};

const createGraphElements = () => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      if (symmetricA[i][j] === 1) {
        if (i === j) {
          const v = Vertices.get(i + 1);
          const loop = new LOOP(v);
          loops.set(v, loop);
        } else {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          const edge = new EDGE(vi, vj);
          notDirectedEdges.set({ i, j }, edge);
        }
      }
    }
  }
};

const createCondensationGraphElements = () => {
  const matrix = stronglyConnected(A);
  components = searchEquivalenceArrays(matrix);
  const matrixComponents = zeroMatrix(components.length)
  const ADiagonalZero = diagonalZero(A);
  console.log(matrixComponents)
  console.log(components)
  const vertexObjs = coordinateVertex(components.length, center, condensationMultiplier, components)

  for (let obj of vertexObjs) {
    const vertexKeys = obj[1]
    console.log(obj)
    console.log(vertexKeys)
    const vertex = new CondensationVertex(vertexKeys, radius);
    condensationVertices.set(obj[0], vertex);
  }

  for (let component of components) {
    for (let vertex of component.values()) {
      console.log(component)
      console.log(component.values().next().value)
      
      let componentRelation = ADiagonalZero[vertex - 1]
      const itemsComponent = [];
      for (let item of component.keys()) {
        itemsComponent.push(item)
      }
      console.log(itemsComponent)
      console.log(componentRelation)
      console.log(components.indexOf(component))
      for(let i = 0; i < componentRelation.length; i++) {
        if (componentRelation[i] === 1) {
          let flag = itemsComponent.includes(i + 1)
          console.log('flag', flag)
          if (!itemsComponent.includes(i + 1)) {
            const k = components.indexOf(component);
            let j = null;
            for (let component of components) {
              if (component.has(i + 1)) {
                j = components.indexOf(component);
              }
            }
            console.log({k,j})
            matrixComponents[k][j] = 1;
          }
        }
      }
      console.log(matrixComponents)
    }
  }

  for(let i = 0; i < matrixComponents.length; i++) {
    for (let j = 0; j < matrixComponents.length; j++) {
      if (matrixComponents[i][j] === 1) {
        const start = condensationVertices.get(i + 1)
        const end = condensationVertices.get(j + 1)
        const edge = new DirectedEdgeCondensation(start, end)
        condensationEdges.set({start, end}, edge)
      }     
    }
  }

  blockMatrixComponents.innerHTML += 'The condensation graph matrix:<br>'
  printMatrix(matrixComponents, blockMatrixComponents)
};

createDirectedGraphElements();

createGraphElements();

createCondensationGraphElements();

console.log(directedEdges);

for (const item of directedEdges) {
  if (item[1] instanceof Array) {
    for (const i of item[1]) i.draw(ctx2);
  } else item[1].draw(ctx2);
}

for (const item of notDirectedEdges) {
  if (item[1] instanceof Array) {
    for (const i of item[1]) i.draw(ctx1);
  } else item[1].draw(ctx1);
}

console.log(condensationEdges)

for (const item of condensationEdges) {
  item[1].draw(ctx3)
}

console.log(loops);

for (const loop of loops) {
  const obj = loop[1];
  obj.draw(ctx1);
  obj.draw(ctx2);
}

console.log(arrowHeads);

for (const arrowHead of arrowHeads) {
  arrowHead.draw(ctx2);
}

for (const condensArrowHead of condensationArrowHeads) {
  condensArrowHead.draw(ctx3);
}

console.log(Vertices);

for (const vertex of Vertices) {
  const obj = vertex[1];
  obj.draw(ctx1);
  obj.draw(ctx2);
}

console.log(condensationVertices)
for (const vertex of condensationVertices) {
  const obj = vertex[1];
  obj.draw(ctx3);
}

for (const vertex of Vertices) {
  const obj = vertex[1];
  obj.calculateHalfPowers();
}

const calculatePowerNotDirected = () => {
  for (const vertex of Vertices) {
    const obj = vertex[1];
    obj.calculatePowerNotDirected();
  }  
}

const isolatedVerteces = [];
const hangingVerteces = [];

for (const vertex of Vertices) {
  const obj = vertex[1];
  if (obj.checkForIsolate()) {
    isolatedVerteces.push(obj.i);
  }
  if (obj.checkForHanging()) {
    hangingVerteces.push(obj.i);
  }
}

const checkIsolatedVerteces = () => {
  if (isolatedVerteces.length > 0) {
    const result = isolatedVerteces.reduce(value => value + ' ');
    term.innerHTML += `Isolated: ${result}`;
    term.innerHTML += '<br>';
  } else {
    term.innerHTML += 'Isolated: ';
    term.innerHTML += '<br>';
  }  
}

const hangingVertecesShow = () => {
  if (hangingVerteces.length > 0) {
    const result = hangingVerteces.reduce(value => value + ' ');
    term.innerHTML += `Hanging: ${result}`;
    term.innerHTML += '<br>';
  } else {
    term.innerHTML += 'Hanging: ';
    term.innerHTML += '<br>';
  
  }  
}

const checkForHomogeneous = Vertices => {
  let start = 0;
  for (const vertex of Vertices) {
    const obj = vertex[1];
    if (obj.i === 1) {
      start = obj.degree;
    }
    if (obj.degree !== start) return false;
  }
  return start;
};

const homogeneous = () => {
  if (checkForHomogeneous(Vertices)) {
    term.innerHTML += `Graph is Homogeneous: ${checkForHomogeneous(Vertices)}`;
    term.innerHTML += '<br>';
  } else {
    term.innerHTML += 'Graph is not Homogeneous';
    term.innerHTML += '<br>';
  }  
}

const findForOne = (from, to, matrix , n) => {
  const result = new Array();
  let counter = 0;
  for (let i = 0;i < matrix.length;i++){
    for (let j = 0;j < matrix.length; j++){
      if (n === 2){
        if (i === j && matrix[i][to] === 1 && matrix[from][j] === 1)
          if (from !== i || to !== i)
            result.push(`${from + 1}-${i + 1}-${to + 1}`);
      }
      if (n === 3) {
        if (matrix[i][to] === 1 && matrix[from][j] === 1 && matrix[j][i] === 1 && !(from === i && to === j)){
          result.push(`${from + 1}-${j + 1}-${i + 1}-${to + 1}`);
        }
      }
    }
  }
  return result;
}

const findWays = (matrix, n) => {
  const result = new Array();
  const finderMatrix = MatrixPow(matrix, n), length = finderMatrix.length;
  for (let i = 0;i < length;i++){
    for (let j = 0;j < length;j++) {
      if (finderMatrix[i][j] !== 0){
        result.push(...findForOne(i, j,matrix, n));
      }
    }
  }
  return result;
}

const printWays = (ways, n, block) => {
  block.innerHTML += `<br>All paths of length ${n}:</br>`
  let counter = 0;
  for (let way of ways) {
    counter += 1;
    if (counter === ways.length) {
      block.innerHTML += `<span id = 'spanWays'>${way}.</span> `;
    } else {
      block.innerHTML += `<span id = 'spanWays'>${way},</span> `;
    }
  }
  block.innerHTML += `<br>`;
}

for (let n = 2; n <= 3; n++) {
  printWays(findWays(diagonalZero(A), n), n, ways)
  console.log(findWays(diagonalZero(A),n))
}

const printComponents = (components, block) => {
  block.innerHTML += `Components: `
  let counterComponents = 0;
  console.log(components)
  const componentsSize = components.length;
  for (let component of components) {
    console.log(component)
    counterComponents += 1;
    const valueComponent = component.values();
    let result = ''
    result +='{'
    let counter = 0;
    const componentSize = component.size;
    console.log(componentSize);
    for (let item of valueComponent) {
      counter += 1;
      console.log(counter)
      if (counter === componentSize) {
        result += `${item}}`
      } else {
        result += `${item}, `
      }
    }
    console.log({counterComponents,componentsSize})
    if (counterComponents === componentsSize) {
      block.innerHTML += `<span id = 'spanComponents'>${result}</span> `;
    } else {
      block.innerHTML += `<span id = 'spanComponents'>${result}, </span> `;
    }
  }
  block.innerHTML += `<br>`;
}

printComponents(components, blockComponents)

blockMatrixStronglyConnected.innerHTML += 'Matrix of strong connectivity:<br>'
printMatrix(stronglyConnected(A), blockMatrixStronglyConnected)

blockMatrixReachability.innerHTML += 'Reachability matrix:<br>'
printMatrix(reachability(A), blockMatrixReachability)

blockMatrixA.innerHTML += 'Matrix A:<br>'
printMatrix(A, blockMatrixA)

blockMatrixA2.innerHTML += 'Matrix A<sup>2</sup>:<br>'
printMatrix(MatrixPow(diagonalZero(A), 2), blockMatrixA2)

blockMatrixA3.innerHTML += 'Matrix A<sup>3</sup>:<br>'
printMatrix(MatrixPow(diagonalZero(A), 3), blockMatrixA3)


function printMatrix(matrix, block) {
  let table = document.createDocumentFragment();
  
  for (var i = 0; i < matrix.length; i++) {
      let tr = document.createElement('tr');

      for(var j = 0; j < matrix.length; j++) {
          let td = document.createElement('td');
          td.innerHTML += `${matrix[i][j]}`;
          td.style.width = '18px'

          tr.appendChild(td);
      }

      table.appendChild(tr);
  }

  block.appendChild(table);
}


const butDirNotDir = document.getElementById('butDirNotDir');
const butCondensationGraph = document.getElementById('butDirNotDir');

function onClickButDirNotDir() {
  if (canvas2.style.display === 'block') {
    canvas1.style.display = 'block';
    canvas2.style.display = 'none';
    canvas3.style.display = 'none';
  } else {
    canvas1.style.display = 'none';
    canvas2.style.display = 'block';
    canvas3.style.display = 'none';
  }
}

function onClickCondensationGraph() {
    canvas1.style.display = 'none';
    canvas2.style.display = 'none';
    canvas3.style.display = 'block';
}


console.log(reachability(A))
console.log(booleanTransformation(stronglyConnected(A)))

console.log(MatrixPow(diagonalZero(A),2))
console.log(MatrixPow(diagonalZero(A),3))
