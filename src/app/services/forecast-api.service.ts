import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForecastStats, ForecastHistoryItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ForecastApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/forecast';

  getStats(): Observable<ForecastStats> {
    return this.http.get<ForecastStats>(`${this.baseUrl}/stats`);
  }

  getHistory(): Observable<ForecastHistoryItem[]> {
    return this.http.get<ForecastHistoryItem[]>(`${this.baseUrl}/history`);
  }
}
