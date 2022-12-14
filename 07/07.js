import {readFileAsString} from '../readData.js';

let data = readFileAsString('07/data.txt');
let example = readFileAsString('07/example.txt');

const splitByCommand = input => input.split('$').map(chunk => chunk.trim().split(/\r?\n/)).slice(1);

data = splitByCommand(data);
example = splitByCommand(example);

class Directory {
    constructor(name, parentDir) {
        this.name = name;
        this.parentDir = parentDir;
        this.files = [];
        this.childDirectories = [];
    }
}

class File {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
}

const createChildren = (directory, children) => {
    children.forEach(child => {
        const parts = child.split(' ');
        if (parts[0] === 'dir') {
            directory.childDirectories.push(new Directory(parts[1], directory));
        } else {
            directory.files.push(new File(parts[1], parseInt(parts[0], 10)))
        }
    })
}

const processTerminalOutput = (output) => {
    const root = new Directory('/');
    let currentDirectory = root;
    for (let i = 1; i < output.length; i++) {
        // console.log(`---------- \ncurrent dir ${currentDirectory.name}`)
        const commandAndResponse = output[i];
        const command = commandAndResponse.shift();
        // console.log(command);
        if (command === 'ls') {
            createChildren(currentDirectory, commandAndResponse);
            // console.log(currentDirectory);
        } else {
            const newDirectoryName = command.split(' ')[1];
            const newDirectory = (newDirectoryName === '..')
                ? currentDirectory.parentDir
                : currentDirectory.childDirectories.find(dir => dir.name === newDirectoryName);
            currentDirectory = newDirectory;
        }
    }
    return root;
}

const printDirectory = (dir) => {
    console.log(dir.name);
    const fileNames = dir.files.map(file => ` ${file.name}(${file.size})`);
    console.log(`files: ${fileNames}`);
    dir.childDirectories.forEach(dir => printDirectory(dir));
}

// const root = processTerminalOutput(example);
const root = processTerminalOutput(data);
printDirectory(root);

const sizesMaxHunThou = [];
const extraMemNeeded = 1518953;
let smallestLargeEnoughDirectorySize = 999999999999;

const sizeOfFilesOnly = (dir) => {
    const fileSizes = dir.files.map(file => file.size);
    if (fileSizes.length === 0) {
        return 0;
    } else if (fileSizes.length === 1) {
        return fileSizes[0];
    } else {
        return fileSizes.reduce((a,b) => a + b);
    }
}

const findSizeOfDirectory = (dir) => {
    console.log('--------\n' + dir.name);
    let fileSizeTotal = sizeOfFilesOnly(dir);
    console.log(`files: ${fileSizeTotal}`);
    dir.childDirectories.forEach(child => {
        const size = findSizeOfDirectory(child);
        console.log(`and add child ${child.name} of dir ${dir.name} at ${size}`)
        fileSizeTotal += size;
    })
    if (fileSizeTotal <= 100000) {
        sizesMaxHunThou.push(fileSizeTotal);
    }
    console.log(fileSizeTotal);
    if (fileSizeTotal >= extraMemNeeded && fileSizeTotal < smallestLargeEnoughDirectorySize) {
        smallestLargeEnoughDirectorySize = fileSizeTotal;
    }
    return fileSizeTotal;
}

const totalMemInUse = findSizeOfDirectory(root);
// const extraMemNeeded = totalMemInUse - 40000000;

console.log(sizesMaxHunThou);
console.log(sizesMaxHunThou.reduce((a, b) => a + b));
console.log(`smallest but LARGE ENOUGH --- ${smallestLargeEnoughDirectorySize}`)