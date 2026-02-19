import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlossaryTerm, Quiz, SimulationApiScenario, SimulationSubmitResult } from '../models';

interface ApiQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ApiQuiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: ApiQuizQuestion[];
  totalQuestions: number;
}

interface ApiSimulationScenario {
  id: number;
  title: string;
  date: string;
  period: string;
  newsHeadline: string;
  newsContent: string;
  context: string;
  sector: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

@Injectable({ providedIn: 'root' })
export class EducationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/education';

  getGlossaryTerms(): Observable<GlossaryTerm[]> {
    return this.http.get<GlossaryTerm[]>(`${this.baseUrl}/glossary`);
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<ApiQuiz[]>(`${this.baseUrl}/quizzes`).pipe(
      map(apiQuizzes => apiQuizzes.map(q => ({
        ...q,
        id: String(q.id),
        completed: false,
        questions: q.questions.map(question => ({
          ...question,
          id: String(question.id),
        })),
      })))
    );
  }

  getSimulations(): Observable<SimulationApiScenario[]> {
    return this.http.get<ApiSimulationScenario[]>(`${this.baseUrl}/simulations`).pipe(
      map(items => items.map(s => ({ ...s, id: String(s.id) })))
    );
  }

  submitSimulation(id: string, userPrediction: string): Observable<SimulationSubmitResult> {
    return this.http.post<SimulationSubmitResult>(
      `${this.baseUrl}/simulations/${id}/submit`,
      { userPrediction }
    );
  }
}
