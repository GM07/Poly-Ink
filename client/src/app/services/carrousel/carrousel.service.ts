import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';
import { fromEvent, merge, Observable, Observer, throwError } from 'rxjs'; //, throwError 
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class CarrouselService {
    public baseURL: string;
    
    constructor(private http: HttpClient) {
        this.baseURL = 'http://localhost:3000/drawings';
    }

    testConnection() {
        return merge<boolean>(
          fromEvent(window, 'offline').pipe(map(() => false)),
          fromEvent(window, 'online').pipe(map(() => true)),
          new Observable((sub: Observer<boolean>) => {
            sub.next(navigator.onLine);
            sub.complete();
          }));
    }

    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.baseURL)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
    
    getFilteredDrawings(tags: Tag[]): Observable<Drawing[]> {
        let tagNames: string[] = [];
        tags.forEach((tag: Tag) => {tagNames.push(tag.name)});
        let tag: string = tagNames.join();
        return this.http.get<Drawing[]>(this.baseURL + '?tags=' + tag);
    }
    
    deleteDrawing(drawing: Drawing): Observable<{}> {
        let url: string = `${this.baseURL}?ids=${drawing.data._id}`;
        console.log(url);
        return this.http.delete<Drawing>(url);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0 || error.error instanceof ProgressEvent) { //error.error instanceof ErrorEvent
          // A client-side or network error occurred. Handle it accordingly.
          console.log('Client side error: ', error.error);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
    }
}