import * as seedrandom from 'seedrandom';

export interface Prng {
    (): number;
    double(): number;
    int32(): number;
    quick(): number;
    state(): seedrandom.State;
}
