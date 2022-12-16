import {readDataAsArray} from '../readData.js';
import PriorityQueue from 'priorityqueuejs';

const data = readDataAsArray('16/data.txt');
const example = readDataAsArray('16/example.txt');

// const input = example;
const input = data;

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

const comparator = (a,b) => {
    if (a.timePassed === b.timePassed) {
        return a.pressureReleased - b.pressureReleased;
    }
    return b.timePassed - a.timePassed;
}

var queue = new PriorityQueue(comparator);

queue.enq(new Path());

let pathMoving;
let newPaths;

const startTime = Date.now();

while (queue.size() > 0) {
    pathMoving = queue.deq();
    pathMoving.takeStep().forEach(newPath => queue.enq(newPath));
}

console.log(`total time: ${Date.now() - startTime}`);

console.log(maxPressureReleaseFound);
