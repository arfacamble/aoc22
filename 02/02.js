import {readDataAsArray} from '../readData.js';

const data = readDataAsArray('02/data.txt').map((line) => line.split(' '));

// part 1

const resultsMap = {
    'X': {
        'A': 3,
        'B': 0,
        'C': 6
    },
    'Y': {
        'A': 6,
        'B': 3,
        'C': 0
    },
    'Z': {
        'A': 0,
        'B': 6,
        'C': 3
    }
}

let totalScore = 0;

data.forEach((game) => {
    let score = 0;
    score += resultsMap[game[1]][game[0]];
    switch (game[1]) {
        case 'X':
            score += 1;
            break;
        case 'Y':
            score += 2;
            break;
        case 'Z':
            score += 3;
            break;
    }
    totalScore += score;
});

console.log(totalScore);

// part 2

const getMyPlay = {
    'A': {
        'X': 3,
        'Y': 1,
        'Z': 2
    },
    'B': {
        'X': 1,
        'Y': 2,
        'Z': 3
      },
    'C': {
        'X': 2,
        'Y': 3,
        'Z': 1
      }
}

const processData = (data) => {
    let total2 = 0;
    data.forEach((game) => {
        let score = 0;
        score += getMyPlay[game[0]][game[1]];
        switch (game[1]) {
            case 'X':
                score += 0;
                break;
            case 'Y':
                score += 3;
                break;
            case 'Z':
                score += 6;
                break;
        }
        total2 += score;
    });
    return total2;
}

console.log(processData(data));

const example = [
    ['A', 'Y'],
    ['B', 'X'],
    ['C', 'Z']
]

// console.log(processData(example));