import {readFileAsString} from '../readData.js';

const data = readFileAsString('17/data.txt').split('');
const example = readFileAsString('17/example.txt').split('');

const leftRightArray = example;
// const leftRightArray = data;

const leftRightInstructionCount = leftRightArray.length;

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

const rocksToFall = leftRightInstructionCount * 5 * 1000;

for (let i = 0; i < rocksToFall; i++) {
    // if (i % 1000000 === 0) {
    //     const duration = Date.now() - startTime;
    //     const estimatedTotalTime = duration * (rocksToFall / i);
    //     console.log(`Estimated total time:\n${Math.floor(estimatedTotalTime/1000)} seconds\n${Math.floor(estimatedTotalTime/3600000)} hours`)
    // }
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
    // console.log(`=====================================================\nrock ${i + 1}`)
    // printCavern(cavern);
    // console.log('=====================================================')
}

console.log(cavern.length);