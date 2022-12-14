import {readDataAsArray} from '../readData.js';

let data = readDataAsArray('10/data.txt');
let example = readDataAsArray('10/example.txt');

const process = (input) => {
    let x = 1;
    let cycle = 0;
    let output = 0;

    const checkCycleAndRecordX = () => {
        if (cycle % 40 === 20) {
            output += cycle * x;
        }
    }

    input.forEach(line => {
        if (line === 'noop') {
            cycle += 1;
            checkCycleAndRecordX();
        } else {
            cycle += 1;
            checkCycleAndRecordX();
            cycle += 1;
            checkCycleAndRecordX();
            const xIncrement = parseInt(line.split(' ')[1], 10);
            x += xIncrement;
        }
    })

    return output;
}

console.log(process(data));

const draw = (input) => {
    let x = 1;
    let cycle = 0;
    let output = ['','','','','',''];

    const draw = () => {
        const row = Math.floor(cycle/40);
        if (Math.abs(x - (cycle % 40)) <= 1) {
            output[row] += '#';
        } else {
            output[row] += '.';
        }
    }

    input.forEach(line => {
        if (line === 'noop') {
            draw();
            cycle += 1;
        } else {
            draw();
            cycle += 1;
            draw();
            cycle += 1;
            const xIncrement = parseInt(line.split(' ')[1], 10);
            x += xIncrement;
        }
        if (cycle > 10) { return; }
    })

    return output;
}

console.log(draw(data));