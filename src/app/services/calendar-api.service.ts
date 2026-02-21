import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CalendarEvent } from '../models';

@Injectable({ providedIn: 'root' })
export class CalendarApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/calendar';

  getUpcoming(limit = 6): Observable<CalendarEvent[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<CalendarEvent[]>(`${this.baseUrl}/upcoming`, { params }).pipe(
      map(events => events.map(e => ({ ...e, id: String(e.id) }))),
    );
  }

  getByDateRange(from: string, to: string): Observable<CalendarEvent[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<CalendarEvent[]>(this.baseUrl, { params }).pipe(
      map(events => events.map(e => ({ ...e, id: String(e.id) }))),
    );
  }
}
