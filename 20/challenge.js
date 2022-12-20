import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('20/data.txt');
const example = readDataAsArray('20/example.txt');

// const input = example;
const input = data;

// // part 1
// const startTime = Date.now();
// console.log('starting')

// const sequence = input.map((num, i) => { return {i: i, num: parseInt(num, 10)} })

// console.log(`Duration: ${Date.now() - startTime}ms - input parsed`)

// for (let i = 0; i < sequence.length; i++) {
//     // console.log(sequence.map(num => num.num).join(', '));
//     const numIndex = sequence.findIndex(x => x.i === i);
//     const num = sequence.splice(numIndex, 1)[0];
//     let replaceIndex = (numIndex + num.num) % sequence.length;
//     sequence.splice(replaceIndex, 0, num);
// }

// console.log(`Duration: ${Date.now() - startTime}ms - sequence rearranged`)

// // console.log(sequence.map(num => num.num).join(', '));

// const indexOfZero = sequence.findIndex(num => num.num === 0);
// const indexesToFindValuesOf = [1000 + indexOfZero, 2000 + indexOfZero, 3000 + indexOfZero]
// let finalSum = 0;
// indexesToFindValuesOf.forEach(index => {
//     const realI = index % sequence.length;
//     const value = sequence[realI].num;
//     console.log(value);
//     finalSum += value;
// })

// console.log(`Duration: ${Date.now() - startTime}ms - final answer`)
// console.log(finalSum);


// part 2
const startTime = Date.now();
console.log('starting')

const encryptionKey = 811589153;
let sequence = input.map((num, i) => { return {i: i, num: parseInt(num, 10) * encryptionKey} })

console.log(`Duration: ${Date.now() - startTime}ms - input parsed`)

const rearrangeSequence = (sequence) => {
    for (let i = 0; i < sequence.length; i++) {
        // console.log(sequence.map(num => num.num).join(', '));
        const numIndex = sequence.findIndex(x => x.i === i);
        const num = sequence.splice(numIndex, 1)[0];
        let replaceIndex = (numIndex + num.num) % sequence.length;
        sequence.splice(replaceIndex, 0, num);
    }
    return sequence;
}


for (let j = 0; j < 10; j++) {
    sequence = rearrangeSequence(sequence);

    console.log(`Duration: ${Date.now() - startTime}ms - sequence rearranged ${j + 1} times:`)
    console.log(sequence.map(num => num.num).join(', '));
}

const indexOfZero = sequence.findIndex(num => num.num === 0);
const indexesToFindValuesOf = [1000 + indexOfZero, 2000 + indexOfZero, 3000 + indexOfZero]
let finalSum = 0;
indexesToFindValuesOf.forEach(index => {
    const realI = index % sequence.length;
    let value = sequence[realI].num;
    console.log(value);
    finalSum += value;
})

console.log(`Duration: ${Date.now() - startTime}ms - final answer`)
console.log(finalSum);
