import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('03/data.txt');

const example = readDataAsArray('03/example.txt');

// part 1

const splitArrayInHalf = (arr) => {
    var halfLength = Math.ceil(arr.length / 2);
    var leftSide = arr.slice(0,halfLength);
    var rightSide = arr.slice(halfLength, );
    return [leftSide, rightSide]
}

const parsePart1 = (data) => {
    return data.map((line) => {
        const lineAsArr = line.split('');
        return splitArrayInHalf(lineAsArr);
    })
}

const dataPart1 = parsePart1(data);

const examplePart1 = parsePart1(example);

let total = 0;

const getPriority = (char) => {
    if (char === char.toUpperCase()) {
        return char.charCodeAt() - 38;
    } else {
        return char.charCodeAt() - 96;
    }
}

dataPart1.forEach((rucksack) => {
    const sharedItem = rucksack[0].find((item) => rucksack[1].includes(item));
    total += getPriority(sharedItem);
})

console.log(total);

// part 2

const dataPart2 = data.map(line => line.split(''));

const examplePart2 = example.map(line => line.split(''));

let total2 = 0;

while (dataPart2.length > 0) {
    const group = dataPart2.splice(0, 3);
    const badge = group[0].find(char => group[1].includes(char) && group[2].includes(char));
    total2 += getPriority(badge);
}

console.log(total2);