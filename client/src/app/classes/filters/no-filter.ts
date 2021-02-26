import { Filter } from './filter';

export class NoFilter implements Filter {
    apply(image: ImageData): void {
        return;
    }
}
