import {readDataAsArray} from '../readData.js';

let data = readDataAsArray('09/data.txt');
let example = readDataAsArray('09/example.txt');
let example2 = readDataAsArray('09/example2.txt');

const moveTailPos = (headPos, tailPos) => {
    const dx = headPos[0] - tailPos[0];
    const dy = headPos[1] - tailPos[1];
    if (Math.abs(dx) === 2) {
        tailPos[0] = (tailPos[0] + headPos[0]) / 2;
        if (Math.abs(dy) === 1) {
            tailPos[1] = headPos[1];
        }
    }
    if ( Math.abs(dy) === 2) {
        tailPos[1] = (tailPos[1] + headPos[1]) / 2;
        if (Math.abs(dx) === 1) {
            tailPos[0] = headPos[0];
        }
    }
}

const countTailPositions1 = (moves) => {
    let headPos = [0,0];
    let tailPos = [0,0];
    const visited = {'0,0': true};

    moves.forEach(move => {
        let [direction, distance] = move.split(' ');
        distance = parseInt(distance, 10);
        for (let count = 0; count < distance; count++) {
            switch (direction) {
                case 'U':
                    headPos[1] += 1;
                    break;
                case 'D':
                    headPos[1] -= 1;
                    break;
                case 'L':
                    headPos[0] -= 1;
                    break;
                case 'R':
                    headPos[0] += 1;
                    break;
            }
            moveTailPos(headPos, tailPos);
            visited[tailPos.toString()] = true;
        }
    })

    return Object.keys(visited).length;
}

console.log(countTailPositions1(data));

const countTailPositions2 = (moves) => {
    let headPos = [0,0];
    let tailPos1 = [0,0];
    let tailPos2 = [0,0];
    let tailPos3 = [0,0];
    let tailPos4 = [0,0];
    let tailPos5 = [0,0];
    let tailPos6 = [0,0];
    let tailPos7 = [0,0];
    let tailPos8 = [0,0];
    let tailPos9 = [0,0];
    const visited = {'0,0': true};

    moves.forEach(move => {
        let [direction, distance] = move.split(' ');
        distance = parseInt(distance, 10);
        for (let count = 0; count < distance; count++) {
            switch (direction) {
                case 'U':
                    headPos[1] += 1;
                    break;
                case 'D':
                    headPos[1] -= 1;
                    break;
                case 'L':
                    headPos[0] -= 1;
                    break;
                case 'R':
                    headPos[0] += 1;
                    break;
            }
            moveTailPos(headPos, tailPos1);
            moveTailPos(tailPos1, tailPos2);
            moveTailPos(tailPos2, tailPos3);
            moveTailPos(tailPos3, tailPos4);
            moveTailPos(tailPos4, tailPos5);
            moveTailPos(tailPos5, tailPos6);
            moveTailPos(tailPos6, tailPos7);
            moveTailPos(tailPos7, tailPos8);
            moveTailPos(tailPos8, tailPos9);
            visited[tailPos9.toString()] = true;
        }
    })

    return Object.keys(visited).length;
}

console.log(countTailPositions2(data));