'use strict';

const canvas1 = document.getElementById('c1');
const canvas2 = document.getElementById('c2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const term = document.getElementById('term');
ctx1.font = '20px Georgia';
ctx2.font = '20px Georgia';

const A = [
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0], 
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], 
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1], 
  [0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1], 
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0], 
  [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1], 
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0], 
  [1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
]

const
  width = 1000,
  height = 1000,
  n = 12,
  id = 9320,
  n3 = id.toString().split('')[2],
  n4 = id.toString().split('')[3],
  multiplier = 0.8,
  radius = 40,
  kEvasion = 1.4,
  kLoop = 1.1,
  radiusLoop = 20,
  dAngle = Math.PI / 18;


const notDirectedEdges = new Map();
const directedEdges = new Map();
const loops = new Map();
const Vertices = new Map();
const arrowHeads = [];

const centerCalculate = (width, height) => {
  const x = width / 2;
  const y = height / 2;
  return { x, y };
};

const center = centerCalculate(width, height);

const coordinateVertex = (n, center) => {
  const xCenter = center.x;
  const yCenter = center.y;
  const dAngle = 2 * Math.PI / n;
  const radius = multiplier * Math.min(width, height) / 2;
  const vertexCoords = new Map();
  const angle = -1 * dAngle;
  //console.log(radius);
  for (let i = 1; i <= n; i++) {
    const dx = radius * Math.sin(angle + dAngle * i);
    const dy = radius * Math.cos(angle + dAngle * i);
    const x = xCenter + Math.floor(dx);
    const y = yCenter - Math.floor(dy);

    console.log({ i, dx, dy });
    console.log({ x, y });

    vertexCoords.set(i, { i, x, y });
  }
  return vertexCoords;
};


const vertexCoords = coordinateVertex(n, center);
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
    for (let j = 0; j < n; j++)
      if (A[i][j] === 1 || B[i][j] === 1) {
        C[i][j] = 1;
      } else {
        C[i][j] = A[i][j] + B[i][j];
      }
  }
  return C;
}

const symmetricA = SumMatrix(A, AT);
//console.log(A);
//console.log(AT);
//console.log(symmetricA);


class VERTEX {
  constructor(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.i = obj.i;
  }

  draw(ctx) {
    //console.log(this.i, this.x, this.y);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
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
      //const i = indexOf(item);
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

    console.log(`Power of Vertex #${this.i} = ${this.degree}`);
  }

  calculateHalfPowers() {
    this.degreeIn = 0;
    this.degreeOut = 0;

    const arr = A[this.i - 1];
    for (let j = 0; j < arr.length; j++) {
      const item = arr[j];
      //const i = indexOf(item);
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

    console.log(`Power(In) of Vertex #${this.i} = ${this.degreeIn}`);
    term.innerHTML += `Degree(In) of Vertex #${this.i} = ${this.degreeIn}; `;

    term.innerHTML += `Degree(Out) of Vertex #${this.i} = ${this.degreeOut}; `;
    term.innerHTML += '<br>';
    console.log(`Power(Out) of Vertex #${this.i} = ${this.degreeOut}`);
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

class ArrowHead {
  constructor(vertexStart, vertexEnd, start, end) {
    this.start = start;
    this.end = end;
    this.startX = start.x;
    this.startY = start.y;
    this.endX = end.x;
    this.endY = end.y;
    //this.startI = vertexStart.i
    //this.endI = vertexEnd.i;
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
    const x1 = this.startX + radius * Math.cos(angle);
    const y1 = this.startY + radius * Math.sin(angle);
    const x2 = this.endX - radius * Math.cos(angle);
    const y2 = this.endY - radius * Math.sin(angle);

    //console.log(dx, dy, angle, x1, y1, x2, y2);

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
    const x1 = this.startX + radius * Math.cos(angle);
    const y1 = this.startY + radius * Math.sin(angle);
    const x2 = this.endX - radius * Math.cos(angle);
    const y2 = this.endY - radius * Math.sin(angle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };

    //console.log(dx, dy, angle, x1, y1, x2, y2);

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
    const x1 = this.startX + radius * Math.cos(angle + this.dAngle);
    const y1 = this.startY + radius * Math.sin(angle + this.dAngle);
    const x2 = this.endX - radius * Math.cos(angle - this.dAngle);
    const y2 = this.endY - radius * Math.sin(angle - this.dAngle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };

    //console.log(dx, dy, angle, x1, y1, x2, y2);

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
      //console.log(startPoint,endPoint)
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
  //console.log(A, B, C);
  for (const array of Vertices) {
    const vertex = array[1];
    const i = vertex.i;
    if (vertex === edgeStart || vertex === edgeEnd) continue;
    //console.log(vertex);
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
  //const evasionPointX = (Math.pow(B,2) * vertex.x - B * A * vertex.y - A * C) / (Math.pow(A,2) + (Math.pow(B,2)));
  //const evasionPointY = (-1 * A * evasionPointX - C) / (B);
  //
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
  //const test = new VERTEX ({x:evasionPointX, y:evasionPointY, i:'test'}).draw();
  console.log({ evasionEdgeStart, evasionEdgeEnd });

  if (edges.has({ edgeStartI, edgeEndI })) {
    edges.get({ edgeStartI, edgeEndI }).push(evasionEdgeStart, evasionEdgeEnd);
  } else {
    edges.set({ edgeStartI, edgeEndI }, [evasionEdgeStart, evasionEdgeEnd]);
  }
  //console.log({evasionPointX,evasionPointY});

}


console.log(A);

for (const obj of vertexCoords) {
  const vertex = new VERTEX(obj[1]);
  Vertices.set(vertex.i, vertex);
  console.log(obj);
  console.log(vertex);
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
          //console.log(vi, vj);
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
          //console.log(vi, vj);
          const edge = new EDGE(vi, vj);
          notDirectedEdges.set({ i, j }, edge);
        }
      }
    }
  }
};

createDirectedGraphElements();

createGraphElements();


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

console.log(loops);

for (const loop of loops) {
  const obj = loop[1];
  //console.log({i,obj})
  obj.draw(ctx1);
  obj.draw(ctx2);
}

console.log(arrowHeads);

for (const arrowHead of arrowHeads) {
  arrowHead.draw(ctx2);
}

console.log(Vertices);

for (const vertex of Vertices) {
  const obj = vertex[1];
  obj.draw(ctx1);
  obj.draw(ctx2);
}

for (const vertex of Vertices) {
  const obj = vertex[1];
  obj.calculateHalfPowers();
}

for (const vertex of Vertices) {
  const obj = vertex[1];
  obj.calculatePowerNotDirected();
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

if (isolatedVerteces.length > 0) {
  const result = isolatedVerteces.reduce(value => value + ' ');
  term.innerHTML += `Isolated: ${result}`;
  term.innerHTML += '<br>';
} else {
  term.innerHTML += 'Isolated: ';
  term.innerHTML += '<br>';
}

if (hangingVerteces.length > 0) {
  const result = hangingVerteces.reduce(value => value + ' ');
  term.innerHTML += `Hanging: ${result}`;
  term.innerHTML += '<br>';
} else {
  term.innerHTML += 'Hanging: ';
  term.innerHTML += '<br>';

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

if (checkForHomogeneous(Vertices)) {
  term.innerHTML += `Graph is Homogeneous: ${checkForHomogeneous(Vertices)}`;
  term.innerHTML += '<br>';
} else {
  term.innerHTML += 'Graph is not Homogeneous';
  term.innerHTML += '<br>';
}

const but = document.getElementById('but');

function onClick() {
  if (canvas1.style.display === 'block') {
    canvas1.style.display = 'none';
    canvas2.style.display = 'block';
  } else {
    canvas1.style.display = 'block';
    canvas2.style.display = 'none';
  }
}

