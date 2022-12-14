import {readFileSync} from 'fs';

export const readDataAsArray = (fileName) => {
    const contents = readFileSync(fileName, 'utf-8');
    const arr = contents.split(/\r?\n/);
    return arr;
}

export const readFileAsString = (fileName) => {
    return readFileSync(fileName, 'utf-8');
}

export const splitOnDoubleLineBreak = (string) => {
    return string.split(/[\r|\n]{3}/);
}

export const splitOnLineBreak = (string) => {
    return string.split(/\r?\n/);
}