import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('18/data.txt');
const example = readDataAsArray('18/example.txt');

// const input = example;
const input = data;

const adjacentCoordinates = (coord) => {
    const [x,y,z] = coord;
    return [
        `${x},${y},${z-1}`,
        `${x},${y},${z+1}`,
        `${x},${y-1},${z}`,
        `${x},${y+1},${z}`,
        `${x-1},${y},${z}`,
        `${x+1},${y},${z}`,
    ]
}

const dropletCoords = new Set();
// let totalSAPart1 = 0;

const dropletBounds = {
    minX: Infinity,
    maxX: -1,
    minY: Infinity,
    maxY: -1,
    minZ: Infinity,
    maxZ: -1,
}

const adjustBounds = (coord) => {
    const [x,y,z] = coord;
    if (x > dropletBounds.maxX) { dropletBounds.maxX = x; }
    if (x < dropletBounds.minX) { dropletBounds.minX = x; }
    if (y > dropletBounds.maxY) { dropletBounds.maxY = y; }
    if (y < dropletBounds.minY) { dropletBounds.minY = y; }
    if (z > dropletBounds.maxZ) { dropletBounds.maxZ = z; }
    if (z < dropletBounds.minZ) { dropletBounds.minZ = z; }
}

input.forEach(coordString => {
    dropletCoords.add(coordString);
    const coord = coordString.split(',').map(num => parseInt(num, 10));
    // totalSAPart1 += 6;
    // const adjacentCoordinatesForCoord = adjacentCoordinates(coord);
    // adjacentCoordinatesForCoord.forEach(adj => {
    //     if (dropletCoords.has(adj)) {
    //         totalSAPart1 -= 2;
    //     }
    // })

    adjustBounds(coord);
})

// console.log(totalSAPart1);

const shellBounds = {
    minX: dropletBounds.minX - 1,
    maxX: dropletBounds.maxX + 1,
    minY: dropletBounds.minY - 1,
    maxY: dropletBounds.maxY + 1,
    minZ: dropletBounds.minZ - 1,
    maxZ: dropletBounds.maxZ + 1
}

const dx = shellBounds.maxX - shellBounds.minX + 1;
const dy = shellBounds.maxY - shellBounds.minY + 1;
const dz = shellBounds.maxZ - shellBounds.minZ + 1;
const shellOuterSA = 2 * dx * dy + 2 * dx * dz + 2 * dy * dz;

const coordToString = (coord) => `${coord.x},${coord.y},${coord.z}`;

const stringToCoord = (string) => {
    const [x, y, z] = string.split(',').map(num => parseInt(num, 10));
    return {x: x, y: y, z: z};
}

const adjacentCoordsWithinBounds = (coord) => {
    return [
        {x: coord.x - 1, y: coord.y, z: coord.z},
        {x: coord.x + 1, y: coord.y, z: coord.z},
        {x: coord.x, y: coord.y - 1, z: coord.z},
        {x: coord.x, y: coord.y + 1, z: coord.z},
        {x: coord.x, y: coord.y, z: coord.z - 1},
        {x: coord.x, y: coord.y, z: coord.z + 1},
    ].filter(coord => {
        return coord.x >= shellBounds.minX
            && coord.x <= shellBounds.maxX
            && coord.y >= shellBounds.minY
            && coord.y <= shellBounds.maxY
            && coord.z >= shellBounds.minZ
            && coord.z <= shellBounds.maxZ
    }).map(coord => coordToString(coord))
}

const shellCoords = new Set();
let shellSA = 0;
let initialShellCoord = {x: shellBounds.minX, y: shellBounds.minY, z: shellBounds.minZ};

const fillQueue = [initialShellCoord];

while (fillQueue.length > 0) {
    const coord = fillQueue.shift();
    // console.log(`\n===========================`);
    // console.log(coord);

    // console.log(Array.from(shellCoords).sort().join('  '));
    const doneAlready = shellCoords.has(coordToString(coord));
    // console.log(`already done: ${doneAlready}`);
    if (doneAlready) {
        continue;
    } else {
        shellCoords.add(coordToString(coord));
        shellSA += 6;
    }
    
    const adjacentCoordinatesToFill = adjacentCoordsWithinBounds(coord).reduce((toFill, coord) => {
        if (shellCoords.has(coord)) {
            shellSA -= 2;
        } else if (!dropletCoords.has(coord)){
            toFill.push(coord);
        }
        return toFill;
    }, []).map(coordString => stringToCoord(coordString))

    fillQueue.push(...adjacentCoordinatesToFill);
}

console.log(shellBounds)
console.log(shellSA)
console.log(shellOuterSA)
console.log(shellSA - shellOuterSA)