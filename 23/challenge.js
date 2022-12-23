import {readDataAsArray} from '../readData.js';

const startTime = Date.now();

const data = readDataAsArray('23/data.txt');
const example = readDataAsArray('23/example.txt');
const example2 = readDataAsArray('23/example2.txt');

// const input = example;
// const input = example2;
const input = data;

const map = input.map(row => row.split(''));

let elfCount = 0;
map.forEach(line => {
    line.forEach(pos => {
        if (pos === '#') {
            elfCount += 1;
        }
    })
})

console.log(elfCount);

const directions = ['N', 'S', 'W', 'E']

const printMap = () => {
    console.log('  ')
    map.forEach(row => console.log(row.join('')))
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - -')
}

const getSurroundings = (x,y) => {
    return {
        x: x,
        y: y,
        NW: map[y-1][x-1],
        N: map[y-1][x],
        NE: map[y-1][x+1],
        W: map[y][x-1],
        E: map[y][x+1],
        SW: map[y+1][x-1],
        S: map[y+1][x],
        SE: map[y+1][x+1],
    }
}

const canMove = (direction, surroundings) => {
    switch (direction) {
        case 'N':
            if ([surroundings.NW, surroundings.N, surroundings.NE].every(position => position === '.')) {
                return { x: surroundings.x, y: surroundings.y - 1 };
            } else {
                return false;
            }
        case 'S':
            if ([surroundings.SW, surroundings.S, surroundings.SE].every(position => position === '.')) {
                return { x: surroundings.x, y: surroundings.y + 1 };
            } else {
                return false;
            }
        case 'E':
            if ([surroundings.NE, surroundings.E, surroundings.SE].every(position => position === '.')) {
                return { x: surroundings.x + 1, y: surroundings.y };
            } else {
                return false;
            }
        case 'W':
            if ([surroundings.NW, surroundings.W, surroundings.SW].every(position => position === '.')) {
                return { x: surroundings.x - 1, y: surroundings.y };
            } else {
                return false;
            }
    }
}

const keyToCoord = (coordKey) => coordKey.split(',').map(num => parseInt(num, 10));

const mapDimensions = {
    height: map.length,
    width: map[0].length,
    expandNorth: true,
    expandEast: true,
    expandSouth: true,
    expandWest: true,
}

let anyoneMoves = true;

const takeTurn = (turnNumber) => {
    anyoneMoves = false;

    if (mapDimensions.expandNorth) {
        map.unshift(new Array(mapDimensions.width).fill('.'));
        mapDimensions.height += 1;
        mapDimensions.expandNorth = false;
    }
    if (mapDimensions.expandSouth) {
        map.push(new Array(mapDimensions.width).fill('.'));
        mapDimensions.height += 1;
        mapDimensions.expandSouth = false;
    }
    if (mapDimensions.expandEast) {
        map.forEach(row => row.push('.'));
        mapDimensions.width += 1;
        mapDimensions.expandEast = false;
    }
    if (mapDimensions.expandWest) {
        map.forEach(row => row.unshift('.'));
        mapDimensions.width += 1;
        mapDimensions.expandWest = false;
    }

    const moves = {};

    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const position = row[x];
            if (position === '.') {
                continue;
            }
            const surroundings = getSurroundings(x, y);
            if (Object.values(surroundings).every(val => val !== '#')) {
                continue;
            }
            const directionStartIndex = turnNumber % 4;
            let nextPos;
            const originKey = `${x},${y}`;
            for (let i = directionStartIndex; i < directionStartIndex + 4; i++) {
                const direction = directions[i % 4];
                if (nextPos = canMove(direction, surroundings)) {
                    anyoneMoves = true;
                    const destinationKey = `${nextPos.x},${nextPos.y}`;
                    if (moves.hasOwnProperty(destinationKey)) {
                        moves[destinationKey].push(originKey);
                    } else {
                        moves[destinationKey] = [originKey];
                    }
                    break;
                }
            }
        }
    }

    for (const [destination, origins] of Object.entries(moves)) {
        if (origins.length > 1) {
            continue;
        }
        const [destX, destY] = keyToCoord(destination);
        const [originX, originY] = keyToCoord(origins[0]);
        map[destY][destX] = '#';
        map[originY][originX] = '.';
        if (destY === 0) {
            mapDimensions.expandNorth = true;
        }
        if (destY === mapDimensions.height - 1) {
            mapDimensions.expandSouth = true;
        }
        if (destX === 0) {
            mapDimensions.expandWest = true;
        }
        if (destX === mapDimensions.width - 1) {
            mapDimensions.expandEast = true;
        }
    }
}

const trimMap = () => {
    while (map[0].every(pos => pos === '.')) {
        map.shift();
        mapDimensions.height -= 1;
    }
    while (map[map.length-1].every(pos => pos === '.')) {
        map.pop();
        mapDimensions.height -= 1;
    }
    let leftTrimCount = Infinity;
    let rightTrimCount = Infinity;
    map.forEach(line => {
        for (let i = 0; i < leftTrimCount; i++) {
            const space = line[i];
            if (space === '#') {
                leftTrimCount = i;
            }
        }
        for (let i = 0; i < rightTrimCount; i++) {
            const space = line[line.length - i - 1];
            if (space === '#') {
                rightTrimCount = i;
            }
        }
    })
    map.forEach(line => {
        line.splice(0, leftTrimCount);
        line.splice(line.length - rightTrimCount);
    })
    mapDimensions.width -= (leftTrimCount + rightTrimCount);
}

// // part 1

// printMap()

// for (let i = 0; i < 10; i++) {
//     takeTurn(i);
//     // printMap();
// }

// trimMap();
// printMap();

// const area = mapDimensions.width * mapDimensions.height;
// const freeSpaces = area - elfCount;
// console.log(freeSpaces);
// console.log(`Part 1 duration: ${Date.now() - startTime}ms`)

let moveCount = 0
while (anyoneMoves) {
    if (moveCount % 1000 === 0) {
        console.log(`${moveCount} moves complete - duration: ${Date.now() - startTime}ms`);
    }
    takeTurn(moveCount);
    moveCount += 1;
}

console.log(moveCount);

console.log(`Duration: ${Date.now() - startTime}ms`)