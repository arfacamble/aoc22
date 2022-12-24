import {readDataAsArray} from '../readData.js';

const startTime = Date.now();

const data = readDataAsArray('24/data.txt').map(line => line.split(''));
const example = readDataAsArray('24/example.txt').map(line => line.split(''));

// const input = example;
const input = data;

class BlizzardsInPosition {
    constructor(direction) {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.upIncoming = false;
        this.downIncoming = false;
        this.leftIncoming = false;
        this.rightIncoming = false;
        switch (direction) {
            case '^':
                this.up = true
                break;
            case '>':
                this.right = true
                break;
            case '<':
                this.left = true
                break;
            case 'v':
                this.down = true
                break;
        }
    }

    positionIsFree = () => {
        return (!this.up
        && !this.down
        && !this.left
        && !this.right);
    }

    completeMove = () => {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        if (this.upIncoming) {
            this.up = true;
            this.upIncoming = false;
        }
        if (this.downIncoming) {
            this.down = true;
            this.downIncoming = false;
        }
        if (this.leftIncoming) {
            this.left = true;
            this.leftIncoming = false;
        }
        if (this.rightIncoming) {
            this.right = true;
            this.rightIncoming = false;
        }
    }

    toPrint = () => {
        const blizzards = [this.up, this.down, this.left, this.right].filter(dir => dir);
        if (blizzards.length > 1) {
            return blizzards.length;
        } else if (blizzards.length === 0) {
            return '.';
        } else if (this.up) {
            return '^';
        } else if (this.down) {
            return 'v';
        } else if (this.left) {
            return '<';
        } else if (this.right) {
            return '>';
        }
    }
}

const blizzardMap = [];

for (let y = 1; y < input.length - 1; y++) {
    const row = input[y];
    blizzardMap[y - 1] = [];
    for (let x = 1; x < row.length - 1; x++) {
        const blizzardDirection = row[x];
        blizzardMap[y-1][x-1] = new BlizzardsInPosition(blizzardDirection)
    }
}

const mapDimensions = {
    height: blizzardMap.length,
    width: blizzardMap[0].length
}

const goal = {
    x: blizzardMap[0].length - 1,
    y: blizzardMap.length
}

const startPoint = {
    x: 0,
    y: -1
}

const printBlizzardMap = () => {
    console.log('=============================')
    const topRow = new Array(blizzardMap[0].length + 2).fill('#');
    topRow[1] = '_';
    console.log(topRow.join(''));
    for (const row of blizzardMap) {
        let rowString = '#';
        for (const position of row) {
            rowString += position.toPrint();
        }
        rowString += '#';
        console.log(rowString);
    }
    const bottomRow = new Array(blizzardMap[0].length + 2).fill('#');
    bottomRow[bottomRow.length - 2] = '!';
    console.log(bottomRow.join(''));
    console.log(' ')
}

// printBlizzardMap();
// console.log(mapDimensions);
// console.log(goal);

const blizzardsMove = () => {
    for (let y = 0; y < blizzardMap.length; y++) {
        const row = blizzardMap[y];
        for (let x = 0; x < row.length; x++) {
            const blizzards = row[x];
            if (blizzards.up) {
                const newY = (y + mapDimensions.height - 1) % mapDimensions.height;
                blizzardMap[newY][x].upIncoming = true;
            }
            if (blizzards.down) {
                const newY = (y + 1) % mapDimensions.height;
                blizzardMap[newY][x].downIncoming = true;
            }
            if (blizzards.left) {
                const newX = (x + mapDimensions.width - 1) % mapDimensions.width;
                blizzardMap[y][newX].leftIncoming = true;
            }
            if (blizzards.right) {
                const newX = (x + 1) % mapDimensions.width;
                blizzardMap[y][newX].rightIncoming = true;
            }
        }
    }
    for (let y = 0; y < blizzardMap.length; y++) {
        const row = blizzardMap[y];
        for (let x = 0; x < row.length; x++) {
            const blizzards = row[x];
            blizzards.completeMove();
        }
    }
}

const isGoal = (coord) => coord.x === goal.x && coord.y === goal.y;
const isStartPoint = (coord) => coord.x === startPoint.x && coord.y === startPoint.y;

const isInBounds = (coord) => {
    return isGoal(coord)
        || isStartPoint(coord)
        || coord.x >= 0 && coord.x < mapDimensions.width && coord.y >= 0 && coord.y < mapDimensions.height;
}

const nextPositions = (position) => {
    return [
        { x: position.x, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 }
    ].filter(coord => isInBounds(coord));
}

const situationsAreDuplicate = (situationOne, situationTwo) => situationOne.x === situationTwo.x && situationOne.y === situationTwo.y;

const distanceToGoal = (coord) => (goal.x - coord.x) + (goal.y - coord.y);

const distanceToStart = (coord) => (coord.x - startPoint.x) + (coord.y - startPoint.y);

const startToGoal = (startTime) => {
    let situations = [
        {
            timePassed: startTime,
            y: startPoint.y,
            x: startPoint.x
        }
    ]

    let quickestJourneyTime = Infinity;
    while (situations.length > 0) {
        blizzardsMove();
        // printBlizzardMap();
        // console.log(situations);
        const newSituations = [];
        situations.forEach(situation => {
            // console.log('~~~~~~~~~~')
            // console.log(situation);
            const moveOptions = nextPositions(situation).filter(coord => {
                return isGoal(coord) || isStartPoint(coord) || blizzardMap[coord.y][coord.x].positionIsFree();
            });
            // console.log(moveOptions);
            moveOptions.forEach(option => option.timePassed = situation.timePassed + 1);
            for (let i = 0; i < moveOptions.length; i++) {
                const option = moveOptions[i];
                if (isGoal(option)) {
                    if (option.timePassed < quickestJourneyTime) { quickestJourneyTime = option.timePassed }
                    continue;
                }
                const quickestPossibleEscapeTime = option.timePassed + distanceToGoal(option);
                if (quickestPossibleEscapeTime > quickestJourneyTime) {
                    continue;
                }
                if (newSituations.every(newSituation => !situationsAreDuplicate(option, newSituation))) {
                    newSituations.push(option);
                }
            }
        })
        situations = newSituations;
    }
    return quickestJourneyTime;
}

const goalToStart = (startTime) => {
    let situations = [
        {
            timePassed: startTime,
            y: goal.y,
            x: goal.x
        }
    ]

    let quickestJourneyTime = Infinity;
    while (situations.length > 0) {
        blizzardsMove();
        // printBlizzardMap();
        // console.log(situations);
        const newSituations = [];
        situations.forEach(situation => {
            // console.log('~~~~~~~~~~')
            // console.log(situation);
            const moveOptions = nextPositions(situation).filter(coord => {
                return isGoal(coord) || isStartPoint(coord) || blizzardMap[coord.y][coord.x].positionIsFree();
            });
            // console.log(moveOptions);
            moveOptions.forEach(option => option.timePassed = situation.timePassed + 1);
            for (let i = 0; i < moveOptions.length; i++) {
                const option = moveOptions[i];
                if (isStartPoint(option)) {
                    if (option.timePassed < quickestJourneyTime) { quickestJourneyTime = option.timePassed }
                    continue;
                }
                const quickestPossibleEscapeTime = option.timePassed + distanceToStart(option);
                if (quickestPossibleEscapeTime > quickestJourneyTime) {
                    continue;
                }
                if (newSituations.every(newSituation => !situationsAreDuplicate(option, newSituation))) {
                    newSituations.push(option);
                }
            }
        })
        situations = newSituations;
    }
    return quickestJourneyTime;
}
let timeSoFar;
console.log(`quickest first journey time: ${(timeSoFar = startToGoal(0))}`);
console.log(`quickest to get back: ${(timeSoFar = goalToStart(timeSoFar + 1))}`)
console.log(`quickest to go again: ${(timeSoFar = startToGoal(timeSoFar + 1))}`)
console.log(`Duration: ${Date.now() - startTime}ms`)