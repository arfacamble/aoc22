import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('21/data.txt');
const example = readDataAsArray('21/example.txt');

// const input = example;
const input = data;

const monkeysAsNumbers = new Object();
const monkeysAsCalculations = new Object();
const lookup = new Object();

const performCalculation = (values, operation) => {
    let result;
    switch (operation) {
        case '+':
            result = values[0] + values[1]
            break;
        case '*':
            result = values[0] * values[1]
            break;
        case '-':
            result = values[0] - values[1]
            break;
        case '/':
            result = values[0] / values[1]
            break;
    }
    return result;
}

const updateMonkeyAsCalculation = (monkeyToUpdate, monkeyId, value) => {
    const calculation = monkeysAsCalculations[monkeyToUpdate];
    const indexToUpdate = calculation.monkeys.indexOf(monkeyId);
    calculation.monkeys.splice(indexToUpdate, 1, value);
    if (calculation.monkeys.every((val) => typeof(val) === 'number')) {
        const result = performCalculation(calculation.monkeys, calculation.operation);
        setMonkeyAsNumber(monkeyToUpdate, result);
        delete monkeysAsCalculations[monkeyToUpdate];
        return;
    }
}

const setMonkeyAsNumber = (monkeyId, number) => {
    if (monkeyId === 'root') {
        console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        console.log(`                                   ROOT is ${number}`)
        console.log(' = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        console.log(' = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
        console.log(' = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\n= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =')
    }

    monkeysAsNumbers[monkeyId] = number;
    const monkeysWaiting = lookup[monkeyId];
    if (monkeysWaiting === undefined) { return; }
    delete lookup[monkeyId];
    console.log(monkeysWaiting);
    monkeysWaiting.forEach(waitingMonkeyId => {
        updateMonkeyAsCalculation(waitingMonkeyId, monkeyId, number)
    })
}

const createMonkeyAsCalculation = (monkeyId, calculation) => {
    let otherMonkeys = calculation.split(' ');
    const operation = otherMonkeys.splice(1,1)[0];
    otherMonkeys = otherMonkeys.map(monkeyId => {
        const value = monkeysAsNumbers[monkeyId];
        return (value === undefined) ? monkeyId : value;
    });
    if (otherMonkeys.every((val) => typeof(val) === 'number')) {
        const result = performCalculation(otherMonkeys, operation);
        setMonkeyAsNumber(monkeyId, result);
        return;
    }
    monkeysAsCalculations[monkeyId] = {
        monkeys: otherMonkeys,
        operation: operation
    }
    otherMonkeys.forEach(other => {
        if (typeof(other) === 'number') { return; }
        if (lookup.hasOwnProperty(other)) {
            lookup[other].push(monkeyId);
        } else {
            lookup[other] = [monkeyId];
        }
    })

}

const run = (input) => {
    input.forEach((line) => {
        const [id, value] = line.split(': ');
        const numVal = parseInt(value, 10);
        if (Number.isNaN(numVal)) {
            createMonkeyAsCalculation(id, value);
        } else {
            setMonkeyAsNumber(id, numVal);
        }
    })
}

run(input);