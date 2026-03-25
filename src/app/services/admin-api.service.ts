import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlossaryTerm } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/admin';

  // Articles
  updateArticle(id: number, data: { summary?: string; content?: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/articles/${id}`, data);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/articles/${id}`);
  }

  // Predictions
  updatePrediction(id: number, data: {
    direction?: string;
    timeHorizon?: string;
    confidence?: number;
    rationale?: string;
    evidence?: string[];
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/predictions/${id}`, data);
  }

  deletePrediction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/predictions/${id}`);
  }

  // Companies
  updateCompany(id: number, data: { description?: string; logoUrl?: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/companies/${id}`, data);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/${id}`);
  }

  // Glossary
  createGlossaryTerm(data: { term: string; definition?: string; category: string }): Observable<GlossaryTerm> {
    return this.http.post<GlossaryTerm>(`${this.baseUrl}/glossary`, data);
  }

  generateGlossaryTerms(terms: { term: string; category: string }[]): Observable<GlossaryTerm[]> {
    return this.http.post<GlossaryTerm[]>(`${this.baseUrl}/glossary/generate`, { terms });
  }

  updateGlossaryTerm(id: number, data: { definition: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/glossary/${id}`, data);
  }

  deleteGlossaryTerm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/glossary/${id}`);
  }

  // Quiz questions
  updateQuizQuestion(id: number, data: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/quizzes/questions/${id}`, data);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/quizzes/${id}`);
  }
}
