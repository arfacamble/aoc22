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

// console.log(coordinateAt(0,0));
// console.log(coordinateAt(5,0));
// console.log(coordinateAt(10,0));
// console.log(coordinateAt(15,0));
// console.log(coordinateAt(7,-1));

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
    y: 0,
    x: map[0].indexOf('.'),
    direction: 'E'
}

// for (let i = 0; i < 60; i++) {
for (let i = 0; i < steps.length; i++) {
    const instruction = steps[i];
    // console.log("==========")
    // console.log(position);
    // console.log(instruction);
    if (Number.isInteger(instruction)) {
        const stepCount = instruction;
        for (let j = 0; j < stepCount; j++) {
            const nextPos = findNextCoordinateAfterStep(position);
            if (nextPos.canMove) {
                position.x = nextPos.x,
                position.y = nextPos.y
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
const finalPassword = 1000 * (position.y+1) + 4 * (position.x+1) + directions.indexOf(position.direction);
console.log(finalPassword);

console.log(`Duration: ${Date.now() - startTime}ms`)

// 130066 too high