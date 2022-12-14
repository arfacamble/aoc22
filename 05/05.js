import {readFileAsString, splitOnDoubleLineBreak} from '../readData.js';

const file = '05/data.txt';
// const file = '05/example.txt';

let [boxMapData, moves] = splitOnDoubleLineBreak(readFileAsString(file));
moves = moves.split(/\r?\n/).filter(move => move !== '');
console.log(boxMapData);
boxMapData = boxMapData.split(/\r?\n/).map(line => line.split(''));
boxMapData = boxMapData[0].map((_, colIndex) => boxMapData.map(row => row[colIndex]).reverse())
                .reduce((filtered, line) => {
                    line[0] = parseInt(line[0], 10);
                    if (line[0] > 0) {
                        filtered.push(line.filter(box => box !== ' '))
                    }
                    return filtered;
                }, []);
const boxMap = {};
boxMapData.forEach((line) => {
    const rowNum = line.shift();
    boxMap[rowNum] = line;
})

moves = moves
    .map((line) => {
        const nums = line
            .split(' ')
            .map(item => parseInt(item, 10))
            .filter(item => item > 0);
        return {
            count: nums[0],
            source: nums[1],
            dest: nums[2]
        }
    });

// console.log(moves);
    
moves.forEach((move) => {
    // console.log(boxMap);
    // console.log(move);
    const toMove = [];
    for (let i = 0; i < move.count; i++) {
        const crate = boxMap[move.source].pop();
        toMove.push(crate);
    }
    boxMap[move.dest] = boxMap[move.dest].concat(toMove.reverse());
})

console.log(boxMap);

let answer = [];
Object.values(boxMap).forEach(stack => answer.push(stack.pop()));
console.log(answer.join(''))