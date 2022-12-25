import {readFileAsString, splitOnDoubleLineBreak, splitOnLineBreak} from '../readData.js';

const startTime = Date.now();

const data = readFileAsString('22/data.txt');
const example = readFileAsString('22/example.txt');

// const input = example;
const input = data;

let [map, instructions] = splitOnDoubleLineBreak(input);
map = splitOnLineBreak(map).map(line => line.split(''));
instructions = instructions.trim().split('');

const is_numeric = (str) => {
    return /^\d+$/.test(str);
}

const steps = [];

while (instructions.length) {
    let next = instructions.shift();
    if (is_numeric(next)) {
        while (is_numeric(instructions[0])) {
            next += instructions.shift();
        }
        steps.push(parseInt(next, 10));
    } else {
        steps.push(next);
    }
}    

// console.log(steps)
// console.log(map)

const directions = ['E', 'S', 'W', 'N'];

const changeDirection = (current, change) => {
    const currentIndex = directions.indexOf(current);
    switch (change) {
        case 'R':
            return directions[(currentIndex + 1) % 4];
        case 'L':
            return directions[(currentIndex + 3) % 4];
    }
}

// console.log(changeDirection('E', 'R'));
// console.log(changeDirection('N', 'L'));
// console.log(changeDirection('W', 'R'));
// console.log(changeDirection('S', 'R'));

const coordinateAt = (coordinate) => {
    return map[coordinate.y] ? map[coordinate.y][coordinate.x] : map[coordinate.y];
}

const checkCoordinate = (coordinate) => {
    let spaceOrWall;
    if (!map[coordinate.y] || !map[coordinate.y][coordinate.x] || (spaceOrWall = map[coordinate.y][coordinate.x]) === ' ') {
        return false
    }
    return spaceOrWall;
}

// console.log(coordinateAt(0,0));
// console.log(coordinateAt(5,0));
// console.log(coordinateAt(10,0));
// console.log(coordinateAt(15,0));
// console.log(coordinateAt(7,-1));

const findNextPositionPartTwo = (position) => {
    let spaceOrWall;
    let newX;
    let newY;
    let newDirection;
    switch (position.direction) {
        case 'N':
            if (checkCoordinate({x: position.x, y: position.y - 1})) {
                newX = position.x;
                newY = position.y - 1;
                newDirection = position.direction;
            } else if (position.x >= 100) {
                console.log('ping')
                newY = 199;
                newX = position.x - 100;
                newDirection = 'N';
            } else if (position.x >= 50) {
                console.log('ping')
                newX = 0;
                newY = position.x + 100;
                newDirection = 'E';
            } else {
                console.log('ping')
                newX = 50;
                newY = position.x + 50;
                newDirection = 'E';
            }
            break;
        case 'S':
            if (checkCoordinate({x: position.x, y: position.y + 1})) {
                newX = position.x;
                newY = position.y + 1;
                newDirection = position.direction;
            } else if (position.x >= 100) {
                console.log('ping')
                newX = 99;
                newY = position.x - 50;
                newDirection = 'W';
            } else if (position.x >= 50) {
                console.log('ping')
                newX = 49;
                newY = position.x + 100;
                newDirection = 'W';
            } else {
                console.log('ping')
                newX = position.x + 100;
                newY = 0;
                newDirection = 'S';
            }
            break;
        case 'W':
            if (checkCoordinate({x: position.x - 1, y: position.y})) {
                newX = position.x - 1;
                newY = position.y;
                newDirection = position.direction;
            } else if (position.y >= 150) {
                console.log('ping')
                newX = position.y - 100;
                newY = 0;
                newDirection = 'S';
            } else if (position.y >= 100) {
                console.log('ping')
                newY = 149 - position.y;
                newX = 50;
                newDirection = 'E';
            } else if (position.y >= 50) {
                console.log('ping')
                newX = position.y - 50;
                newY = 100;
                newDirection = 'S';
            } else {
                console.log('ping')
                newX = 0;
                newY = 149 - position.y;
                newDirection = 'E';
            }
            break;
        case 'E':
            if (checkCoordinate({x: position.x + 1, y: position.y})) {
                newX = position.x + 1;
                newY = position.y;
                newDirection = position.direction;
            } else if (position.y >= 150) {
                console.log('ping')
                newX = position.y - 100;
                newY = 149;
                newDirection = 'N';
            } else if (position.y >= 100) {
                console.log('ping')
                newX = 149;
                newY = 149 - position.y;
                newDirection = 'W';
            } else if (position.y >= 50) {
                console.log('ping')
                newX = position.y + 50;
                newY = 49;
                newDirection = 'N';
            } else {
                console.log('ping')
                newX = 99;
                newY = 149 - position.y;
                newDirection = 'W';
            }
            break;
    }
    spaceOrWall = checkCoordinate({x: newX, y: newY});
    if (spaceOrWall === '.') {
        return {
            canMove: true,
            x: newX,
            y: newY,
            direction: newDirection
        }
    } else {
        return {
            canMove: false
        }
    }
}

const findNextCoordinateAfterStep = (position) => {
    let positionToTry;
    let nextPos;
    switch (position.direction) {
        case 'E':
            positionToTry = { x: position.x + 1, y: position.y }
            nextPos = coordinateAt(positionToTry);
            while (nextPos === ' ' || nextPos === undefined) {
                if (nextPos === undefined) {
                    positionToTry.x = 0;
                    nextPos = coordinateAt(positionToTry);
                } else {
                    positionToTry.x += 1;
                    nextPos = coordinateAt(positionToTry);
                }
            }
            break;
        case 'W':
            positionToTry = { x: position.x - 1, y: position.y }
            nextPos = coordinateAt(positionToTry);
            while (nextPos === ' ' || nextPos === undefined) {
                if (nextPos === undefined) {
                    positionToTry.x = map[positionToTry.y].length - 1;
                    nextPos = coordinateAt(positionToTry);
                } else {
                    positionToTry.x -= 1;
                    nextPos = coordinateAt(positionToTry);
                }
            }
            break;
        case 'N':
            positionToTry = { x: position.x, y: position.y - 1 }
            nextPos = coordinateAt(positionToTry);
            while (nextPos === ' ' || nextPos === undefined) {
                if (positionToTry.y < 0) {
                    positionToTry.y = map.length;
                } else {
                    positionToTry.y -= 1;
                }
                nextPos = coordinateAt(positionToTry);
            }
            break;
        case 'S':
            positionToTry = { x: position.x, y: position.y + 1 }
            nextPos = coordinateAt(positionToTry);
            while (nextPos === ' ' || nextPos === undefined) {
                if (nextPos === undefined) {
                    positionToTry.y = 0;
                    nextPos = coordinateAt(positionToTry);
                } else {
                    positionToTry.y += 1;
                    nextPos = coordinateAt(positionToTry);
                }
            }
            break;
    }
    if (nextPos === '.') {
        return {
            canMove: true,
            x: positionToTry.x,
            y: positionToTry.y
        }
    } else {
        return {
            canMove: false
        }
    }
}

const position = {
    x: map[0].indexOf('.'),
    y: 0,
    direction: 'E'
}

// // part 1
// // for (let i = 0; i < 60; i++) {
// for (let i = 0; i < steps.length; i++) {
//     const instruction = steps[i];
//     // console.log("==========")
//     // console.log(position);
//     // console.log(instruction);
//     if (Number.isInteger(instruction)) {
//         const stepCount = instruction;
//         for (let j = 0; j < stepCount; j++) {
//             const nextPos = findNextCoordinateAfterStep(position);
//             if (nextPos.canMove) {
//                 position.x = nextPos.x,
//                 position.y = nextPos.y
//             } else {
//                 break;
//             }
//         }
//     } else {
//         const turnDirection = instruction;
//         position.direction = changeDirection(position.direction, turnDirection);
//     }
// }

// part 2
// for (let i = 0; i < 60; i++) {
for (let i = 0; i < steps.length; i++) {
    const instruction = steps[i];
    console.log("==========");
    console.log(position);
    console.log(instruction);
    if (Number.isInteger(instruction)) {
        const stepCount = instruction;
        for (let j = 0; j < stepCount; j++) {
            const nextPos = findNextPositionPartTwo(position);
            // console.log(nextPos);
            if (nextPos.canMove) {
                position.x = nextPos.x;
                position.y = nextPos.y;
                position.direction = nextPos.direction;
            } else {
                break;
            }
        }
    } else {
        const turnDirection = instruction;
        position.direction = changeDirection(position.direction, turnDirection);
    }
}

console.log(position);
const finalPassword = (position) => 1000 * (position.y+1) + 4 * (position.x+1) + directions.indexOf(position.direction);
console.log(finalPassword(position));

console.log(`Duration: ${Date.now() - startTime}ms`)

// 130066 too high part 1

// part 2 82206 too low
// 144043 too high
// 139224 too high