import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit, OnDestroy {
    static readonly RED_START: number = 0;
    static readonly YELLOW_START: number = 0.17;
    static readonly GREEN_START: number = 0.34;
    static readonly CYAN_START: number = 0.51;
    static readonly BLUE_START: number = 0.61;
    static readonly PURPLE_START: number = 0.85;
    static readonly RED_END: number = 1;

    context: CanvasRenderingContext2D;

    leftMouseDown: boolean;
    selectedHeight: number;

    hueChangeFromHexSubscription: Subscription;
    @ViewChild('canvas') private canvas: ElementRef<HTMLCanvasElement>;

    constructor(private colorService: ColorService) {
        this.leftMouseDown = false;
        this.selectedHeight = 0;

        this.hueChangeFromHexSubscription = this.colorService.hueChangeFromHex.subscribe((color) => {
            this.setPositionToHue(color);
            this.draw();
        });
    }

    // Code from tutorial https://malcoded.com/posts/angular-color-picker/
    draw(): void {
        // Set width/height and clear Canvas
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;
        this.context.clearRect(0, 0, width, height);

        const gradient = this.context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(ColorSliderComponent.RED_START, Colors.RED.rgbString);
        gradient.addColorStop(ColorSliderComponent.YELLOW_START, Colors.YELLOW.rgbString);
        gradient.addColorStop(ColorSliderComponent.GREEN_START, Colors.GREEN.rgbString);
        gradient.addColorStop(ColorSliderComponent.CYAN_START, Colors.CYAN.rgbString);
        gradient.addColorStop(ColorSliderComponent.BLUE_START, Colors.BLUE.rgbString);
        gradient.addColorStop(ColorSliderComponent.PURPLE_START, Colors.PURPLE.rgbString);
        gradient.addColorStop(ColorSliderComponent.RED_END, Colors.RED.rgbString);

        // Draw rectangle size of the canvas
        this.context.beginPath();
        this.context.rect(0, 0, width, height);

        // Fill rectangle with gradient
        this.context.fillStyle = gradient;
        this.context.fill();
        this.context.closePath();

        this.drawSelectionBox();
    }

    getContext(): void {
        if (!this.context) {
            this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
    }

    ngOnDestroy(): void {
        this.hueChangeFromHexSubscription.unsubscribe();
    }

    drawSelectionBox(): void {
        const lineWidth = 5;
        const rectangleHeight = 10;
        const width = this.canvas.nativeElement.width;
        this.context.beginPath();
        this.context.strokeStyle = 'white';
        this.context.lineWidth = lineWidth;
        this.context.rect(0, this.selectedHeight - lineWidth, width, rectangleHeight);
        this.context.stroke();
        this.context.closePath();
    }

    ngAfterViewInit(): void {
        this.getContext();
        this.draw();
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = true;
        this.changeSelectedHeight(event.offsetY);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.changeSelectedHeight(event.offsetY);
        }
    }

    changeSelectedHeight(offsetY: number): void {
        this.selectedHeight = offsetY;
        this.draw();
        this.colorService.selectedHueFromSliders = this.getColor(offsetY);
    }

    setPositionToHue(color: Color): void {
        const height = this.canvas.nativeElement.height;

        // Since there are 6 different sector on the color wheel we need many if/else statement to determine the appropriate one
        /* tslint:disable:cyclomatic-complexity */
        if (color.r === Color.MAX && color.g < Color.MAX && color.b === Color.MIN) {
            this.selectedHeight = (((ColorSliderComponent.YELLOW_START - ColorSliderComponent.RED_START) * color.g) / Color.MAX) * height;
        } else if (color.r > Color.MIN && color.g === Color.MAX && color.b === Color.MIN) {
            this.selectedHeight =
                (ColorSliderComponent.YELLOW_START +
                    (ColorSliderComponent.GREEN_START - ColorSliderComponent.YELLOW_START) * (1 - color.r / Color.MAX)) *
                height;
        } else if (color.r === Color.MIN && color.g === Color.MAX && color.b < Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.GREEN_START + ((ColorSliderComponent.CYAN_START - ColorSliderComponent.GREEN_START) * color.b) / Color.MAX) *
                height;
        } else if (color.r === Color.MIN && color.g > Color.MIN && color.b === Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.CYAN_START + (ColorSliderComponent.BLUE_START - ColorSliderComponent.CYAN_START) * (1 - color.g / Color.MAX)) *
                height;
        } else if (color.r < Color.MAX && color.g === Color.MIN && color.b === Color.MAX) {
            this.selectedHeight =
                (ColorSliderComponent.BLUE_START + ((ColorSliderComponent.PURPLE_START - ColorSliderComponent.BLUE_START) * color.r) / Color.MAX) *
                height;
        } else if (color.r === Color.MAX && color.g === Color.MIN && color.b > Color.MIN) {
            this.selectedHeight =
                (ColorSliderComponent.PURPLE_START + (ColorSliderComponent.RED_END - ColorSliderComponent.PURPLE_START) * (1 - color.b / Color.MAX)) *
                height;
        } else {
            this.selectedHeight = 0;
        }
        /* tslint:enable:cyclomatic-complexity */
    }

    // Listener added globally since mouse up could be outside of canvas
    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.leftMouseDown = false;
    }

    getColor(y: number): Color {
        const x = this.canvas.nativeElement.width / 2;
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }
}
