// Code bases on the radiaslider package
// https://www.npmjs.com/package/@maslick/radiaslider/v/1.9.8

import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { Color } from 'src/color-picker/classes/color';
import { SliderBand, SliderBandOptions } from './slider-band';

export interface Options {
    continuousMode: boolean;
    canvasId: string;
    position: Vec2;
}

export interface SliderValues {
    rad: number;
    deg: number;
    value: number;
}

export class Slider {
    constructor(options: Options) {
        this.sliders = [];

        this.continuousMode = options.continuousMode;

        this.container = document.getElementById(options.canvasId) as HTMLCanvasElement;
        this.theBody = document.body;
        this.context = this.container.getContext('2d') as CanvasRenderingContext2D;

        this.position = options.position;

        this.mousePos = new Vec2(0, 0);

        this.rotationEventListener = this._rotation.bind(this);
        this.container.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
        this.theBody.addEventListener('mouseup', this._handleMouseUp.bind(this), false);
        this.container.addEventListener('click', this._handleClick.bind(this), false);
    }
    private sliders: SliderBand[];
    // tslint:disable:no-magic-numbers
    private readonly scaleWidth: number = 17;
    private readonly fillWidth: number = 18;
    private readonly knobWidth: number = 18;
    private readonly MATH_CONVERSION_FACTOR: number = 1.5;
    private readonly backgroundColor: string = '#' + new Color(238, 238, 238).hexString;
    private readonly knobColor: string = '#' + new Color(236, 86, 129).hexString;
    // tslint:enable:no-magic-numbers

    private readonly startAngle: number = this.MATH_CONVERSION_FACTOR * Math.PI + ToolMath.ZERO_THRESHOLD;
    private readonly endAngle: number = this.MATH_CONVERSION_FACTOR * Math.PI - ToolMath.ZERO_THRESHOLD;

    private continuousMode: boolean;
    private container: HTMLCanvasElement;
    private theBody: HTMLElement;
    private context: CanvasRenderingContext2D;

    private position: Vec2;
    private mousePos: Vec2;

    private selectedSlider: SliderBand;
    private currentSlider: SliderBand;

    // bind function doesn't return a proper type
    // tslint:disable-next-line:no-any
    private rotationEventListener: any;

    private static radToDeg(ang: number): number {
        return (ang * ToolMath.DEGREE_CONVERSION_FACTOR) / Math.PI;
    }

    private static normalizeTan(ang: number): number {
        return ang + Math.PI / 2 > 0 ? ang + Math.PI / 2 : 2 * Math.PI + ang + Math.PI / 2;
    }

    addSlider(options: SliderBandOptions): void {
        this.sliders[options.id] = {
            id: options.id,
            container: document.getElementById(options.container) as HTMLElement,
            color: options.color,
            min: options.min,
            max: options.max,
            radius: options.radius,
            startAngle: this.startAngle,
            endAngle: this.endAngle,
            onValueChangeCallback: options.changed,
            angDegrees: 0,
            normalizedValue: options.min,
            step: options.step,
        };

        const obj = this.sliders[options.id];
        this.setSliderValue(obj.id, options.min);
    }

    setSliderValue(id: number, value: number): void {
        const slider = this.sliders[id];
        if (value <= slider.min) {
            slider.endAngle = this.startAngle;
            slider.angDegrees = 0;
            slider.normalizedValue = 0;
        } else if (value >= slider.max) {
            slider.endAngle = this.endAngle;
            slider.angDegrees = ToolMath.DEGREE_CONVERSION_FACTOR * 2;
            slider.normalizedValue = slider.max;
        } else {
            slider.endAngle = (2 * Math.PI * (value - slider.min)) / (slider.max - slider.min) - Math.PI / 2;
            slider.angDegrees = Slider.radToDeg(Slider.normalizeTan(slider.endAngle));
            slider.normalizedValue = value;
        }

        this.drawAll();
    }

    private drawAll(): void {
        this.context.clearRect(0, 0, this.container.width, this.container.height);
        for (const key in this.sliders) {
            if (!this.sliders.hasOwnProperty(key)) continue;
            const obj = this.sliders[key];
            this.drawScale(obj);
            this.drawData(obj);
            this.drawArrow(obj);
            this.drawKnob(obj);
            obj.onValueChangeCallback({ rad: obj.endAngle, deg: obj.angDegrees, value: obj.normalizedValue } as SliderValues);
        }
        this.drawCenterDot();
    }

    private drawScale(slider: SliderBand): void {
        // tslint:disable-next-line:no-magic-numbers
        for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 6) {
            this.context.beginPath();
            this.context.strokeStyle = this.backgroundColor;
            // tslint:disable-next-line:no-magic-numbers
            this.context.arc(this.position.x, this.position.y, slider.radius, i, i + Math.PI / 4, false);
            this.context.lineWidth = this.scaleWidth;
            this.context.stroke();
        }
    }

    private drawCenterDot(): void {
        this.context.beginPath();
        this.context.strokeStyle = this.backgroundColor;
        this.context.arc(this.position.x, this.position.y, this.scaleWidth / 2, 0, Math.PI * 2, false);
        this.context.lineWidth = 1;
        this.context.fillStyle = this.backgroundColor;
        this.context.fill();
    }

    private drawData(slider: SliderBand): void {
        this.context.beginPath();
        this.context.strokeStyle = slider.color;
        this.context.arc(this.position.x, this.position.y, slider.radius, slider.startAngle, slider.endAngle, false);
        this.context.lineWidth = this.fillWidth;
        this.context.stroke();
    }

    private drawArrow(slider: SliderBand): void {
        this.context.beginPath();
        this.context.moveTo(this.position.x, this.position.y - slider.radius + this.scaleWidth / 2);
        this.context.lineTo(this.position.x, this.position.y - this.scaleWidth - slider.radius + this.scaleWidth / 2);
        // tslint:disable-next-line:no-magic-numbers
        this.context.lineTo(this.position.x + this.scaleWidth / 4, this.position.y - this.scaleWidth / 2 - slider.radius + this.scaleWidth / 2);
        this.context.fillStyle = this.backgroundColor;
        this.context.fill();
    }

    private drawKnob(slider: SliderBand): void {
        // Knob
        this.context.beginPath();
        this.context.strokeStyle = this.knobColor;
        this.context.arc(
            Math.cos(slider.endAngle) * slider.radius + this.position.x,
            Math.sin(slider.endAngle) * slider.radius + this.position.y,
            this.knobWidth / 2,
            0,
            Math.PI * 2,
            false,
        );
        this.context.lineWidth = 1;

        this.context.fillStyle = this.knobColor;
        this.context.fill();
    }

    private calculateAngles(position: Vec2): void {
        if (!this.selectedSlider) return;

        const max = this.selectedSlider.max;
        const min = this.selectedSlider.min;
        const endAngle = Math.atan2(position.y - this.position.y, position.x - this.position.x);
        const angDegrees = Slider.radToDeg(Slider.normalizeTan(endAngle));
        const normalizedValue = (Slider.normalizeTan(endAngle) * (max - min)) / (2 * Math.PI) + min;

        this.selectedSlider.endAngle = endAngle;
        this.selectedSlider.angDegrees = angDegrees;
        this.selectedSlider.normalizedValue = normalizedValue;
    }

    // Calculates cursor coordinates
    private calculateUserCursor(event: MouseEvent): void {
        const rect = this.container.getBoundingClientRect();
        this.mousePos.x = event.clientX - rect.left;
        this.mousePos.y = event.clientY - rect.top;
    }

    // Returns a slider band based on the cursor position
    private getSelectedSlider(event: MouseEvent): SliderBand | null {
        this.calculateUserCursor(event);
        const hip = Math.sqrt(Math.pow(this.mousePos.x - this.position.x, 2) + Math.pow(this.mousePos.y - this.position.y, 2));
        let selectedSlider;

        for (const key in this.sliders) {
            if (!this.sliders.hasOwnProperty(key)) continue;
            const obj = this.sliders[key];
            if (Math.abs(hip - obj.radius) <= this.scaleWidth / 2) {
                selectedSlider = obj;
                break;
            }
        }
        return selectedSlider ? selectedSlider : null;
    }

    _handleMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.selectedSlider = this.getSelectedSlider(event) as SliderBand;
        if (!this.selectedSlider) return;
        this.theBody.addEventListener('mousemove', this.rotationEventListener, false);
    }

    _handleMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.theBody.removeEventListener('mousemove', this.rotationEventListener, false);
        this.currentSlider = this.selectedSlider;
    }

    _handleClick(event: MouseEvent): void {
        this.selectedSlider = this.getSelectedSlider(event) as SliderBand;
        if (this.currentSlider && this.getSelectedSlider(event) && this.currentSlider.id !== (this.getSelectedSlider(event) as SliderBand).id) return;
        if (this.selectedSlider) this._rotation(event);
    }

    _rotation(event: MouseEvent): void {
        this.calculateUserCursor(event);
        if (this.continuousMode) this.selectedSlider = this.getSelectedSlider(event) as SliderBand;
        this.calculateAngles(this.mousePos);
        this.drawAll();
    }
}
