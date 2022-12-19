export type Char = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
export type ValveID = `${Char}${Char}`

export class Move {
    constructor(public target: ValveID) { }
}

export class Open {
    constructor(public target: ValveID) { }
}

export class Noop {
}

export type Action = Move | Open | Noop

export const example = [
    new Move('DD'), new Open('DD'), new Move('CC'), new Move('BB'), new Open('BB'), new Move('AA'), new Move('II'), new Move('JJ'), new Open('JJ'), new Move('II'), new Move('AA'), new Move('DD'), new Move('EE'), new Move('FF'), new Move('GG'), new Move('HH'), new Open('HH'), new Move('GG'), new Move('FF'), new Move('EE'), new Open('EE'), new Move('DD'), new Move('CC'), new Open('CC'), new Noop(), new Noop(), new Noop(), new Noop(), new Noop(), new Noop(),
]