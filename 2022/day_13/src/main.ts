import { open } from 'node:fs/promises';

type PacketData = number | number[]
type Packet = PacketData[]
enum ComparisonResult {
    RightOrder = -1,
    Equal = 0,
    WrongOrder = 1
}

const isNumber = (x: any): x is number => typeof x === 'number'
const isNumberArray = (x: any): x is number[] => typeof x?.length === 'number'
const isUndefined = (x: any): x is undefined => typeof x === 'undefined'

const compare = (left: PacketData | Packet, right: PacketData | Packet, debug: boolean = false): ComparisonResult => {
    if (isUndefined(left)) {
        debug && console.log(left, right, 'left ran out');
        return ComparisonResult.RightOrder
    }

    if (isUndefined(right)) {
        debug && console.log(left, right, 'right ran out');
        return ComparisonResult.WrongOrder
    }

    if (isNumber(left) && isNumber(right)) {
        if (left < right) {
            return ComparisonResult.RightOrder
        } else if (left > right) {
            return ComparisonResult.WrongOrder
        } else {
            return ComparisonResult.Equal
        }
    } else if (isNumberArray(left) && isNumberArray(right)) {
        debug && console.log(left, right, 'recurse');
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            const result = compare(left[i], right[i], debug)
            if (result != ComparisonResult.Equal) {
                return result
            }
        }
        return ComparisonResult.Equal
    } else {
        debug && console.log('mixed types, convert');
        const l2 = isNumberArray(left) ? left : [left as number]
        const r2 = isNumberArray(right) ? right : [right as number]
        return compare(l2, r2, debug)
    }
}


const file = await open(`${process.cwd()}/data/input.txt`);

const packets: Packet[] = []
for await (const line of file.readLines()) {
    if (line !== '') {
        packets.push(JSON.parse(line));
    }
}

// Part 1
const indicesInRightOrder = []

for (let i = 0; i < packets.length; i += 2) {
    const result = compare(packets[i], packets[i + 1], false)
    // console.log('--->', index + 1, ComparisonResult[result]);
    if (result === ComparisonResult.RightOrder) {
        indicesInRightOrder.push((i / 2) + 1)
    }


}

console.log('Part 1:', indicesInRightOrder.reduce((sum, x) => sum + x));


// Part 2
packets.push([[2]]);
packets.push([[6]]);
packets.sort((a, b) => compare(a, b))

console.log('Part 2:', packets.reduce((multiple, packet, index) => {
    const packetAsString = JSON.stringify(packet);
    if (packetAsString === '[[2]]' || packetAsString == '[[6]]') {
        multiple *= (index + 1)
    }
    return multiple
}, 1));
