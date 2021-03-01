import { Filter } from './filter';

export class NegativeFilter extends Filter {
    changeRGBValue(value: number): number {
        return Filter.MAX_RBGA_VALUE - value;
    }
}
