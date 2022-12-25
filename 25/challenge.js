import {readDataAsArray} from '../readData.js';

const startTime = Date.now();

const data = readDataAsArray('25/data.txt').map(line => line.split(''));
const example = readDataAsArray('25/example.txt').map(line => line.split(''));

// const input = example;
const input = data;

const digitValues = {
    2: 2,
    1: 1,
    0: 0,
    '-': -1,
    '=': -2
}

const snafuValues = {
    '2': '2',
    '1': '1',
    '0': '0',
    '-1': '-',
    '-2': '='
}

const snafu2DEC = (arr) => {
    let num = 0;
    for (let power = 0; power < arr.length; power++) {
        const digit = arr[arr.length - power - 1];
        num += digitValues[digit] * (5 ** power);
    }
    return num;
}

// console.log(snafu2DEC('1=-0-2     '.trim().split('')));
// console.log(snafu2DEC(' 12111      '.trim().split('')));
// console.log(snafu2DEC('  2=0=      '.trim().split('')));
// console.log(snafu2DEC('    21       '.trim().split('')));
// console.log(snafu2DEC('  2=01      '.trim().split('')));
// console.log(snafu2DEC('   111       '.trim().split('')));
// console.log(snafu2DEC(' 20012     '.trim().split('')));
// console.log(snafu2DEC('   112       '.trim().split('')));
// console.log(snafu2DEC(' 1=-1=      '.trim().split('')));
// console.log(snafu2DEC('  1-12      '.trim().split('')));
// console.log(snafu2DEC('    12        '.trim().split('')));
// console.log(snafu2DEC('    1=        '.trim().split('')));
// console.log(snafu2DEC('   122       '.trim().split('')));

const dec2SNAFU = (num) => {
    let started = false
    const snafDigArr = [];
    for (let power = 20; power >= 0; power--) {
        const colValue = 5**power;
        let smallestRemainder = Infinity;
        let closestMultiple;
        for (let multiple = -2; multiple <= 2; multiple++) {
            const option = multiple * colValue;
            const diff = num - option;
            if (Math.abs(diff) < Math.abs(smallestRemainder)) {
                smallestRemainder = diff;
                closestMultiple = multiple;
            }
        }
        snafDigArr.push(snafuValues[closestMultiple]);
        num = smallestRemainder;
    }
    while (snafDigArr[0] === '0') {
        snafDigArr.shift();
    }
    return snafDigArr.join('');
}

let total = 0;
for (let i = 0; i < input.length; i++) {
    const snafNum = input[i];
    total += snafu2DEC(snafNum);
}
console.log(total);

console.log(dec2SNAFU(total));

console.log(`Duration: ${Date.now() - startTime}ms`)
