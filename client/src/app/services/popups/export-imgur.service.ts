import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImgurDrawing } from '@app/classes/imgur-drawing';
import { ImgurConstants } from '@app/constants/imgur';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ExportImgurService {
    static readonly baseURL: string = 'https://api.imgur.com/3';

    constructor(private http: HttpClient) { }

    exportImage(image: string, format: string, filename:string): Observable<{}> {
        const imgurDrawing: ImgurDrawing = new ImgurDrawing(image);
        imgurDrawing.image = imgurDrawing.image.split("base64,")[1];
        imgurDrawing.type = format;
        imgurDrawing.name = filename;
        const httpOptions = {
            headers: new HttpHeaders (
                {
                    'Authorization': `Client-ID ${ImgurConstants.CIENT_ID}`,
                }
            )
        }
        return this.http.post<ImgurDrawing>(
            `${ExportImgurService.baseURL}/image`, imgurDrawing, httpOptions)
    }
}
