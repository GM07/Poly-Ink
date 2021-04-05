import { SliderValues } from './slider';

export interface SliderBandOptions {
    id: number;
    color: string;
    min: number;
    max: number;
    changed: (v: SliderValues) => void;
    step: number;
    container: string;
    radius: number;
}

export interface SliderBand {
    id: number;
    container: HTMLElement;
    color: string;
    min: number;
    max: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    onValueChangeCallback: (v: SliderValues) => void;
    angDegrees: number;
    normalizedValue: number;
    step: number;
}
