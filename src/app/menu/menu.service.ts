import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private jsonUrl = 'assets/data/menu.json'; // Đường dẫn tới file JSON

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
