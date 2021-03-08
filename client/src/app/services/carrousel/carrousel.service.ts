import { HttpClient } from '@angular/common/http';
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
    private baseURL: string = 'http://localhost:3000/drawings';

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
}