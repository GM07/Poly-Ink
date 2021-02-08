import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from '@app/components/color-picker/color';
import { ColorService } from '@app/components/color-picker/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnDestroy, AfterViewInit {
    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    private hueColor: Color;
    hueSubscriptionSliders: Subscription;
    hueSubscriptionWheel: Subscription;

    selectedColorSubscription: Subscription;

    context: CanvasRenderingContext2D;
    mouseDown: boolean = false;
    selectedPosition: { x: number; y: number } = { x: 0, y: 0 };

    constructor(private colorService: ColorService) {
        this.initValues();
        this.initSubscriptions();
    }

    initValues(): void {
        this.hueColor = Color.hueToRgb(this.colorService.primaryColor.hue);
    }

    initSubscriptions(): void {
        this.hueSubscriptionSliders = this.colorService.selectedHueChangeSliders.subscribe((value) => {
            this.hue = value;
        });
        this.hueSubscriptionWheel = this.colorService.selectedHueChangeWheel.subscribe((value) => {
            this.hue = value;
            this.colorService.selectedColorPalette = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
        });

        this.selectedColorSubscription = this.colorService.selectedColorChangeSliders.subscribe((value) => {
            this.setPositionToColor(value);
            this.draw();
        });
    }

    ngAfterViewInit(): void {
        this.getContext();
        this.setPositionToColor(this.colorService.selectedColor);
        this.draw();
    }

    draw(): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.context.fillStyle = this.colorService.rgba(this.hueColor, 1);
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

        if (this.selectedPosition) {
            this.drawSelectionArea();
        }
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

    set hue(color: Color) {
        this.hueColor = color;
        this.draw();
    }

    get hue(): Color {
        return this.hueColor;
    }

    ngOnDestroy(): void {
        this.hueSubscriptionSliders.unsubscribe();
        this.hueSubscriptionWheel.unsubscribe();
        this.selectedColorSubscription.unsubscribe();
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        this.changeSelectedPosition(event.offsetX, event.offsetY);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.changeSelectedPosition(event.offsetX, event.offsetY);
        }
    }

    changeSelectedPosition(offsetX: number, offsetY: number): void {
        this.selectedPosition = this.keepSelectionWithinBounds(offsetX, offsetY);
        this.draw();
        this.colorService.selectedColorPalette = this.getColorAtPosition(this.selectedPosition.x, this.selectedPosition.y);
    }

    keepSelectionWithinBounds(x: number, y: number): { x: number; y: number } {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        if (x > width) x = width;
        else if (x < 0) x = 0;

        if (y > height) y = height;
        else if (y < 1) y = 0;

        return { x, y };
    }

    getColorAtPosition(x: number, y: number): Color {
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }
}
