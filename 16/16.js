import {readDataAsArray} from '../readData.js';
import PriorityQueue from 'priorityqueuejs';

const data = readDataAsArray('16/data.txt');
const example = readDataAsArray('16/example.txt');

const input = example;
// const input = data;

class Valve {
    constructor(id, flowRate, tunnels) {
        this.id = id,
        this.flowRate = flowRate,
        this.tunnels = tunnels
    }
}

const valves = {}

const parseInput = (input) => {
    input.forEach(line => {
        const [nameAndRate, tunnelString] = line.split(';');
        const rate = parseInt(nameAndRate.split('=')[1], 10);
        const id = nameAndRate.split(' ')[1];
        const tunnels = tunnelString.split(/(valves)|(valve)/).pop().split(',').map(id => id.trim());
        valves[id] = new Valve(id, rate, tunnels);
    })
}

parseInput(input)

const valuableValvesSorted = Object.values(valves).filter(valve => valve.flowRate > 0).sort((a,b) => b.flowRate - a.flowRate)

let maxPressureReleaseFound = 0;

class Path {
    constructor() {
        this.timeRemaining = 30;
        this.opened = [];
        this.currentValve = valves['AA'];
        this.visited = [this.currentValve.id];
        this.pressureReleased = 0;
    }

    takeStep = () => {
        const nextSteps = [];
        if (this.timeRemaining === 0) {
            return nextSteps;
        }
        const newTimeRemaining = this.timeRemaining - 1;
        if (!this.opened.includes(this.currentValve.id) && this.currentValve.flowRate > 0) {
            const path = new Path();
            path.timeRemaining = newTimeRemaining;
            path.currentValve = this.currentValve;
            path.opened = [...this.opened].concat([this.currentValve.id]);
            path.visited = [...this.visited];
            path.pressureReleased = this.pressureReleased + newTimeRemaining * this.currentValve.flowRate;
            if (path.maximumPressureReleased() > maxPressureReleaseFound) {
                nextSteps.push(path);
                if (path.pressureReleased > maxPressureReleaseFound) {
                    maxPressureReleaseFound = path.pressureReleased;
                }
            }
        }
        const possibleNextValves = this.currentValve.tunnels;
        if (!this.opened.includes(this.currentValve.id)) {
            const lastVisited = this.visited[this.visited.length - 2];
            possibleNextValves.filter(valve => valve.id !== lastVisited);
        }
        for (let i = 0; i < possibleNextValves.length; i++) {
            const nextValveId = possibleNextValves[i];
            const path = new Path();
            path.timeRemaining = newTimeRemaining;
            path.currentValve = valves[nextValveId];
            path.opened = [...this.opened];
            path.visited = [...this.visited].concat([nextValveId]);
            path.pressureReleased = this.pressureReleased;
            if (path.maximumPressureReleased() > maxPressureReleaseFound) {
                nextSteps.push(path);
                if (path.pressureReleased > maxPressureReleaseFound) {
                    maxPressureReleaseFound = path.pressureReleased;
                }
            }
        }
        // nextSteps.forEach(newPath => newPath.print())
        return nextSteps;
    }

    maximumPressureReleased = () => {
        const unopenedValuableValvesSorted = valuableValvesSorted.filter(valve => !this.opened.includes(valve.id))
        let timeLeft = this.timeRemaining - 1;
        let maxPressureReleased = this.pressureReleased;
        while (timeLeft > 0 && unopenedValuableValvesSorted.length > 0) {
            const nextValve = unopenedValuableValvesSorted.shift();
            maxPressureReleased += timeLeft * nextValve.flowRate;
            timeLeft -= 2;
        }
        return maxPressureReleased;
    }

    print = () => {
        console.log(this.printString());
    }

    printString = () => {
        return `pos: ${this.currentValve.id} - pressure released: ${this.pressureReleased}`.padEnd(34, ' ') + ` time remaining: ${this.timeRemaining}   ` + `opened: ${this.opened.join(', ').padEnd(20, ' ')}visited: ${this.visited.join(', ')}`;
    }
}

const bestPressureForPositionsAndTime = {
    'AAAA': { '26': 0 }
}

const isNoBetterPressureReleaseYetFoundForThisOrMoreTimeRemaining = (path) => {
    // console.log('\n-----------------');
    const positionKey = [path.myCurrentValve.id, path.elephantCurrentValve.id].sort().join('');
    // console.log(`position: ${positionKey} - time remaining: ${path.timeRemaining} - pressure: ${path.pressureReleased}`);
    if (bestPressureForPositionsAndTime[positionKey] === undefined) {bestPressureForPositionsAndTime[positionKey] = new Map()}
    const bestPressureForPosition = bestPressureForPositionsAndTime[positionKey];
    // console.log(bestPressureForPosition);
    const isBetterPressureAlready = Object.entries(bestPressureForPosition)
        .filter(entry => parseInt(entry[0], 10) >= path.timeRemaining)
        .some(entry => entry[1] >= path.pressureReleased);
    // console.log(isBetterPressureAlready);
    if (!isBetterPressureAlready) {
        bestPressureForPositionsAndTime[positionKey][path.timeRemaining] = path.pressureReleased;
    }
    // console.log(Object.keys(bestPressureForPositionsAndTime).sort())
    return !isBetterPressureAlready;
}

class PathPartTwo {
    constructor() {
        this.timeRemaining = 26;
        this.opened = [];
        this.myCurrentValve = valves['AA'];
        this.myVisited = [this.myCurrentValve.id];
        this.elephantCurrentValve = valves['AA'];
        this.elephantVisited = [this.elephantCurrentValve.id];
        this.pressureReleased = 0;
    }

    takeSteps = () => {
        let maxPossiblePressureRelease = this.maximumPressureReleased();
        if (maxPossiblePressureRelease < maxPressureReleaseFound) {
            return [];
        }

        const mySteps = this.takeMyStep();
        const bothSteps = mySteps.flatMap((pathAfterMyStep) => this.takeElephantStep(pathAfterMyStep));

        const finalSteps = [];

        bothSteps.forEach(newPath => {
            const maxPossiblePressureRelease = newPath.maximumPressureReleased();
            if (isNoBetterPressureReleaseYetFoundForThisOrMoreTimeRemaining(newPath) && maxPossiblePressureRelease > maxPressureReleaseFound) {
                finalSteps.push(newPath);
                if (newPath.pressureReleased > maxPressureReleaseFound) {
                    maxPressureReleaseFound = newPath.pressureReleased;
                }
            }
        })

        // finalSteps.forEach(path => path.print());

        return finalSteps;
    }
    
    takeMyStep = () => {
        const nextSteps = [];
        if (this.timeRemaining === 0) {
            return nextSteps;
        }
        const newTimeRemaining = this.timeRemaining - 1;
        if (!this.opened.includes(this.myCurrentValve.id) && this.myCurrentValve.flowRate > 0) {
            const path = new PathPartTwo();
            path.timeRemaining = newTimeRemaining;
            path.myCurrentValve = this.myCurrentValve;
            path.myVisited = [...this.myVisited];
            path.elephantCurrentValve = this.elephantCurrentValve;
            path.elephantVisited = [...this.elephantVisited];
            path.opened = [...this.opened].concat([this.myCurrentValve.id]);
            path.pressureReleased = this.pressureReleased + newTimeRemaining * this.myCurrentValve.flowRate;
            nextSteps.push(path);
        }
        const possibleNextValves = this.myCurrentValve.tunnels;
        if (!this.opened.includes(this.myCurrentValve.id)) {
            const lastVisited = this.myVisited[this.myVisited.length - 2];
            possibleNextValves.filter(valve => valve.id !== lastVisited);
        }
        for (let i = 0; i < possibleNextValves.length; i++) {
            const nextValveId = possibleNextValves[i];
            const path = new PathPartTwo();
            path.timeRemaining = newTimeRemaining;
            path.myCurrentValve = valves[nextValveId];
            path.myVisited = [...this.myVisited].concat([nextValveId]);
            path.elephantCurrentValve = this.elephantCurrentValve;
            path.elephantVisited = [...this.elephantVisited];
            path.opened = [...this.opened];
            path.pressureReleased = this.pressureReleased;
            nextSteps.push(path);
        }
        // nextSteps.forEach(newPath => newPath.print())
        return nextSteps;
    }

    takeElephantStep = (pathAfterMyStep) => {
        const nextSteps = [];
        if (!pathAfterMyStep.opened.includes(this.elephantCurrentValve.id) && this.elephantCurrentValve.flowRate > 0) {
            const path = new PathPartTwo();
            path.timeRemaining = pathAfterMyStep.timeRemaining;
            path.elephantCurrentValve = this.elephantCurrentValve;
            path.elephantVisited = [...pathAfterMyStep.elephantVisited];
            path.myCurrentValve = pathAfterMyStep.myCurrentValve;
            path.myVisited = [...pathAfterMyStep.myVisited];
            path.opened = [...pathAfterMyStep.opened].concat([this.elephantCurrentValve.id]);
            path.pressureReleased = pathAfterMyStep.pressureReleased + pathAfterMyStep.timeRemaining * this.elephantCurrentValve.flowRate;
            nextSteps.push(path);
        }
        const possibleNextValves = this.elephantCurrentValve.tunnels;
        if (!pathAfterMyStep.opened.includes(this.elephantCurrentValve.id)) {
            const lastVisited = this.elephantVisited[this.elephantVisited.length - 2];
            possibleNextValves.filter(valve => valve.id !== lastVisited);
        }
        for (let i = 0; i < possibleNextValves.length; i++) {
            const nextValveId = possibleNextValves[i];
            const path = new PathPartTwo();
            path.timeRemaining = pathAfterMyStep.timeRemaining;
            path.elephantCurrentValve = valves[nextValveId];
            path.elephantVisited = [...pathAfterMyStep.elephantVisited].concat([nextValveId]);
            path.myCurrentValve = pathAfterMyStep.myCurrentValve;
            path.myVisited = [...pathAfterMyStep.myVisited];
            path.opened = [...pathAfterMyStep.opened];
            path.pressureReleased = pathAfterMyStep.pressureReleased;
            nextSteps.push(path);
        }
        return nextSteps;
    }

    maximumPressureReleased = () => {
        const unopenedValuableValvesSorted = valuableValvesSorted.filter(valve => !this.opened.includes(valve.id))
        let timeLeft = this.timeRemaining - 1;
        let maxPressureReleased = this.pressureReleased;
        while (timeLeft > 0 && unopenedValuableValvesSorted.length > 0) {
            let nextValve = unopenedValuableValvesSorted.shift();
            maxPressureReleased += timeLeft * nextValve.flowRate;
            nextValve = unopenedValuableValvesSorted.shift();
            if (nextValve !== undefined) {
                maxPressureReleased += timeLeft * nextValve.flowRate;
            }
            timeLeft -= 2;
        }
        return maxPressureReleased;
    }

    print = () => {
        console.log(this.printString());
    }

    printString = () => {
        return `my pos: ${this.myCurrentValve.id}, el pos: ${this.elephantCurrentValve.id} - pressure released: ${this.pressureReleased}`.padEnd(50, ' ') + ` time remaining: ${this.timeRemaining} ` + `opened: ${this.opened.join(', ').padEnd(15, ' ')}my visited: ${this.myVisited.join(', ').padEnd(15, ' ')}, el visited: ${this.elephantVisited.join(', ').padEnd(15, ' ')}`;
    }
}

const comparator = (a,b) => {
    // if (a.timePassed === b.timePassed) {
        return a.pressureReleased - b.pressureReleased;
    // }
    // return b.timePassed - a.timePassed;
}

// // part 1
// var queue = new PriorityQueue(comparator);

// queue.enq(new Path());

// let pathMoving;

// const startTime = Date.now();

// while (queue.size() > 0) {
//     pathMoving = queue.deq();
//     pathMoving.takeStep().forEach(newPath => queue.enq(newPath));
// }

// console.log(`total time: ${Date.now() - startTime}`);

// console.log(maxPressureReleaseFound);

// part 2
var queue = new PriorityQueue(comparator);
queue.enq(new PathPartTwo());

let pathMoving;

const startTime = Date.now();

let printerval = 2;

while (queue.size() > 0) {
    pathMoving = queue.deq();
    const nextSteps = pathMoving.takeSteps();
    nextSteps.forEach(newPath => queue.enq(newPath));
    const duration = (Date.now() - startTime) / 1000;
    if (duration > printerval) {
        printerval += 2;
        console.log(`\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`);
        console.log(`Duration: ${Math.floor(duration)}s   Queue size: ${queue.size()}    Max pressure found: ${maxPressureReleaseFound}`);
        console.log(`moving ${pathMoving.printString()}`);
    }
}

console.log(`total time: ${Date.now() - startTime}`);

console.log(maxPressureReleaseFound);
// 1535 is too low
// 1637 is too low
// 1703 wrong
// 1743 wrong
// 2344 wrong

// console.log(`-----------------`)
// pathMoving = queue.deq();
// console.log(`moving: ${pathMoving.printString()}`)
// pathMoving.takeSteps().forEach(newPath => queue.enq(newPath));
// console.log(queue.size());
