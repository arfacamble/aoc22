import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('04/data.txt');
const example = readDataAsArray('04/example.txt');

const parseLine = (line) => {
    let [elf1, elf2] = line.split(',').map(part => part.split('-').map(num => parseInt(num, 10)));
    return {
        elf1: {
            min: elf1[0],
            max: elf1[1]
        },
        elf2: {
            min: elf2[0],
            max: elf2[1]
        }
    }
}

const exampleData = example.map(parseLine);
const realData = data.map(parseLine);

// console.log(exampleData);

const isSubset = (range1, range2) => {
    // console.log(range1);
    // console.log(range2);
    // console.log(range1.max >= range2.max && range1.min <= range2.min);
    return range1.max >= range2.max && range1.min <= range2.min;
}

const countContained = (data) => {
    let count = 0;
    data.forEach((pair) => {
        // console.log(pair);
        if (isSubset(pair.elf1, pair.elf2) || isSubset(pair.elf2, pair.elf1)) {
            count += 1;
        }
    })
    return count;
}

console.log(countContained(exampleData));
console.log(countContained(realData));

const overlaps = (range1, range2) => {
    return (range1.max >= range2.min && range1.max <= range2.max)
    || (range1.min >= range2.min && range1.min <= range2.max)
    || (isSubset(range1, range2));
}

const countOverlapping = (data) => {
    let count = 0;
    data.forEach((pair) => {
        // console.log(pair);
        if (overlaps(pair.elf1, pair.elf2)) {
            count += 1;
        }
    })
    return count;
}

console.log(countOverlapping(exampleData));
console.log(countOverlapping(realData));