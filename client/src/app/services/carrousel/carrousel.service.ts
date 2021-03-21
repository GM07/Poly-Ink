import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { ResponseMessage } from '@common/communication/response-message';
import { Tag } from '@common/communication/tag';
import { fromEvent, merge, Observable, Observer, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/* tslint:disable:no-any */
@Injectable({
    providedIn: 'root',
})
export class CarrouselService {
    static readonly baseURL: string = 'http://localhost:3000/drawings';

    constructor(private http: HttpClient) {}

    testConnection(): Observable<boolean> {
        return merge<boolean>(
            fromEvent(window, 'offline').pipe(map(() => false)),
            fromEvent(window, 'online').pipe(map(() => true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(navigator.onLine);
                sub.complete();
            }),
        );
    }

    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(CarrouselService.baseURL).pipe();
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
        const url = `${CarrouselService.baseURL}?ids=${drawing.data._id}`;
        return this.http.delete<Drawing>(url).pipe(
            catchError((err) => {
                return throwError(err);
            }),
        );
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
