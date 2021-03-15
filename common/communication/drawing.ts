import { DrawingData } from './drawing-data';

export class Drawing {
    image: string;
    data: DrawingData;

    constructor(data: DrawingData) {
        this.data = data;
    }
}
