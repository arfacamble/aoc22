import {readFileAsString} from '../readData.js';

const data = readFileAsString('17/data.txt').split('');
const example = readFileAsString('17/example.txt').split('');

// const leftRightArray = example;
const leftRightArray = data;

const shapes = [
    {
        rock: [
            [2,3], [3,3], [4,3], [5,3]
        ],
        under: [
            [2,2], [3,2], [4,2], [5,2]
        ],
        left: [
            [1,3]
        ],
        right: [
            [6,3]
        ]
    },
    {
        rock: [
                  [3,5],
            [2,4],[3,4],[4,4],
                  [3,3]
        ],
        under: [
            [2,3],[3,2],[4,3]
        ],
        left: [
            [1,4],[2,3]
        ],
        right: [
            [5,4],[4,3]
        ]
    },
    {
        rock: [
                        [4,5],
                        [4,4],
            [2,3],[3,3],[4,3]
        ],
        under: [
            [2,2],[3,2],[4,2]
        ],
        left: [
            [1,3]
        ],
        right: [
            [5,5],[5,4],[5,3]
        ]
    },
    {
        rock: [
            [2,6],
            [2,5],
            [2,4],
            [2,3]
        ],
        under: [
            [2,2]
        ],
        left: [
            [1,3],[1,4],[1,5],[1,6]
        ],
        right: [
            [3,3],[3,4],[3,5],[3,6]
        ]
    },
    {
        rock: [
            [2,4],[3,4],
            [2,3],[3,3]
        ],
        under: [
            [2,2],[3,2],
        ],
        left: [
            [1,3],[1,4]
        ],
        right: [
            [4,3],[4,4]
        ]
    }
]

class FallingRock {
    constructor(rockShape, cavern) {
        this.cavern = cavern;
        this.rockCoordinates = rockShape.rock.map(coord => [...coord]);
        this.under = rockShape.under.map(coord => [...coord]);
        this.left = rockShape.left.map(coord => [...coord]);
        this.right = rockShape.right.map(coord => [...coord]);
        this.moveY(cavern.length);
    }
    
    moveY = (distance) => {        
        this.rockCoordinates = this.rockCoordinates.map(coord => this.shiftY(coord, distance));
        this.under = this.under.map(coord => this.shiftY(coord, distance));
        this.left = this.left.map(coord => this.shiftY(coord, distance));
        this.right = this.right.map(coord => this.shiftY(coord, distance));
    }
    
    moveX = (distance) => {        
        this.rockCoordinates = this.rockCoordinates.map(coord => this.shiftX(coord, distance));
        this.under = this.under.map(coord => this.shiftX(coord, distance));
        this.left = this.left.map(coord => this.shiftX(coord, distance));
        this.right = this.right.map(coord => this.shiftX(coord, distance));
    }

    shiftY = (coord, distance) => {
        coord[1] += distance;
        return coord;
    }
    
    shiftX = (coord, distance) => {
        coord[0] += distance;
        return coord;
    }

    isNotFree = (coord) => {
        const x = coord[0];
        const y = coord[1];
        if (x < 0 || x > 6 || y < 0) {
            return true;
        }
        if (cavern[y] === undefined) {
            return false;
        }
        return cavern[y][x] === '#';
    }

    cantMoveLeft = () => this.left.some(coord => this.isNotFree(coord));

    cantMoveRight = () => this.right.some(coord => this.isNotFree(coord));

    cantMoveDown = () => this.under.some(coord => this.isNotFree(coord));

    convertToCavernRock = () => {
        this.rockCoordinates.forEach(coord => this.addToCavern(coord))
    }

    addToCavern = (coord, cavernToAddTo = cavern) => {
        const x = coord[0];
        const y = coord[1];
        while (cavernToAddTo.length - 1 < y) {
            cavernToAddTo.push(new Array(7).fill('.'));
        }
        const char = cavernToAddTo === cavern ? '#' : '@';
        cavernToAddTo[y][x] = char;
    }

    printRockAndCavern = () => {
        const cavernToPrint = cavern.map(level => [...level]);
        this.rockCoordinates.forEach(coord => this.addToCavern(coord, cavernToPrint));
        for (let i = cavernToPrint.length - 1; i >= 0; i--) {
            const level = cavernToPrint[i];
            console.log(`|${level.join('')}|`);
        }
        console.log('+-------+')    
    }
}

const printCavern = (cavern) => {
    console.log('')
    for (let i = cavern.length - 1; i >= 0; i--) {
        const level = cavern[i];
        console.log(`|${level.join('')}|`);
    }
    console.log('+-------+')
}

const cavern = []
let timePassed = 0;

const startTime = Date.now();

const rocksToFall = 1000000000000;

const periodfactor = leftRightArray.length * shapes.length;
// console.log(periodfactor);
const periodsToWatch = {};
let periodFound = false;

const heightGains = [];

for (let i = 0; i < rocksToFall; i++) {
    if (i % 1000000 === 0) {
        console.log(`Duration: ${Date.now() - startTime}ms`);
        console.log(`rocks fallen: ${i}, periods watching = ${Object.keys(periodsToWatch).length}`)
    }
    const initialCavernHeight = cavern.length;
    const fallingRock = new FallingRock(shapes[i % shapes.length], cavern)
    let falling = true;
    while (falling) {
        const leftOrRight = leftRightArray[timePassed % leftRightArray.length];
        // fallingRock.printRockAndCavern();
        // console.log(leftOrRight);
        switch (leftOrRight) {
            case '<':
                if (!fallingRock.cantMoveLeft()) {
                    fallingRock.moveX(-1);
                }
                break;
            case '>':
                if (!fallingRock.cantMoveRight()) {
                    fallingRock.moveX(1);
                }
                break;
        }
        timePassed += 1;
        // fallingRock.printRockAndCavern();

        if (!fallingRock.cantMoveDown()) {
            // console.log('down');
            fallingRock.moveY(-1);
        } else {
            // console.log('stop');
            falling = false;
        }
    }
    fallingRock.convertToCavernRock();
    const cavernHeightGain = cavern.length - initialCavernHeight;
    heightGains.push(cavernHeightGain);

    for (let index = cavern.length - 6; index < cavern.length; index++) {
        const row = cavern[index];
        if (row === undefined) {
            continue;
        }
        if (row.every(space => space === '#')) {
            cavern.splice(0,index);
            break;
        }
    }

    if (periodFound) {
        continue;
    }

    const periodsToWatchCount = Math.floor(i / periodfactor);
    if (Object.keys(periodsToWatch).length < periodsToWatchCount) {
        periodsToWatch[periodsToWatchCount] = {
            periodSize: periodsToWatchCount * periodfactor,
            consecutiveMatchCount: 0
        }
    }
    for (const period of Object.values(periodsToWatch)) {
        if (cavernHeightGain === heightGains[i - period.periodSize]) {
            period.consecutiveMatchCount += 1;
            if (period.consecutiveMatchCount >= 200) {
                console.log(period.periodSize);
                const periodGains = heightGains.slice(i - period.periodSize, i);
                const totalPeriodGain = periodGains.reduce((a,b) => a + b);
                console.log(totalPeriodGain);
                const remainingPeriodCount = Math.floor((rocksToFall - i) / period.periodSize);
                heightGains.push(remainingPeriodCount * totalPeriodGain);
                i += remainingPeriodCount * period.periodSize;
                periodFound = true;
            }
        } else {
            period.consecutiveMatchCount = 0;
        }
    }
    // console.log(`=====================================================\nrock ${i + 1}`)
    // printCavern(cavern);
    // console.log('=====================================================')
}

const cavernHeight = heightGains.reduce((a,b) => a + b);
console.log(`Duration: ${Date.now() - startTime}ms`);
console.log(cavernHeight);

// 1583294720740 too high