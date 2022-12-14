import {readDataAsArray} from '../readData.js';
import Graph from 'node-dijkstra';

const data = readDataAsArray('12/data.txt');
const example = readDataAsArray('12/example.txt');

const input = data;

const map = input.map(line => line.split(''));

const graph = new Graph();

let startCoordinate;
const startCoordinates = [];
let destinationCoordinate;

const findNeighbours = (x, y, height) => {
    const neighbours = {};
    const locationHeightCode = height.charCodeAt();
    let potentialNeighbours = [
        [x-1, y],
        [x+1, y],
        [x, y-1],
        [x, y+1]
    ]
    potentialNeighbours = potentialNeighbours.filter(c => c[0] >= 0 && c[0] < map.length && c[1] >= 0 && c[1] < map[0].length);
    potentialNeighbours.forEach(neighbour => {
        const neighbourHeightCode = map[neighbour[0]][neighbour[1]].charCodeAt();
        if ((neighbourHeightCode >= 97 && neighbourHeightCode <= locationHeightCode + 1)
        || (neighbourHeightCode === 69 && locationHeightCode >= 121)
        || (locationHeightCode === 83 && neighbourHeightCode <= 98)) {
            neighbours[neighbour.toString()] = 1;
        }
    })
    return neighbours;
}

for (let x = 0; x < map.length; x++) {
    const xLine = map[x];
    for (let y = 0; y < xLine.length; y++) {
        let height = xLine[y];
        const key = [x,y].toString();
        const neighbours = findNeighbours(x, y, height);
        switch (height) {
            // // part 1
            // case 'S':
            //     startCoordinate = key;
            //     break;
            // part 2
            case 'a':
            case 'S':
                startCoordinates.push(key);
                break;
            case 'E':
                destinationCoordinate = key;
                break;
        }
        graph.addNode(key, neighbours)
    }
}

// // part 1
// console.log(graph.path(startCoordinate, destinationCoordinate, { cost: true }));

// part 2
let lowestCost = Infinity;

startCoordinates.forEach(start => {
    const cost = graph.path(start, destinationCoordinate, { cost: true }).cost;
    // console.log(`from ${start}, cost: ${cost}`)
    lowestCost = (cost !== 0 && cost < lowestCost) ? cost : lowestCost;
})

console.log(lowestCost);