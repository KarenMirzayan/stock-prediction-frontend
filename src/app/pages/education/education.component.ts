import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { Quiz } from '../../models';
import { LucideAngularModule, BookOpen, Search, Brain, Play, CheckCircle2, XCircle, ArrowRight, Lightbulb, ArrowLeft, Trophy, ClipboardList } from 'lucide-angular';

@Component({
  selector: 'app-education',
  imports: [FormsModule, HeaderComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background">
      <app-header />

      <main class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Education Center</h1>
          <p class="mt-1 text-muted-foreground">Learn financial concepts, test your knowledge, and practice with simulations</p>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-6">
          <div class="grid w-full max-w-md grid-cols-3 rounded-lg border border-border bg-card p-1">
            <button (click)="activeTab.set('glossary')"
                    class="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    [class.bg-secondary]="activeTab() === 'glossary'">
              <lucide-icon [img]="BookOpen" [size]="16"></lucide-icon>
              Glossary
            </button>
            <button (click)="activeTab.set('quiz')"
                    class="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    [class.bg-secondary]="activeTab() === 'quiz'">
              <lucide-icon [img]="Brain" [size]="16"></lucide-icon>
              Quiz
            </button>
            <button (click)="activeTab.set('simulation')"
                    class="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    [class.bg-secondary]="activeTab() === 'simulation'">
              <lucide-icon [img]="Play" [size]="16"></lucide-icon>
              Simulation
            </button>
          </div>
        </div>

        <!-- Glossary Tab -->
        @if (activeTab() === 'glossary') {
          <div class="space-y-4">
            <div class="relative max-w-md">
              <lucide-icon [img]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
              <input type="text" placeholder="Search terms..."
                     [ngModel]="searchQuery()"
                     (ngModelChange)="searchQuery.set($event)"
                     class="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              @for (item of filteredTerms(); track item.term) {
                <div class="rounded-xl border border-border bg-card">
                  <div class="flex items-start justify-between p-6 pb-2">
                    <h3 class="text-lg font-semibold">{{ item.term }}</h3>
                    <span class="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{{ item.category }}</span>
                  </div>
                  <div class="px-6 pb-6">
                    <p class="text-sm text-muted-foreground">{{ item.definition }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Quiz Tab -->
        @if (activeTab() === 'quiz') {
          @if (activeQuiz() === null) {
            <!-- Quiz List View -->
            <div class="space-y-6">
              <div class="grid w-fit grid-cols-2 rounded-lg border border-border bg-card p-1">
                <button (click)="showCompleted.set(false)"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        [class.bg-secondary]="!showCompleted()">
                  New
                </button>
                <button (click)="showCompleted.set(true)"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        [class.bg-secondary]="showCompleted()">
                  Completed
                </button>
              </div>

              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                @for (quiz of filteredQuizzes(); track quiz.id) {
                  <div (click)="selectQuiz(quiz)"
                       class="cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                    <div class="p-6">
                      <div class="flex items-start justify-between gap-2">
                        <span class="rounded-md px-2 py-0.5 text-xs font-medium"
                              [class]="getDifficultyClass(quiz.difficulty)">
                          {{ quiz.difficulty }}
                        </span>
                        @if (quiz.completed && quiz.score != null) {
                          <span class="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                                [class]="quiz.score >= 70 ? 'bg-accent/20 text-accent' : 'bg-orange-500/20 text-orange-500'">
                            <lucide-icon [img]="Trophy" [size]="12"></lucide-icon>
                            {{ quiz.score }}%
                          </span>
                        }
                      </div>
                      <div class="mt-3 flex items-center gap-2">
                        <lucide-icon [img]="ClipboardList" [size]="18" class="text-muted-foreground"></lucide-icon>
                        <h3 class="text-lg font-semibold">{{ quiz.title }}</h3>
                      </div>
                      <p class="mt-2 text-sm text-muted-foreground">{{ quiz.description }}</p>
                      <p class="mt-3 text-xs text-muted-foreground">{{ quiz.totalQuestions }} questions</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          } @else {
            <!-- Active Quiz View -->
            <div class="space-y-4">
              <button (click)="backToList()"
                      class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
                Back to quizzes
              </button>

              <div class="mx-auto max-w-2xl rounded-xl border border-border bg-card">
                <div class="p-6">
                  <div class="flex items-center justify-between">
                    <span class="rounded-md border border-border px-2 py-0.5 text-xs font-medium">
                      Question {{ selectedQuestion() + 1 }} of {{ activeQuiz()!.questions.length }}
                    </span>
                    <lucide-icon [img]="Brain" [size]="20" class="text-accent"></lucide-icon>
                  </div>
                  <h3 class="mt-4 text-xl font-semibold">{{ currentQuestion().question }}</h3>
                </div>
                <div class="space-y-3 px-6 pb-6">
                  @for (option of currentQuestion().options; track $index) {
                    <button (click)="handleAnswerSelect($index)"
                            [disabled]="showResult()"
                            class="w-full rounded-lg border p-4 text-left transition-all"
                            [class]="getOptionClass($index)">
                      <div class="flex items-center justify-between">
                        <span>{{ option }}</span>
                        @if (showResult() && $index === currentQuestion().correctAnswer) {
                          <lucide-icon [img]="CheckCircle2" [size]="20" class="text-accent"></lucide-icon>
                        }
                        @if (showResult() && $index === selectedAnswer() && !isCorrect()) {
                          <lucide-icon [img]="XCircle" [size]="20" class="text-destructive"></lucide-icon>
                        }
                      </div>
                    </button>
                  }

                  @if (showResult()) {
                    <div class="mt-4 rounded-lg border p-4"
                         [class]="isCorrect() ? 'border-accent/30 bg-accent/10' : 'border-destructive/30 bg-destructive/10'">
                      <div class="flex items-start gap-3">
                        <lucide-icon [img]="Lightbulb" [size]="20"
                                     [class]="isCorrect() ? 'text-accent' : 'text-destructive'"
                                     class="mt-0.5 shrink-0"></lucide-icon>
                        <div>
                          <p class="font-medium" [class]="isCorrect() ? 'text-accent' : 'text-destructive'">
                            {{ isCorrect() ? 'Correct!' : 'Incorrect' }}
                          </p>
                          <p class="mt-1 text-sm text-muted-foreground">{{ currentQuestion().explanation }}</p>
                        </div>
                      </div>
                    </div>

                    <button (click)="nextQuestion()"
                            class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                      Next Question
                      <lucide-icon [img]="ArrowRight" [size]="16"></lucide-icon>
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        }

        <!-- Simulation Tab -->
        @if (activeTab() === 'simulation') {
          <div class="space-y-6">
            <div class="rounded-lg border border-accent/30 bg-accent/10 p-4">
              <div class="flex items-start gap-3">
                <lucide-icon [img]="Lightbulb" [size]="20" class="mt-0.5 shrink-0 text-accent"></lucide-icon>
                <div>
                  <p class="font-medium text-accent">How Simulation Works</p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    Read historical news, make your forecast, and see how the market actually reacted.
                    Learn from real-world scenarios to improve your analytical skills.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              @for (scenario of data.simulationScenarios; track scenario.id) {
                <div class="cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                  <div class="p-6">
                    <div class="flex items-start justify-between gap-2">
                      <span class="rounded-md px-2 py-0.5 text-xs font-medium"
                            [class]="getDifficultyClass(scenario.difficulty)">
                        {{ scenario.difficulty }}
                      </span>
                      <span class="rounded-md border border-border px-2 py-0.5 text-xs font-medium">{{ scenario.sector }}</span>
                    </div>
                    <h3 class="mt-3 text-lg font-semibold">{{ scenario.title }}</h3>
                    <p class="text-xs text-muted-foreground">{{ scenario.date }}</p>
                  </div>
                  <div class="px-6 pb-6">
                    <p class="mb-3 text-sm font-medium">&ldquo;{{ scenario.newsHeadline }}&rdquo;</p>
                    <p class="text-sm text-muted-foreground">{{ scenario.context }}</p>
                    <button class="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                      <lucide-icon [img]="Play" [size]="16"></lucide-icon>
                      Start Simulation
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `,
})
export class EducationComponent {
  readonly data = inject(MockDataService);
  readonly activeTab = signal<'glossary' | 'quiz' | 'simulation'>('glossary');
  readonly searchQuery = signal('');
  readonly selectedQuestion = signal(0);
  readonly selectedAnswer = signal<number | null>(null);
  readonly showResult = signal(false);
  readonly showCompleted = signal(false);
  readonly activeQuiz = signal<Quiz | null>(null);

  readonly BookOpen = BookOpen;
  readonly Search = Search;
  readonly Brain = Brain;
  readonly Play = Play;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly ArrowRight = ArrowRight;
  readonly ArrowLeft = ArrowLeft;
  readonly Lightbulb = Lightbulb;
  readonly Trophy = Trophy;
  readonly ClipboardList = ClipboardList;

  readonly filteredTerms = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.data.glossaryTerms.filter(t =>
      t.term.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query)
    );
  });

  readonly filteredQuizzes = computed(() =>
    this.data.quizzes.filter(q => q.completed === this.showCompleted())
  );

  readonly currentQuestion = computed(() => {
    const quiz = this.activeQuiz();
    return quiz ? quiz.questions[this.selectedQuestion()] : this.data.quizzes[0].questions[0];
  });

  readonly isCorrect = computed(() => this.selectedAnswer() === this.currentQuestion().correctAnswer);

  selectQuiz(quiz: Quiz): void {
    this.activeQuiz.set(quiz);
    this.selectedQuestion.set(0);
    this.selectedAnswer.set(null);
    this.showResult.set(false);
  }

  backToList(): void {
    this.activeQuiz.set(null);
  }

  handleAnswerSelect(index: number): void {
    if (this.showResult()) return;
    this.selectedAnswer.set(index);
    this.showResult.set(true);
  }

  nextQuestion(): void {
    const quiz = this.activeQuiz();
    if (!quiz) return;
    this.selectedQuestion.update(prev => (prev + 1) % quiz.questions.length);
    this.selectedAnswer.set(null);
    this.showResult.set(false);
  }

  getOptionClass(index: number): string {
    if (this.showResult() && index === this.currentQuestion().correctAnswer) {
      return 'border-accent bg-accent/10 text-foreground';
    }
    if (this.showResult() && index === this.selectedAnswer() && !this.isCorrect()) {
      return 'border-destructive bg-destructive/10 text-foreground';
    }
    if (this.selectedAnswer() === index) {
      return 'border-accent bg-accent/5';
    }
    return 'border-border hover:border-accent/50 hover:bg-secondary/50';
  }

  getDifficultyClass(difficulty: string): string {
    if (difficulty === 'Beginner') return 'bg-secondary text-secondary-foreground';
    if (difficulty === 'Intermediate') return 'border border-border';
    return 'bg-primary text-primary-foreground';
  }
}
