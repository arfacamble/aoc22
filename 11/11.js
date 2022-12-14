import {readFileAsString, splitOnDoubleLineBreak} from '../readData.js';

let data = readFileAsString('11/data.txt');
let example = readFileAsString('11/example.txt');

class Monkey {
    constructor(items, operation, divisor, factorRecipient, nonFactorRecipient) {
        this.items = items,
        this.operation = operation,
        this.divisor = divisor,
        this.recipients = { true: factorRecipient, false: nonFactorRecipient },
        this.itemsInspected = 0
    }
}

const monkeys = [];

const parseInput = (input) => {
    const monkeyDetailses = splitOnDoubleLineBreak(input).map(monkey => monkey.split(/\r?\n/).filter(line => line !== ''));
    monkeyDetailses.forEach(monkeyDetails => {
        const startingItems = monkeyDetails[1].split(':')[1].split(',').map(num => parseInt(num.trim(), 10));
        
        let operationParts = monkeyDetails[2].split(' ');
        operationParts = operationParts.slice(operationParts.length - 2,);
        operationParts[1] = parseInt(operationParts[1], 10);
        let operation;
        switch (operationParts[0]) {
            case '+':
                operation = (num) => {return num + operationParts[1]}
                break;
            case '*':
                if (Number.isNaN(operationParts[1])){
                    operation = (num) => {return num ** 2}
                } else {
                    operation = (num) => {return num * operationParts[1]}
                }
                break;
            default:
                break;
        };
        
        const divisor = parseInt(monkeyDetails[3].split(' ').pop(), 10);
        const factorRecipient = parseInt(monkeyDetails[4].split(' ').pop(), 10);
        const nonFactorRecipient = parseInt(monkeyDetails[5].split(' ').pop(), 10);

        const monkey = new Monkey(startingItems, operation, divisor, factorRecipient, nonFactorRecipient);
        monkeys.push(monkey);
    })
}

const printMonkeys = () => {
    console.log('--------------------')
    for (let i = 0; i < monkeys.length; i++) {
        const monkey = monkeys[i];
        console.log(`Monkey ${i} (${monkey.itemsInspected}): ${monkey.items}`)
    }
}

parseInput(data);

const bigDivisor = monkeys.reduce((a, b) => {return a * b.divisor}, 1);

const goMonkey = (monkey) => {
    while (monkey.items.length) {
        let worryLevel = monkey.items.shift();
        monkey.itemsInspected += 1;
        worryLevel = monkey.operation(worryLevel);
        // part 1:
        // worryLevel = Math.floor(worryLevel / 3);
        // part 2:
        worryLevel = worryLevel % bigDivisor
        const recipient = monkey.recipients[worryLevel % monkey.divisor === 0];
        monkeys[recipient].items.push(worryLevel);
    }
}

const goAllMonkeys = () => {
    for (let i = 0; i < monkeys.length; i++) {
        const monkey = monkeys[i];
        goMonkey(monkey);
    }
}

// part 1
// for (let i = 0; i < 20; i++) {
//     goAllMonkeys();
// }

// part 2
for (let i = 0; i < 10000; i++) {
    goAllMonkeys();
}

printMonkeys();

const findProductOfBusiestMonkeys = () => {
    return monkeys
        .map(monkey => monkey.itemsInspected)
        .sort((a,b) => a > b ? -1 : 1)
        .slice(0, 2)
        .reduce((a, b) => a * b);
}

console.log(findProductOfBusiestMonkeys());