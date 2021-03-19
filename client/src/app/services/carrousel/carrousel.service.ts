import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { ResponseMessage } from '@common/communication/response-message';
import { Observable } from 'rxjs';

interface Tag {
    name: string;
}

/* tslint:disable:no-any */
@Injectable({
    providedIn: 'root',
})
export class CarrouselService {
    static readonly baseURL: string = 'http://localhost:3000/drawings';

    constructor(private http: HttpClient) {}

    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(CarrouselService.baseURL);
    }

    getFilteredDrawings(tags: Tag[]): Observable<Drawing[]> {
        const tagStr = tags
            .map((tag: Tag) => {
                return tag.name;
            })
            .join();
        return this.http.get<Drawing[]>(CarrouselService.baseURL + '?tags=' + tagStr);
    }

    deleteDrawing(drawing: Drawing): Observable<{}> {
        const drawingData: any = { ...drawing };
        delete drawingData.data._id;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(drawingData),
        };
        return this.http.delete<Drawing>(CarrouselService.baseURL, httpOptions);
    }

    createDrawing(drawing: Drawing): Observable<{}> {
        const drawingData: any = { ...drawing };
        delete drawingData.data._id;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        return this.http.post<ResponseMessage>(CarrouselService.baseURL, JSON.stringify(drawingData), httpOptions);
    }
}
