import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    readonly RED_START: number = 0;
    readonly YELLOW_START: number = 0.17;
    readonly GREEN_START: number = 0.34;
    readonly CYAN_START: number = 0.51;
    readonly BLUE_START: number = 0.61;
    readonly PURPLE_START: number = 0.85;
    readonly RED_END: number = 1;

    context: CanvasRenderingContext2D;

    leftMouseDown: boolean = false;
    selectedHeight: number = 0;

    hueChangeFromHexSubscription: Subscription;

    constructor(private colorService: ColorService) {
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
        gradient.addColorStop(this.RED_START, Colors.RED.rgbString);
        gradient.addColorStop(this.YELLOW_START, Colors.YELLOW.rgbString);
        gradient.addColorStop(this.GREEN_START, Colors.GREEN.rgbString);
        gradient.addColorStop(this.CYAN_START, Colors.CYAN.rgbString);
        gradient.addColorStop(this.BLUE_START, Colors.BLUE.rgbString);
        gradient.addColorStop(this.PURPLE_START, Colors.PURPLE.rgbString);
        gradient.addColorStop(this.RED_END, Colors.RED.rgbString);

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
            this.selectedHeight = (((this.YELLOW_START - this.RED_START) * color.g) / Color.MAX) * height;
        } else if (color.r > Color.MIN && color.g === Color.MAX && color.b === Color.MIN) {
            this.selectedHeight = (this.YELLOW_START + (this.GREEN_START - this.YELLOW_START) * (1 - color.r / Color.MAX)) * height;
        } else if (color.r === Color.MIN && color.g === Color.MAX && color.b < Color.MAX) {
            this.selectedHeight = (this.GREEN_START + ((this.CYAN_START - this.GREEN_START) * color.b) / Color.MAX) * height;
        } else if (color.r === Color.MIN && color.g > Color.MIN && color.b === Color.MAX) {
            this.selectedHeight = (this.CYAN_START + (this.BLUE_START - this.CYAN_START) * (1 - color.g / Color.MAX)) * height;
        } else if (color.r < Color.MAX && color.g === Color.MIN && color.b === Color.MAX) {
            this.selectedHeight = (this.BLUE_START + ((this.PURPLE_START - this.BLUE_START) * color.r) / Color.MAX) * height;
        } else if (color.r === Color.MAX && color.g === Color.MIN && color.b > Color.MIN) {
            this.selectedHeight = (this.PURPLE_START + (this.RED_END - this.PURPLE_START) * (1 - color.b / Color.MAX)) * height;
        } else {
            this.selectedHeight = 0;
        }
        /* tslint:enable:cyclomatic-complexity */
    }

    // Listener added globally since mouse up could be outside of canvas
    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.leftMouseDown = false;
    }

    getColor(y: number): Color {
        const x = this.canvas.nativeElement.width / 2;
        const imageData = this.context.getImageData(x, y, 1, 1).data;
        return new Color(imageData[0], imageData[1], imageData[2]);
    }
}
