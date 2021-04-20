import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImgurDrawing } from '@app/classes/imgur-drawing';
import { ImgurResponse } from '@app/classes/imgur-res';
import { ImgurConstants } from '@app/constants/imgur';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ExportImgurService {
    static readonly BASE_URL: string = 'https://api.imgur.com/3';

    constructor(private http: HttpClient) {}

    exportImage(image: string, format: string, filename: string): Observable<ImgurResponse> {
        const imgurDrawing: ImgurDrawing = new ImgurDrawing();
        imgurDrawing.image = image.split('base64,')[1];
        imgurDrawing.type = format;
        imgurDrawing.name = filename;
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Client-ID ${ImgurConstants.CIENT_ID}`,
            }),
        };
        return this.http.post<ImgurResponse>(`${ExportImgurService.BASE_URL}/image`, imgurDrawing, httpOptions);
    }
}
