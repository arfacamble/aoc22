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
    monkeysAsNumbers[monkeyId] = number;
    const monkeysWaiting = lookup[monkeyId];
    if (monkeysWaiting === undefined) { return; }
    delete lookup[monkeyId];
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

const parseInputForInitialState = (input) => {
    input.forEach((line) => {
        const [id, value] = line.split(': ');
        if (id === 'humn') {
            return;
        }
        const numVal = parseInt(value, 10);
        if (Number.isNaN(numVal)) {
            createMonkeyAsCalculation(id, value);
        } else {
            setMonkeyAsNumber(id, numVal);
        }
    })
    // console.log(monkeysAsNumbers);
    console.log(monkeysAsCalculations);
    // console.log(lookup);
}

parseInputForInitialState(input);

const performReverseCalculation = (answer, calculation) => {
    console.log('=================')
    console.log(answer)
    console.log(calculation)
    let nextAnswer;
    let nextId;
    switch (calculation.operation) {
        case '/':
            if (typeof(calculation.monkeys[0]) === 'number') {
                nextId = calculation.monkeys[1];
                nextAnswer = calculation.monkeys[0] / answer;
            } else {
                nextId = calculation.monkeys[0];
                nextAnswer = answer * calculation.monkeys[1];
            }
            break;
        case '+':
            if (typeof(calculation.monkeys[0]) === 'number') {
                nextId = calculation.monkeys[1];
                nextAnswer = answer - calculation.monkeys[0];
            } else {
                nextId = calculation.monkeys[0];
                nextAnswer = answer - calculation.monkeys[1];
            }
            break;
        case '*':
            if (typeof(calculation.monkeys[0]) === 'number') {
                nextId = calculation.monkeys[1];
                nextAnswer = answer / calculation.monkeys[0];
            } else {
                nextId = calculation.monkeys[0];
                nextAnswer = answer / calculation.monkeys[1];
            }
            break;
        case '-':
            if (typeof(calculation.monkeys[0]) === 'number') {
                nextId = calculation.monkeys[1];
                nextAnswer = calculation.monkeys[0] - answer;
            } else {
                nextId = calculation.monkeys[0];
                nextAnswer = answer + calculation.monkeys[1];
            }
            break;
        }
    performReverseCalculation(nextAnswer, monkeysAsCalculations[nextId])
}

// Object.values(monkeysAsCalculations).forEach(thing => console.log(thing.monkeys.sort()))
// console.log(monkeysAsCalculations)

const [id, value] = monkeysAsCalculations['root'].monkeys;

performReverseCalculation(value, monkeysAsCalculations[id]);