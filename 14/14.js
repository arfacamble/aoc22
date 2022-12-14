import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('14/data.txt');
const example = readDataAsArray('14/example.txt');

const basicParse = (input) => input.map(line => line.split(' -> ').map(coordinate => {
    let [x, y] = coordinate.split(',').map(num => parseInt(num, 10));
    return {x: x, y: y};
}))

const input = basicParse(example);

const map = {};
let abyssBegin = 0;
let realMinX = Infinity;

const drawMap = (input) => {
    input.forEach(path => {
        for (let i = 0; i < path.length - 1; i++) {
            const start = path[i];
            const end = path[i+1];
            if (start.x === end.x) {
                if (!map.hasOwnProperty(start.x)) { map[start.x] = new Set() }
                let [ymin, ymax] = [start.y, end.y].sort();
                if (ymax > abyssBegin) { abyssBegin = ymax }
                if (start.x < realMinX) { realMinX = start.x }
                for (let y = ymin; y <= ymax; y++) {
                    map[start.x].add(y);                
                }
            } else {
                const y = start.y;
                let [xmin, xmax] = [start.x, end.x].sort();
                if (y > abyssBegin) { abyssBegin = y }
                if (xmin < realMinX) { realMinX = xmin }
                for (let x = xmin; x <= xmax; x++) {
                    if (!map.hasOwnProperty(x)) { map[x] = new Set() }
                    map[x].add(y);
                }
            }
        }
    })
}

drawMap(input);

const printMap = () => {
    const picture = [];
    for (const [x, yset] of Object.entries(map)) {
        for (const [y, _] of yset.entries()) {
            while (y >= picture.length) { picture.push([]) }
            const pictureLine = picture[y];
            while (x >= pictureLine.length) {pictureLine.push('.') }
            pictureLine[x] = '#';
        }
    }
    picture.forEach(line => console.log(line.slice(realMinX,).join('')));
}

printMap();

const coordinateIsFree = (x, y) => !(map.hasOwnProperty(x) && map[x].has(y));

let mapFull = false;
let grainsDropped = 0;

const dropGrain = () => {
    let pos = {x: 500, y:0};
    let canMove = true;
    while (canMove) {
        if (coordinateIsFree(pos.x, pos.y + 1)) {
            pos.y += 1;
        } else if (coordinateIsFree(pos.x - 1, pos.y + 1)) {
            pos.x -= 1;
            pos.y += 1;
        } else if (coordinateIsFree(pos.x + 1, pos.y + 1)) {
            pos.x += 1;
            pos.y += 1;
        } else {
            canMove = false;
            if (!map.hasOwnProperty(pos.x)) { map[pos.x] = new Set() }
            map[pos.x].add(pos.y);
            grainsDropped += 1;
        }
        if (pos.y >= abyssBegin) {
            canMove = 0;
            mapFull = true;
        }
    }
}

while (!mapFull) {
    dropGrain();
}

printMap();

console.log(grainsDropped);

// 923 too high