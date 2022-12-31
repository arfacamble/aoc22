import {readDataAsArray} from '../readData.js';
import PriorityQueue from 'priorityqueuejs';

const startTime = Date.now();

const data = readDataAsArray('16/data.txt');
const example = readDataAsArray('16/example.txt');

// const input = example;
const input = data;

const valves = {}

class ValveNode {
    constructor(id, rate, routeCosts) {
        this.id = id;
        this.rate = rate;
        this.routeCosts = routeCosts;
    }
}

const zeroFlowValveIds = [];

const basicParse = (input) => {
    input.forEach(line => {
        const [nameAndRate, tunnelString] = line.split(';');
        const rate = parseInt(nameAndRate.split('=')[1], 10);
        const id = nameAndRate.split(' ')[1];
        const neighbours = tunnelString
            .split(/(valves)|(valve)/)
            .pop()
            .split(',')
            .map(id => id.trim());
        const routes = {};
        neighbours.forEach(neighbour => routes[neighbour] = 1)
        valves[id] = new ValveNode(id, rate, routes);
        if (rate === 0) {
            zeroFlowValveIds.push(id);
        }
    })
}

basicParse(input);

for (const valve of Object.values(valves)) {
    const queue = new PriorityQueue((a,b) => a.cost - b.cost);
    for (const otherValve of Object.values(valves)) {
        let routeCost;
        if (routeCost = otherValve.routeCosts[valve.id]) {
            valve.routeCosts[otherValve.id] = routeCost;
        }
    }
    for (const [id, cost] of Object.entries(valve.routeCosts)) {
        queue.enq({nodeId: id, cost: cost});
    }
    while (!queue.isEmpty()) {
        const journeyToContinue = queue.deq();
        if (journeyToContinue.nodeId === valve.id
            ||(Object.keys(valve.routeCosts).includes(journeyToContinue.nodeId)
            && valve.routeCosts[journeyToContinue.nodeId] < journeyToContinue.cost)) {
            continue;
        }
        valve.routeCosts[journeyToContinue.nodeId] = journeyToContinue.cost;
        const nextSteps = valves[journeyToContinue.nodeId].routeCosts;
        for (const [nextValveId, nextValveCost] of Object.entries(nextSteps)) {
            const newJourneyCost = journeyToContinue.cost + nextValveCost;
            if (!valve.routeCosts[nextValveId] || valve.routeCosts[nextValveId] > newJourneyCost) {
                queue.enq({ nodeId: nextValveId, cost: newJourneyCost})
            }
        }
    }
}

for (const valveId of zeroFlowValveIds) {
    if (valveId !== 'AA') {
        delete valves[valveId];
    }
}
for (const valve of Object.values(valves)) {
    for (const valveId of zeroFlowValveIds) {
        delete valve.routeCosts[valveId];
    }
}

// console.log(valves);
// for (const [_, valve] of Object.entries(valves)) {
//     let routeCosts = [];
//     for (const [id, cost] of Object.entries(valve.routeCosts)) {
//         routeCosts.push(`${id}: ${cost.toString().padStart(2, ' ')}`)
//     }
//     console.log(`${valve.id} (${valve.rate}) => ${routeCosts.join(',')}`)
// }

let maxPossiblePressureRelease = 0;

class Route {
    constructor(
        pressureReleased = 0,
        manTimeRemaining = 26,
        beastTimeRemaining = 26,
        manPosition = 'AA',
        beastPosition = 'AA',
        openValves = [],
        unopenedValves = null
    )
    {
        this.pressureReleased = pressureReleased;
        this.manTimeRemaining = manTimeRemaining;
        this.beastTimeRemaining = beastTimeRemaining;
        this.manPosition = manPosition;
        this.beastPosition = beastPosition;
        this.openValves = openValves;
        if (unopenedValves === null) {
            unopenedValves = Object.keys(valves);
            unopenedValves.splice(unopenedValves.indexOf('AA'), 1);
            this.unopenedValves = unopenedValves;
        } else {
            this.unopenedValves = unopenedValves;
        }
    }

    print = () => {
        console.log(`pressure: ${this.pressureReleased}  -  man: ${this.manPosition},${this.manTimeRemaining}  -  beast: ${this.beastPosition},${this.beastTimeRemaining} - open: ${this.openValves.join(',')}`)
    }

    routeComplete = () => {
        if (this.pressureReleased > maxPossiblePressureRelease) {
            maxPossiblePressureRelease = this.pressureReleased;
            console.log(this.openValves)
            console.log(`New Max PRESSURE - ${maxPossiblePressureRelease}`);
        }
    }

    getNextSteps = () => {
        if (this.unopenedValves.length === 0) {
            this.routeComplete();
            return [];
        }
        let nextSteps;
        if (this.manTimeRemaining >= this.beastTimeRemaining) {
            nextSteps = this.takeManStep();
            if (nextSteps.length === 0) {
                nextSteps = this.takeBeastStep();
                if (nextSteps.length === 0) {
                    this.routeComplete();
                    return [];
                }
            }
        } else {
            nextSteps = this.takeBeastStep();
            if (nextSteps.length === 0) {
                nextSteps = this.takeManStep();
                if (nextSteps.length === 0) {
                    this.routeComplete();
                    return [];
                }
            }
        }
        return nextSteps;
    }

    takeManStep = () => {
        const nextSteps = [];
        const routeCosts = valves[this.manPosition].routeCosts;
        for (let i = 0; i < this.unopenedValves.length; i++) {
            const newManPosition = this.unopenedValves[i];
            const newManTimeRemaining = this.manTimeRemaining - routeCosts[newManPosition] - 1;
            if (newManTimeRemaining <= 0) {
                continue;
            }
            const newOpenValves = [...this.openValves].concat([newManPosition]);
            const newUnopenedValves = [...this.unopenedValves];
            newUnopenedValves.splice(i, 1);
            const newPressureReleased = this.pressureReleased + valves[newManPosition].rate * newManTimeRemaining;
            nextSteps.push(new Route(
                newPressureReleased,
                newManTimeRemaining,
                this.beastTimeRemaining,
                newManPosition,
                this.beastPosition,
                newOpenValves,
                newUnopenedValves,
            ));
        }
        return nextSteps;
    }

    takeBeastStep = () => {
        const nextSteps = [];
        const routeCosts = valves[this.beastPosition].routeCosts;
        for (let i = 0; i < this.unopenedValves.length; i++) {
            const newBeastPosition = this.unopenedValves[i];
            const newBeastTimeRemaining = this.beastTimeRemaining - routeCosts[newBeastPosition] - 1;
            if (newBeastTimeRemaining <= 0) {
                continue;
            }
            const newOpenValves = [...this.openValves].concat([newBeastPosition]);
            const newUnopenedValves = [...this.unopenedValves];
            newUnopenedValves.splice(i, 1);
            const newPressureReleased = this.pressureReleased + valves[newBeastPosition].rate * newBeastTimeRemaining;
            nextSteps.push(new Route(
                newPressureReleased,
                this.manTimeRemaining,
                newBeastTimeRemaining,
                this.manPosition,
                newBeastPosition,
                newOpenValves,
                newUnopenedValves
            ));
        }
        return nextSteps;
    }
}

const paths = new PriorityQueue((a,b) => a.pressureReleased - b.pressureReleased);
paths.enq(new Route());

// for (let i = 0; i < 4; i++) {
while (!paths.isEmpty()) {
    const pathToDevelop = paths.deq();
    const developedPaths = pathToDevelop.getNextSteps();
    developedPaths.forEach(path => paths.enq(path));
    // console.log('====================');
    // pathToDevelop.print();
    // console.log("new paths:")
    // developedPaths.forEach(path => path.print());
}

console.log(`Max Pressure Release: ${maxPossiblePressureRelease}`)
console.log(`Duration: ${Date.now() - startTime}ms`)
