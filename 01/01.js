import {readFileAsString, splitOnDoubleLineBreak} from '../readData.js';

const data = readFileAsString('01/data.txt');
const dataByElf = splitOnDoubleLineBreak(data).map((elf) => elf.split(/\s/).filter((cal) => cal !== '').map((val) => parseInt(val)));

let maxCal = 0;

dataByElf.forEach((elf) => {
    const cals = elf.reduce((a,b) => a + b);
    if (cals > maxCal) { maxCal = cals };
})

console.log(maxCal);

let maxCals = [0,0,0];
dataByElf.forEach((elf) => {
    const cals = elf.reduce((a,b) => a + b);
    if (cals > maxCals[0]) {
        maxCals[0] = cals;
        maxCals.sort((a,b) => a - b);
    }
})

console.log(maxCals)
console.log(maxCals.reduce((a,b) => a + b))