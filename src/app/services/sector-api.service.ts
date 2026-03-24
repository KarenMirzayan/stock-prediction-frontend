import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SectorData, MarketState } from '../models';

interface SectorHeatmapDto {
  name: string;
  code: string;
  totalMarketCap: number;
  weightedDailyChange: number;
  sentiment: string;
}

@Injectable({ providedIn: 'root' })
export class SectorApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/sectors';

  getHeatmap(country = 'US'): Observable<SectorData[]> {
    return this.http.get<SectorHeatmapDto[]>(`${this.baseUrl}/heatmap`, { params: { country } }).pipe(
      map(sectors => sectors.map(s => ({
        name: s.name,
        marketCap: s.totalMarketCap,
        change: Math.round(s.weightedDailyChange * 100) / 100,
        sentiment: s.sentiment as MarketState,
      })))
    );
  }
}
