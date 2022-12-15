import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('15/data.txt');
const example = readDataAsArray('15/example.txt');

// const input = example;
const input = data;

class Sensor {
    constructor(sensorX, sensorY, beaconX, beaconY) {
        this.x = sensorX,
        this.y = sensorY,
        this.beaconX = beaconX,
        this.beaconY = beaconY,
        this.range = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY)
    }
}

const sensors = [];

const parseInput = (input) => {
    input.forEach(line => {
        const parts = line.split('=');
        const sensorX = parseInt(parts[1].split(',')[0], 10);
        const sensorY = parseInt(parts[2].split(':')[0], 10);
        const beaconX = parseInt(parts[3].split(',')[0], 10);
        const beaconY = parseInt(parts[4], 10);
        sensors.push(new Sensor(sensorX, sensorY, beaconX, beaconY));
    })
}

parseInput(input);

// // part 1
// const countBeaconlessCoordsForRow = (yVal) => {
//     const beaconXVals = new Set();
//     const coveredXVals = new Set();
//     for (let i = 0; i < sensors.length; i++) {
//         const sensor = sensors[i];
//         const yDiff = Math.abs(yVal - sensor.y);
//         if (yDiff > sensor.range) {
//             continue;
//         }
//         const radiusCovered = sensor.range - yDiff;
//         for (let d = 0; d <= radiusCovered; d++) {
//             coveredXVals.add(sensor.x + d);
//             coveredXVals.add(sensor.x - d);
//         }
//     }
//     for (const x of beaconXVals.values()) {
//         coveredXVals.delete(x);        
//     }
//     console.log(coveredXVals.size);
// }

// countBeaconlessCoordsForRow(2000000);

const findCoveredCoordsForRow = (yVal) => {
    const coveredXVals = new Set();
    for (let i = 0; i < sensors.length; i++) {
        const sensor = sensors[i];
        const yDiff = Math.abs(yVal - sensor.y);
        if (yDiff > sensor.range) {
            continue;
        }
        const radiusCovered = sensor.range - yDiff;
        for (let d = 0; d <= radiusCovered; d++) {
            coveredXVals.add(sensor.x + d);
            coveredXVals.add(sensor.x - d);
        }
    }
    return coveredXVals;
}

// part 2

// const maxCoordVal = 20;
const maxCoordVal = 4000000;

// const inRange = (num) => num >= 0 && num <= maxCoordVal;

const startTime = Date.now();

// // for (let y = 0; y <= maxCoordVal; y++) {
// //     console.log(`y = ${y}, Duration: ${Date.now() - startTime}`)
// //     const coveredXVals = findCoveredCoordsForRow(y);
// //     for (let x = 0; x < maxCoordVal; x++) {
// //         if (!coveredXVals.has(x)) {
// //             console.log(`MISSING!!: x: ${x} y: ${y}\nTuning frequency: ${4000000 * x + y}`);
// //         }
// //     }
// // }


// const coveredCoords = { 0: new Map() }

// const findCoveredCoordsForSensor = (sensor) => {
//     for (let y = sensor.y - sensor.range; y <= sensor.y + sensor.range; y++) {
//         if (!inRange(y)) { continue; }
//         if (coveredCoords[y] === undefined) { coveredCoords[y] = new Map() }
//         const rowRadius = sensor.range - (Math.abs(sensor.y - y));
//         for (let xDiff = 0; xDiff <= rowRadius; xDiff++) {
//             if (inRange(sensor.x + xDiff)) { coveredCoords[y][sensor.x + xDiff] = sensor.x + xDiff; }
//             if (inRange(sensor.x - xDiff)) { coveredCoords[y][sensor.x - xDiff] = sensor.x - xDiff; }
//         }
//     }
// }

// for (let i = 0; i < sensors.length; i++) {
//     const sensor = sensors[i];
//     findCoveredCoordsForSensor(sensor);
//     console.log(`Sensor ${i} processed, time taken: ${(Date.now() - startTime) / 1000} seconds`)
// }

// console.log(`Sensors processed, time taken: ${(Date.now() - startTime) / 1000} seconds`)

// let theX;
// let theY;
// for (const [y, xVals] of Object.entries(coveredCoords)) {
//     if (Object.values(xVals).length !== maxCoordVal + 1) {
//         console.log(`y = ${y}`)
//         theY = y;
//         for (let x = 0; x <= maxCoordVal; x++) {
//             if (!(Object.values(xVals).includes(x))) {
//                 console.log(`x = ${x}`);
//                 theX = x;
//                 console.log(`Tuning frequency: ${4000000 * theX + theY}`)
//             }
//         }
//     }
// }

const nextXToTryIfInSensorRange = (x, y, sensor) => {
    if (Math.abs(x - sensor.x) + Math.abs(y - sensor.y) > sensor.range) {
        return false;
    }
    return sensor.x + (sensor.range - Math.abs(y - sensor.y)) + 1;
}

let found = false;
let checkingX = 0;
let checkingY = 0;
while (checkingY <= maxCoordVal && !found) {
    while (checkingX <= maxCoordVal && !found) {
        let inRangeOfAny = false;
        sensors.forEach(sensor => {
            let nextX;
            if (nextX = nextXToTryIfInSensorRange(checkingX, checkingY, sensor)) {
                checkingX = nextX;
                inRangeOfAny = true;
                return;
            }
        })
        if (!inRangeOfAny) {
            console.log('WAHEY')
            console.log(`x: ${checkingX}, y: ${checkingY}\n tuning frequency: ${4000000 * checkingX + checkingY}`)
            found = true;
        }
    }
    checkingY += 1;
    checkingX = 0;
}

console.log(`Duration: ${(Date.now() - startTime)} milliseconds`)
