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
    const maxUsefulOreQuantity = Math.max(...Object.values(blueprint.robotCosts).map(robotCost => robotCost.ore));
    const maxUsefulResourceQuantities = {
        ore: maxUsefulOreQuantity,
        clay: blueprint.robotCosts.obsidian.clay,
        obsidian: blueprint.robotCosts.geode.obsidian,
        geode: Infinity 
    }
    blueprint.maxUsefulResourceQuantities = maxUsefulResourceQuantities;
    blueprints.push(blueprint);
})

// console.log(blueprints);

class Situation {
    constructor(timeRemaining, robots, resources) {
        this.timeRemaining = timeRemaining,
        this.robots = robots,
        this.resources = resources
    }

    gatherResourcesUntilTimeout = () => {
        while (this.timeRemaining > 0) {
            this.gatherResources();
            this.timePasses();
        }
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

    getTimeToAfford = (costs) => {
        const timesByResource = Object.entries(costs).map(([type, cost]) => {
            const moreNeeded = cost - this.resources[type];
            if (moreNeeded <= 0) { return 0; }
            return Math.ceil(moreNeeded / this.robots[type]);
        })
        return Math.max(...timesByResource);
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

    veryOptimisticMaxGeodeCount = () => {
        let geodeCount = this.resources.geode;
        let geodeRobotCount = this.robots.geode;
        let timeRemaining = this.timeRemaining;
        while (timeRemaining) {
            geodeCount += geodeRobotCount;
            geodeRobotCount += 1;
            timeRemaining -= 1;
        }
        return geodeCount;
    }

    print = () => {
        console.log(`time remaining: ${this.timeRemaining}`)
        const robotsString = Object.entries(this.robots).map(([type, count]) => `${type}: ${count}`).join(', ');
        console.log(`robots: ${robotsString}`)
        const resourcesString = Object.entries(this.resources).map(([type, count]) => `${type}: ${count}`).join(', ');
        console.log(`resources: ${resourcesString}`)
    }
}

const developSituation = (situation, blueprint, largestGeodeCountSoFar) => {
    const debugPrint = false;
    if (debugPrint) {
        console.log(`================max geodes: ${largestGeodeCountSoFar}=====`);
        situation.print();
        console.log(blueprint.robotCosts);
    }
    if (situation.veryOptimisticMaxGeodeCount() < largestGeodeCountSoFar) {
        return [];
    }
    const nextPurchases = [];
    if (situation.robots.ore < blueprint.maxUsefulResourceQuantities.ore) {
        nextPurchases.push('ore');
    }
    if (situation.robots.clay < blueprint.maxUsefulResourceQuantities.clay) {
        nextPurchases.push('clay');
    }
    if (situation.robots.clay > 0
        && situation.robots.obsidian < blueprint.maxUsefulResourceQuantities.obsidian) {
        nextPurchases.push('obsidian');
    }
    if (situation.robots.obsidian > 0) {
        nextPurchases.push('geode');
    }
    const nextSteps = nextPurchases.reduce((resultingSituations, type) => {
        const timeUntilCanAfford = situation.getTimeToAfford(blueprint.robotCosts[type]);
        if (debugPrint) {
            console.log(nextPurchases);
            console.log(`type: ${type}, afford in ${timeUntilCanAfford}`)
        }
        if (timeUntilCanAfford < situation.timeRemaining) {
            const newSituation = situation.clone();
            for (let time = 0; time <= timeUntilCanAfford; time++) {
                newSituation.gatherResources();
                newSituation.timePasses();
            }
            newSituation.buyRobot(type, blueprint.robotCosts[type]);
            resultingSituations.push(newSituation);
        }
        return resultingSituations;
    }, [])
    if (nextSteps.length === 0) {
        situation.gatherResourcesUntilTimeout();
        nextSteps.push(situation);
    }
    if (debugPrint) {
        nextSteps.forEach(sit => sit.print());
    }
    return nextSteps;
}

const findMaxGeodesForBlueprint = (blueprint) => {
    let timeRemaining = 24;
    const robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
    const resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    const situations = [new Situation(timeRemaining, robots, resources)]
    let maxGeodes = 0;
    const debugPrint = false;
    while (situations.length > 0) {
        const situation = situations.pop();
        const newSituations = developSituation(situation, blueprint, maxGeodes);
        const incompleteSituations = newSituations.reduce((array, situation) => {
            if (situation.timeRemaining === 0) {
                const geodeCount = situation.resources.geode;
                maxGeodes = Math.max(maxGeodes, geodeCount);
            } else {
                array.push(situation);
            }
            return array;
        }, [])
        situations.push(...incompleteSituations);
    }
    return maxGeodes;
}

const startTime = Date.now();

let answer = 0;

blueprints.forEach(bp => {
    const geodes = findMaxGeodesForBlueprint(bp);
    // console.log(`blueprint ${bp.id} - ${geodes} geodes found`)
    const qualityLevel = geodes * bp.id;
    // console.log(qualityLevel)
    answer += qualityLevel;
})

console.log(`duration: ${Date.now() - startTime}ms`);
console.log(answer);
