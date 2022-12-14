import {readDataAsArray} from '../readData.js';

let data = readDataAsArray('08/data.txt');
let example = readDataAsArray('08/example.txt');

const countVisibleTrees = (data) => {
    const treeMap = data.map(row => row.split('').map(height => parseInt(height, 10)));
    const tallestTrees = { left0: 0 };
    const visibleTrees = { '0,0': true };
    treeMap.forEach((row, rowIndex) => {
        row.forEach((height, colIndex) => {
            const treeCoordinate = `${rowIndex},${colIndex}`;

            // looking from the left
            const leftRowName = `left${rowIndex}`;
            let tallestTreeFromLeftSoFar = tallestTrees[leftRowName];
            if (tallestTreeFromLeftSoFar === undefined) {
                tallestTrees[leftRowName] = 0;
                tallestTreeFromLeftSoFar = 0;
                visibleTrees[treeCoordinate] = true;
            }
            if (height > tallestTreeFromLeftSoFar) {
                tallestTrees[leftRowName] = height;
                visibleTrees[treeCoordinate] = true;
            }

            // looking from the top
            const topColumnName = `top${colIndex}`;
            let tallestTreeFromTopSoFar = tallestTrees[topColumnName];
            if (tallestTreeFromTopSoFar === undefined) {
                tallestTrees[topColumnName] = 0;
                tallestTreeFromTopSoFar = 0;
                visibleTrees[treeCoordinate] = true;
            }
            if (height > tallestTreeFromTopSoFar) {
                tallestTrees[topColumnName] = height;
                visibleTrees[treeCoordinate] = true;
            }
        })
    })

    for (let rowIndex = treeMap.length - 1; rowIndex >= 0; rowIndex--) {
        const row = treeMap[rowIndex];
        for (let colIndex = row.length - 1; colIndex >= 0; colIndex--) {
            const height = row[colIndex];
            const treeCoordinate = `${rowIndex},${colIndex}`;
            
            // looking from the right
            const rightRowName = `right${rowIndex}`;
            let tallestTreeFromRightSoFar = tallestTrees[rightRowName];
            if (tallestTreeFromRightSoFar === undefined) {
                tallestTrees[rightRowName] = 0;
                tallestTreeFromRightSoFar = 0;
                visibleTrees[treeCoordinate] = true;
            }
            if (height > tallestTreeFromRightSoFar) {
                tallestTrees[rightRowName] = height;
                visibleTrees[treeCoordinate] = true;
            }

            // looking from the bottom
            const bottomColumnName = `bottom${colIndex}`;
            let tallestTreeFromBottomSoFar = tallestTrees[bottomColumnName];
            if (tallestTreeFromBottomSoFar === undefined) {
                tallestTrees[bottomColumnName] = 0;
                tallestTreeFromBottomSoFar = 0;
                visibleTrees[treeCoordinate] = true;
            }
            if (height > tallestTreeFromBottomSoFar) {
                tallestTrees[bottomColumnName] = height;
                visibleTrees[treeCoordinate] = true;
            }
        }
    }

    return visibleTrees;
}

const visibleFromTopAndLeft = countVisibleTrees(data);
console.log(Object.entries(visibleFromTopAndLeft).length);

const findBestTreeHouseLocation = (data) => {
    const treeMap = data.map(row => row.split('').map(height => parseInt(height, 10)));
    let bestTreeScore = 0;

    for (let rowIndex = 1; rowIndex < treeMap.length - 1; rowIndex++) {
        const row = treeMap[rowIndex];
        for (let colIndex = 1; colIndex < row.length - 1; colIndex++) {
            // console.log(`--------------------\ncoordinate: ${rowIndex}, ${colIndex}`)
            const height = row[colIndex];
            const horizon = {left: 0, up: 0, right: 0, down: 0};

            let currentCoordinateCheck = {row: rowIndex, col: colIndex};
            let lookingLeft = true;
            while (lookingLeft) {
                currentCoordinateCheck['col'] -= 1;
                if (currentCoordinateCheck['col'] < 0) {
                    lookingLeft = false;
                } else {
                    const currentCoordinateCheckHeight = treeMap[currentCoordinateCheck['row']][currentCoordinateCheck['col']];
                    horizon['left'] += 1;
                    if (currentCoordinateCheckHeight >= height) {
                        lookingLeft = false;
                    }
                }
            }

            currentCoordinateCheck = {row: rowIndex, col: colIndex};
            let lookingUp = true;
            while (lookingUp) {
                currentCoordinateCheck['row'] -= 1;
                if (currentCoordinateCheck['row'] < 0) {
                    lookingUp = false;
                } else {
                    const currentCoordinateCheckHeight = treeMap[currentCoordinateCheck['row']][currentCoordinateCheck['col']];
                    horizon['up'] += 1;
                    if (currentCoordinateCheckHeight >= height) {
                        lookingUp = false;
                    }
                }
            }

            currentCoordinateCheck = {row: rowIndex, col: colIndex};
            let lookingRight = true;
            while (lookingRight) {
                currentCoordinateCheck['col'] += 1;
                if (currentCoordinateCheck['col'] === row.length) {
                    lookingRight = false;
                } else {
                    const currentCoordinateCheckHeight = treeMap[currentCoordinateCheck['row']][currentCoordinateCheck['col']];
                    horizon['right'] += 1;
                    if (currentCoordinateCheckHeight >= height) {
                        lookingRight = false;
                    }
                }
            }

            currentCoordinateCheck = {row: rowIndex, col: colIndex};
            let lookingDown = true;
            while (lookingDown) {
                currentCoordinateCheck['row'] += 1;
                if (currentCoordinateCheck['row'] === treeMap.length) {
                    lookingDown = false;
                } else {
                    const currentCoordinateCheckHeight = treeMap[currentCoordinateCheck['row']][currentCoordinateCheck['col']];
                    horizon['down'] += 1;
                    if (currentCoordinateCheckHeight >= height) {
                        lookingDown = false;
                    }
                }
            }

            const scenicScore = Object.values(horizon).reduce((a,b) => a*b);
            bestTreeScore = scenicScore > bestTreeScore ? scenicScore : bestTreeScore;
        }
    }
    return bestTreeScore;
}

const bestScore = findBestTreeHouseLocation(data);

console.log(bestScore);