import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnDestroy {
    context: CanvasRenderingContext2D;
    leftMouseDown: boolean;
    selectedPosition: Vec2;

    selectedColorChangeHexSubscription: Subscription;
    selectedHueChangeSliderSubscription: Subscription;
    @ViewChild('canvas') private canvas: ElementRef<HTMLCanvasElement>;

    constructor(public colorService: ColorService) {
        this.leftMouseDown = false;
        this.selectedPosition = new Vec2(0, 0);

        this.selectedColorChangeHexSubscription = this.colorService.selectedColorChangeFromHex.subscribe((value) => {
            this.setPositionToColor(value);
            this.draw();
        });

        this.selectedHueChangeSliderSubscription = this.colorService.hueChangeFromSlider.subscribe(() => {
            this.draw();
            this.colorService.selectedColor = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
        });
    }

    ngAfterViewInit(): void {
        this.getContext();
        this.draw();
    }

    // Code from tutorial https://malcoded.com/posts/angular-color-picker/
    draw(): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.context.fillStyle = this.colorService.selectedHue.rgbString;
        this.context.fillRect(0, 0, width, height);

        const whiteGradient = this.context.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.context.fillStyle = whiteGradient;
        this.context.fillRect(0, 0, width, height);

        const blackGradient = this.context.createLinearGradient(0, 0, 0, height);
        blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
        blackGradient.addColorStop(1, 'rgba(0,0,0,1)');

        this.context.fillStyle = blackGradient;
        this.context.fillRect(0, 0, width, height);

        this.drawSelectionArea();
    }

    ngOnDestroy(): void {
        this.selectedColorChangeHexSubscription.unsubscribe();
    }

    getContext(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
    }

    drawSelectionArea(): void {
        const arcRadius = 10;
        const lineWidth = 5;
        this.context.strokeStyle = 'white';
        this.context.fillStyle = 'white';
        this.context.beginPath();
        this.context.arc(this.selectedPosition.x, this.selectedPosition.y, arcRadius, 0, 2 * Math.PI);
        this.context.lineWidth = lineWidth;
        this.context.stroke();
    }

    setPositionToColor(color: Color): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        let stepX = 0;
        let stepY = 0;
        const hue: Color = Color.hueToRgb(color.hue);

        if (hue.r === Color.MAX) {
            stepY = Color.MAX - color.r;
        } else if (hue.g === Color.MAX) {
            stepY = Color.MAX - color.g;
        } else {
            stepY = Color.MAX - color.b;
        }

        if (hue.r === Color.MIN) {
            stepX = color.r;
        } else if (hue.g === Color.MIN) {
            stepX = color.g;
        } else {
            stepX = color.b;
        }

        this.selectedPosition.x = width - (width / Color.MAX) * stepX;
        this.selectedPosition.y = (height / Color.MAX) * stepY;
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.leftMouseDown = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = true;
        this.changeSelectedPosition(event.offsetX, event.offsetY);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.changeSelectedPosition(event.offsetX, event.offsetY);
        }
    }

    changeSelectedPosition(offsetX: number, offsetY: number): void {
        this.selectedPosition = this.keepSelectionWithinBounds(offsetX, offsetY);
        this.draw();
        this.colorService.selectedColor = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
    }

    keepSelectionWithinBounds(x: number, y: number): Vec2 {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        x = Math.max(Math.min(x, width), 0);
        y = Math.max(Math.min(y, height), 0);

        return new Vec2(x, y);
    }

    getColorAtPosition(x: number, y: number): Color {
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }
}
