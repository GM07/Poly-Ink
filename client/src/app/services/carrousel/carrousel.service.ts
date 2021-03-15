import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

interface Tag {
    name: string;
}

@Injectable({
    providedIn: 'root',
})

export class CarrouselService {
    public baseURL: string = 'http://localhost:3000/drawings';
    
    constructor(private http: HttpClient) {}
    
    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.baseURL);
    }
    
    getFilteredDrawings(tags: Tag[]): Observable<Drawing[]> {
        let tagNames: string[] = [];
        tags.forEach((tag: Tag) => {tagNames.push(tag.name)});
        let tag: string = tagNames.join();
        return this.http.get<Drawing[]>(this.baseURL + '?tags=' + tag);
    }
    
    deleteDrawing(drawing: Drawing): Observable<{}> {
        let drawingData: any = {...drawing};
        delete drawingData.data._id;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}), body: JSON.stringify(drawingData)
        }
        return this.http.delete<Drawing>(this.baseURL, httpOptions);
    }
}