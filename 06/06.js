import {readFileAsString} from '../readData.js';

const data = readFileAsString('06/data.txt');

const example1 = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb';
const example2 = 'bvwbjplbgvbhsrlpgdmjqwftvncz';
const example3 = 'nppdvjthqldpwncqszvftbrmjlhg';
const example4 = 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg';
const example5 = 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw';

const findMarker = (stream, uniqueCharactersLength) => {
    const chars = stream.split('');
    const lastChars = [];
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        lastChars.push(char);
        if (lastChars.length < uniqueCharactersLength) {
            continue;
        }
        if (lastChars.length > uniqueCharactersLength) {
            lastChars.shift();
        }
        if (new Set(lastChars).size === uniqueCharactersLength) {
            return i + 1;
        }        
    }
}

console.log(findMarker(example1, 14));
console.log(findMarker(example2, 14));
console.log(findMarker(example3, 14));
console.log(findMarker(example4, 14));
console.log(findMarker(example5, 14));
console.log(findMarker(data, 14));