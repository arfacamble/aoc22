import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('19/data.txt');
const example = readDataAsArray('19/example.txt');

// const input = example;
const input = data;

const blueprints = [];

input.forEach(line => {
    let [id, robotCosts] = line.split(':');
    const blueprint = { robotCosts: {ore: {}, clay: {}, obsidian: {}, geode: {}} };
    blueprint.id = parseInt(id.split(' ')[1], 10);
    robotCosts = robotCosts.split('.');
    const oreRobotCost = parseInt(robotCosts[0].split('costs ')[1].split(' ')[0], 10);
    blueprint.robotCosts.ore.ore = oreRobotCost;
    const clayRobotCost = parseInt(robotCosts[1].split('costs ')[1].split(' ')[0], 10);
    blueprint.robotCosts.clay.ore = clayRobotCost;
    const [obsidianRobotOreCost, obsidianRobotClayCost] =
        robotCosts[2]
            .split('costs ')[1]
            .split(' and ')
            .map(cost => parseInt(cost.split(' ')[0], 10));
    blueprint.robotCosts.obsidian.ore = obsidianRobotOreCost;
    blueprint.robotCosts.obsidian.clay = obsidianRobotClayCost;
    const [geodeRobotOreCost, geodeRobotObsidianCost] =
        robotCosts[3]
            .split('costs ')[1]
            .split(' and ')
            .map(cost => parseInt(cost.split(' ')[0], 10));
    blueprint.robotCosts.geode.ore = geodeRobotOreCost;
    blueprint.robotCosts.geode.obsidian = geodeRobotObsidianCost;
    blueprints.push(blueprint);
})

// console.log(blueprints);

class Situation {
    constructor(timeRemaining, robots, resources) {
        this.timeRemaining = timeRemaining,
        this.robots = robots,
        this.resources = resources
    }

    gatherResources = () => {
        for (const [type, count] of Object.entries(this.robots)) {
            this.resources[type] += count;
        }
        return this;
    }

    timePasses = () => {
        this.timeRemaining -= 1;
        return this;
    }

    buyRobot = (type, costs) => {
        this.robots[type] += 1;
        for (const [resourceType, cost] of Object.entries(costs)) {
            this.resources[resourceType] -= cost;
        }
    }

    clone = () => {
        return new Situation(this.timeRemaining, structuredClone(this.robots), structuredClone(this.resources));
    }
}

const findMaxGeodesForBlueprint = (blueprint) => {
    let timeRemaining = 24;
    const robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
    const resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const maxUsefulOreQuantity = Math.max(...Object.values(blueprint.robotCosts).map(robotCost => robotCost.ore));
    const maxUsefulResourceQuantities = {
        ore: maxUsefulOreQuantity,
        clay: blueprint.robotCosts.obsidian.clay,
        obsidian: blueprint.robotCosts.geode.obsidian,
        geode: Infinity 
    }
    const situations = [new Situation(timeRemaining, robots, resources)]
    let maxGeodes = 0;
    let iterationCount = 0;
    const debugPrint = false;
    // for (let i = 0; i < 5; i++) {
    while (situations.length > 0) {
        const situation = situations.shift();
        if (situation.timeRemaining === 1) {
            situation.gatherResources();
            const geodeCount = situation.resources.geode;
            if (geodeCount > maxGeodes) {
                maxGeodes = geodeCount;
            }
            continue;
        }
        let affordableRobots = [];
        for (const [robotType, costs] of Object.entries(blueprint.robotCosts)) {
            const affordable = Object.keys(costs).every(type => situation.resources[type] >= costs[type]);
            if (affordable) {
                affordableRobots.push(robotType);
            }
        }
        if (debugPrint) {
            console.log('=====================');
            console.log(situation);
            console.log(blueprint.robotCosts)
            console.log(affordableRobots);
        }
        if (affordableRobots.includes('geode')) {
            situation
                .gatherResources()
                .timePasses();
            situation.buyRobot('geode', blueprint.robotCosts.geode);
            situations.push(situation);
            if (debugPrint) {console.log(situation);}
            continue;
        }
        if (affordableRobots.includes('obsidian') && situation.robots.obsidian < maxUsefulResourceQuantities.obsidian) {
            situation
                .gatherResources()
                .timePasses();
            situation.buyRobot('obsidian', blueprint.robotCosts.obsidian);
            situations.push(situation);
            if (debugPrint) {console.log(situation);}
            continue;
        }
        if (situation.resources.ore < maxUsefulOreQuantity) {
            const noNewRobotsSituation = situation.clone()
                .gatherResources()
                .timePasses();
            situations.push(noNewRobotsSituation);
            if (debugPrint) {console.log(noNewRobotsSituation);}
        }
        for (const type of affordableRobots) {
            if (situation.robots[type] >= maxUsefulResourceQuantities[type]) {
                continue;
            }
            const newSituation = situation.clone();
            newSituation
                .gatherResources()
                .timePasses();
            newSituation.buyRobot(type, blueprint.robotCosts[type])
            situations.push(newSituation);
            if (debugPrint) {console.log(newSituation);}
        }
        // console.log(situations);
        iterationCount += 1;
    }
    return maxGeodes;
}

const startTime = Date.now();

let answer = 0;

blueprints.forEach(bp => {
    const geodes = findMaxGeodesForBlueprint(bp);
    const qualityLevel = geodes * bp.id;
    console.log(qualityLevel)
    answer += qualityLevel;
})

console.log(`duration: ${Date.now() - startTime}ms`);
console.log(answer);

// 1786 too low