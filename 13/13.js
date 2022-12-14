import {readFileAsString, splitOnDoubleLineBreak, splitOnLineBreak} from '../readData.js';

const data = readFileAsString('13/data.txt');
const example = readFileAsString('13/example.txt');

const input = data;

const getIndexOfArrayEnd = (charArray) => {
    let openCount = 1;
    let closeCount = 0;
    let index = 0;
    while (openCount > closeCount) {
        const nextChar = charArray[index];
        switch (nextChar) {
            case '[':
                openCount += 1;
                break;
            case ']':
                closeCount += 1;
                break;
        }
        index += 1;
    }
    return index;
}

const parsePacket = (packetContents) => {
    const packet = [];
    let nextChar;
    while (packetContents.length > 0) {
        nextChar = packetContents.shift();
        if (nextChar === '[') {
            const index = getIndexOfArrayEnd(packetContents);
            packet.push(parsePacket(packetContents.slice(0,index - 1)))
            packetContents.splice(0,index);
        } else if (nextChar === ',') {
            continue;
        } else {
            while (!Number.isNaN(parseInt(packetContents[0], 10))) {
                nextChar += packetContents.shift();
            }
            packet.push(parseInt(nextChar, 10));
        }
    }
    return packet;
}

// const example1 = '[1,1,3,1,1]';
// const example2 = '[1,1,5,1,1]';
// const example3 = '[[1],[2,3,4]]';
// const example4 = '[[1],4]';
// const example5 = '[9]';
// const example6 = '[[8,7,6]]';
// const example7 = '[[4,4],4,4]';
// const example8 = '[1,[2,[3,[4,[5,6,7]]]],8,9]';

// parsePacket(example8.slice(1, example8.length - 1).split(''));

const parseInput = (input) => {
    return splitOnDoubleLineBreak(input)
        .map(pair => splitOnLineBreak(pair).filter(line => line !== ''))
        .map(pair => pair.map(packetString => {
            const packetContents = packetString.slice(1, packetString.length - 1).split('');
            return parsePacket(packetContents);
        }))
}

const parseInputPartTwo = (input) => {
    return splitOnLineBreak(input)
        .filter(line => line !== '')
        .map(packetString => {
            const packetContents = packetString.slice(1, packetString.length - 1).split('');
            return parsePacket(packetContents);
        });
}

const parsedPairs = parseInput(input);

const isPairCorrectlyOrdered = (pair, printThings = false) => {
    const iterationCount = Math.max(pair[0].length, pair[1].length);
    if (printThings) {
        console.log('\n============================================');
        console.log(pair[0]);
        console.log(pair[1]);
    }
    for (let i = 0; i < iterationCount; i++) {
        const leftElement = pair[0][i];
        const rightElement = pair[1][i];
        if (printThings){console.log(`comparing (${typeof(leftElement)}) ${leftElement} & (${typeof(rightElement)}) ${rightElement}`)}
        if (Number.isInteger(leftElement) && Number.isInteger(rightElement)) {
            if (leftElement < rightElement) {
                return true;
            } else if (rightElement < leftElement) {
                return false;
            } else {
                continue;
            }
        } else if (Array.isArray(leftElement) && Array.isArray(rightElement)) {
            switch (isPairCorrectlyOrdered([leftElement, rightElement], printThings)) {
                case true:
                    return true;
                case false:
                    return false;
                default:
                    continue;
            }
        } else if (Array.isArray(leftElement) && Number.isInteger(rightElement)) {
            switch (isPairCorrectlyOrdered([leftElement, [rightElement]], printThings)) {
                case true:
                    return true;
                case false:
                    return false;
                default:
                    continue;
            }
        } else if (Number.isInteger(leftElement) && Array.isArray(rightElement)) {
            switch (isPairCorrectlyOrdered([[leftElement], rightElement], printThings)) {
                case true:
                    return true;
                case false:
                    return false;
                default:
                    continue;
            }
        } else if (rightElement === undefined) {
            return false;
        } else if (leftElement === undefined) {
            return true;
        }
    }
}

// // part 1
// const indicesOfCorrectlyOrderedPairs = [];

// for (let index = 0; index < parsedPairs.length; index++) {
//     const pair = parsedPairs[index];
//     const oneBasedIndex = index + 1;
//     let printThings = false;
//     const correct = isPairCorrectlyOrdered(pair, printThings);
//     if (correct) {
//         indicesOfCorrectlyOrderedPairs.push(oneBasedIndex);
//     }
// }

// console.log(indicesOfCorrectlyOrderedPairs);
// console.log(indicesOfCorrectlyOrderedPairs.reduce((a,b) => a+b));

// part 2

const packets = parseInputPartTwo(input);

packets.sort((a, b) => isPairCorrectlyOrdered([a, b]) ? -1 : 1);
console.log(packets);

const insertionIndices = [];

let packetToInsert = [[2]];

for (let i = 0; i < packets.length; i++) {
    const packet = packets[i];
    if (!isPairCorrectlyOrdered([packet, packetToInsert])) {
        insertionIndices.push(i);
        packetToInsert = [[6]];
    }
}

console.log(insertionIndices);