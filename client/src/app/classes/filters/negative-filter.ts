import { Filter } from './filter';

export class NegativeFilter extends Filter {
    changeRGBValue(value: number): number {
        return 255 - value;
    }
}
