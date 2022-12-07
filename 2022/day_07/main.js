import { open } from 'node:fs/promises';

class File {
    constructor(size, name) {
        this.size = size;
        this.name = name;
    }

    getSize() {
        return this.size
    }

    toString() {
        return `${this.size} {this.name}`
    }
}

class Directory {
    constructor(name, parent) {
        this.name = name
        this.parent = parent
        this.children = []
    }

    addFile(size, name) {
        this.children.push(new File(parseInt(size), name))
    }

    getFiles() {
        return this.children.filter(child => child instanceof File)
    }

    addDirectory(name) {
        this.children.push(new Directory(name, this))
    }

    getChildDirectories() {
        return this.children.filter(child => child instanceof Directory)
    }

    getAllDirectories() {
        const getChildDirs = (dir) => {
            return [...dir.getChildDirectories(), ...dir.getChildDirectories().flatMap(d => getChildDirs(d))]
        }

        return getChildDirs(this)
    }

    getSize() {
        return this.children.reduce((sum, child) => sum + child.getSize(), 0)
    }
}

class FileSystem {
    constructor() {
        this.root = new Directory('/', null)
        this.currentDirectory = this.root
    }

    changeDirectory(name) {
        if (name === '/') {
            this.currentDirectory = this.root
            return;
        }

        if (name === '..') {
            this.currentDirectory = this.currentDirectory.parent
            return;
        }


        const newDir = this.currentDirectory.getChildDirectories().find(dir => dir.name === name)
        if (newDir) {
            this.currentDirectory = newDir
        } else {
            console.warn('could not find', name)
        }
    }

    toString() {

    }
}

const extractDirectoryFromCdCommand = (string) => string.match(/^\$ cd (.*)/)?.[1]
const isFile = (string) => /^\d+/.test(string)
const isDir = (string) => /^dir/.test(string)


const input = await open('./input.txt');
const fs = new FileSystem()

for await (const line of input.readLines()) {
    const newDir = extractDirectoryFromCdCommand(line)
    if (!!newDir) {
        fs.changeDirectory(newDir)
    } else {
        const [sizeOrDirKeyword, name] = line.split(' ')
        if (isFile(line)) {
            fs.currentDirectory.addFile(sizeOrDirKeyword, name)
        }

        if (isDir(line)) {
            fs.currentDirectory.addDirectory(name)
        }
    }
}

// Part 1
const sum = fs.root.getAllDirectories().reduce((sum, dir) => {
    const size = dir.getSize()
    return sum + (size > 100_000 ? 0 : size)
}, 0)
console.log('Total size of dirs not exceeding 100_000:', sum);

// Part 2
const sortedDirs = fs.root.getAllDirectories().sort((a, b) => a.getSize() - b.getSize())
const totalSize = fs.root.getSize();
const sizeToFree = totalSize - (70_000_000 - 30_000_000);
const dirToDelete = sortedDirs.find(dir => dir.getSize() > sizeToFree);
console.log('Total size of directory to be deleted:', dirToDelete.getSize());

