import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { MockDataService } from '../../services/mock-data.service';
import { EducationApiService } from '../../services/education-api.service';
import { Quiz, GlossaryTerm, SimulationApiScenario, SimulationSubmitResult } from '../../models';
import { LucideAngularModule, BookOpen, Search, Brain, Play, CheckCircle2, XCircle, ArrowRight, Lightbulb, ArrowLeft, Trophy, ClipboardList, Calendar, Send, BarChart3, User, FileText, Loader2 } from 'lucide-angular';

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
              @if (filteredTerms().length === 0 && searchQuery()) {
                <div class="col-span-2 py-12 text-center text-sm text-muted-foreground">
                  No terms found matching "{{ searchQuery() }}".
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
          @if (activeSimulation() === null) {
            <!-- Simulation List View -->
            <div class="space-y-6">
              <div class="rounded-lg border border-accent/30 bg-accent/10 p-4">
                <div class="flex items-start gap-3">
                  <lucide-icon [img]="Lightbulb" [size]="20" class="mt-0.5 shrink-0 text-accent"></lucide-icon>
                  <div>
                    <p class="font-medium text-accent">How Simulation Works</p>
                    <p class="mt-1 text-sm text-muted-foreground">
                      Read real analyzed news, write your market forecast, and compare it with our AI-generated prediction.
                      Learn from real-world scenarios to improve your analytical skills.
                    </p>
                  </div>
                </div>
              </div>

              <!-- New / Completed Toggle + Period Filter -->
              <div class="flex flex-wrap items-center gap-4">
                <div class="grid w-fit grid-cols-2 rounded-lg border border-border bg-card p-1">
                  <button (click)="showSimCompleted.set(false)"
                          class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                          [class.bg-secondary]="!showSimCompleted()">
                    New
                  </button>
                  <button (click)="showSimCompleted.set(true)"
                          class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                          [class.bg-secondary]="showSimCompleted()">
                    Completed
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <lucide-icon [img]="Calendar" [size]="16"></lucide-icon>
                  Period:
                </div>
                <div class="flex w-fit flex-wrap rounded-lg border border-border bg-card p-1">
                  @for (period of simulationPeriods(); track period) {
                    <button (click)="selectedPeriod.set(period)"
                            class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                            [class.bg-secondary]="selectedPeriod() === period">
                      {{ period }}
                    </button>
                  }
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                @for (scenario of filteredSimulations(); track scenario.id) {
                  <div class="cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                    <div class="p-6">
                      <div class="flex items-start justify-between gap-2">
                        <span class="rounded-md px-2 py-0.5 text-xs font-medium"
                              [class]="getDifficultyClass(scenario.difficulty)">
                          {{ scenario.difficulty }}
                        </span>
                        <div class="flex items-center gap-2">
                          @if (completedResults().get(scenario.id); as result) {
                            <span class="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                                  [class]="result.similarityScore >= 70 ? 'bg-accent/20 text-accent' : result.similarityScore >= 40 ? 'bg-orange-500/20 text-orange-500' : 'bg-destructive/20 text-destructive'">
                              <lucide-icon [img]="Trophy" [size]="12"></lucide-icon>
                              {{ result.similarityScore }}%
                            </span>
                          }
                          <span class="rounded-md border border-border px-2 py-0.5 text-xs font-medium">{{ scenario.sector }}</span>
                        </div>
                      </div>
                      <h3 class="mt-3 text-lg font-semibold">{{ scenario.title }}</h3>
                      <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <lucide-icon [img]="Calendar" [size]="12"></lucide-icon>
                        {{ scenario.date }} &middot; {{ scenario.period }}
                      </div>
                    </div>
                    <div class="px-6 pb-6">
                      <p class="mb-3 text-sm font-medium">&ldquo;{{ scenario.newsHeadline }}&rdquo;</p>
                      <p class="line-clamp-2 text-sm text-muted-foreground">{{ scenario.context }}</p>
                      <button (click)="startSimulation(scenario)"
                              class="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                        <lucide-icon [img]="Play" [size]="16"></lucide-icon>
                        {{ completedResults().has(scenario.id) ? 'Try Again' : 'Start Simulation' }}
                      </button>
                    </div>
                  </div>
                }
              </div>

              @if (filteredSimulations().length === 0 && simulations().length > 0) {
                <div class="py-12 text-center text-sm text-muted-foreground">
                  No {{ showSimCompleted() ? 'completed' : 'new' }} simulations found for the selected period.
                </div>
              }
              @if (simulations().length === 0) {
                <div class="py-12 text-center text-sm text-muted-foreground">
                  No simulations available yet. Check back after news has been analyzed.
                </div>
              }
            </div>
          } @else if (!simSubmitted()) {
            <!-- Simulation: Read News & Write Prediction -->
            <div class="space-y-4">
              <button (click)="backToSimulations()"
                      class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
                Back to simulations
              </button>

              <div class="mx-auto max-w-3xl space-y-6">
                <!-- News Card -->
                <div class="rounded-xl border border-border bg-card">
                  <div class="border-b border-border p-6">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="rounded-md px-2 py-0.5 text-xs font-medium"
                                [class]="getDifficultyClass(activeSimulation()!.difficulty)">
                            {{ activeSimulation()!.difficulty }}
                          </span>
                          <span class="rounded-md border border-border px-2 py-0.5 text-xs font-medium">{{ activeSimulation()!.sector }}</span>
                        </div>
                        <h2 class="mt-3 text-xl font-bold">{{ activeSimulation()!.title }}</h2>
                        <div class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <lucide-icon [img]="Calendar" [size]="12"></lucide-icon>
                          {{ activeSimulation()!.date }}
                        </div>
                      </div>
                      <lucide-icon [img]="FileText" [size]="24" class="shrink-0 text-accent"></lucide-icon>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-lg font-semibold">&ldquo;{{ activeSimulation()!.newsHeadline }}&rdquo;</h3>
                    <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{{ activeSimulation()!.newsContent }}</p>
                    <div class="mt-4 rounded-lg bg-secondary/50 p-3">
                      <p class="text-xs font-medium text-muted-foreground">Context: {{ activeSimulation()!.context }}</p>
                    </div>
                  </div>
                </div>

                <!-- Prediction Input -->
                <div class="rounded-xl border border-border bg-card p-6">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="Brain" [size]="20" class="text-accent"></lucide-icon>
                    <h3 class="text-lg font-semibold">Your Prediction</h3>
                  </div>
                  <p class="mt-1 text-sm text-muted-foreground">
                    Based on this news, what do you think happened to the market and the affected companies? Describe the expected impact.
                  </p>
                  <textarea
                    [ngModel]="userPrediction()"
                    (ngModelChange)="userPrediction.set($event)"
                    placeholder="Write your prediction here... e.g., 'I expect banking stocks to rise 2-3% as higher rates boost net interest margins. The broader market may dip slightly on tightening concerns...'"
                    rows="5"
                    class="mt-4 w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring">
                  </textarea>
                  <button (click)="submitPrediction()"
                          [disabled]="!userPrediction().trim() || submitting()"
                          class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50">
                    @if (submitting()) {
                      <lucide-icon [img]="Loader2" [size]="16" class="animate-spin"></lucide-icon>
                      Evaluating...
                    } @else {
                      <lucide-icon [img]="Send" [size]="16"></lucide-icon>
                      Submit Prediction
                    }
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <!-- Simulation: Comparison View -->
            <div class="space-y-4">
              <button (click)="backToSimulations()"
                      class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
                Back to simulations
              </button>

              <div class="mx-auto max-w-4xl space-y-6">
                <div class="text-center">
                  <h2 class="text-xl font-bold">{{ activeSimulation()!.title }}</h2>
                  <p class="mt-1 text-sm text-muted-foreground">Comparison of your prediction with our AI analysis</p>
                </div>

                <!-- Side-by-side comparison -->
                <div class="grid gap-4 md:grid-cols-2">
                  <!-- User's Prediction -->
                  <div class="rounded-xl border border-border bg-card">
                    <div class="flex items-center gap-2 border-b border-border p-4">
                      <lucide-icon [img]="User" [size]="18" class="text-accent"></lucide-icon>
                      <h3 class="font-semibold">Your Prediction</h3>
                    </div>
                    <div class="p-4">
                      <p class="text-sm leading-relaxed text-muted-foreground">{{ userPrediction() }}</p>
                    </div>
                  </div>

                  <!-- Our AI Analysis -->
                  <div class="rounded-xl border border-border bg-card">
                    <div class="flex items-center gap-2 border-b border-border p-4">
                      <lucide-icon [img]="BarChart3" [size]="18" class="text-accent"></lucide-icon>
                      <h3 class="font-semibold">Our AI Analysis</h3>
                    </div>
                    <div class="p-4">
                      <p class="text-sm leading-relaxed text-muted-foreground">{{ simOurPrediction() }}</p>
                    </div>
                  </div>
                </div>

                <!-- Similarity & Feedback -->
                <div class="rounded-xl border border-border bg-card p-6">
                  <div class="flex flex-col items-center gap-4 sm:flex-row">
                    <!-- Similarity Score -->
                    <div class="flex shrink-0 flex-col items-center gap-1">
                      <div class="flex h-20 w-20 items-center justify-center rounded-full border-4"
                           [class]="simSimilarity() >= 70 ? 'border-accent text-accent' : simSimilarity() >= 40 ? 'border-orange-500 text-orange-500' : 'border-destructive text-destructive'">
                        <span class="text-xl font-bold">{{ simSimilarity() }}%</span>
                      </div>
                      <span class="text-xs font-medium text-muted-foreground">Similarity</span>
                    </div>

                    <!-- Feedback -->
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <lucide-icon [img]="Lightbulb" [size]="18"
                                     [class]="simSimilarity() >= 70 ? 'text-accent' : simSimilarity() >= 40 ? 'text-orange-500' : 'text-destructive'"></lucide-icon>
                        <h4 class="font-semibold"
                            [class]="simSimilarity() >= 70 ? 'text-accent' : simSimilarity() >= 40 ? 'text-orange-500' : 'text-destructive'">
                          {{ simSimilarity() >= 70 ? 'Great Analysis!' : simSimilarity() >= 40 ? 'Good Effort' : 'Keep Learning' }}
                        </h4>
                      </div>
                      <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ simFeedback() }}</p>
                    </div>
                  </div>
                </div>

                <button (click)="backToSimulations()"
                        class="flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                  Try Another Simulation
                  <lucide-icon [img]="ArrowRight" [size]="16"></lucide-icon>
                </button>
              </div>
            </div>
          }
        }
      </main>
    </div>
  `,
})
export class EducationComponent {
  private readonly educationApi = inject(EducationApiService);
  readonly data = inject(MockDataService);

  readonly activeTab = signal<'glossary' | 'quiz' | 'simulation'>('glossary');
  readonly searchQuery = signal('');
  readonly selectedQuestion = signal(0);
  readonly selectedAnswer = signal<number | null>(null);
  readonly showResult = signal(false);
  readonly showCompleted = signal(false);
  readonly activeQuiz = signal<Quiz | null>(null);

  // Simulation state
  readonly activeSimulation = signal<SimulationApiScenario | null>(null);
  readonly userPrediction = signal('');
  readonly simSubmitted = signal(false);
  readonly simSimilarity = signal(0);
  readonly simFeedback = signal('');
  readonly simOurPrediction = signal('');
  readonly submitting = signal(false);
  readonly selectedPeriod = signal('All');
  readonly showSimCompleted = signal(false);

  // Completed simulations tracked locally for this session
  readonly completedResults = signal(new Map<string, SimulationSubmitResult>());

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
  readonly Calendar = Calendar;
  readonly Send = Send;
  readonly BarChart3 = BarChart3;
  readonly User = User;
  readonly FileText = FileText;
  readonly Loader2 = Loader2;

  // API-backed signals
  readonly glossaryTerms = toSignal(
    this.educationApi.getGlossaryTerms().pipe(catchError(() => of([] as GlossaryTerm[]))),
    { initialValue: [] as GlossaryTerm[] }
  );

  readonly quizzes = toSignal(
    this.educationApi.getQuizzes().pipe(catchError(() => of([] as Quiz[]))),
    { initialValue: [] as Quiz[] }
  );

  readonly simulations = toSignal(
    this.educationApi.getSimulations().pipe(catchError(() => of([] as SimulationApiScenario[]))),
    { initialValue: [] as SimulationApiScenario[] }
  );

  readonly simulationPeriods = computed(() => {
    const periods = [...new Set(this.simulations().map(s => s.period))].sort();
    return ['All', ...periods];
  });

  readonly filteredTerms = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.glossaryTerms().filter(t =>
      t.term.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query)
    );
  });

  readonly filteredQuizzes = computed(() =>
    this.quizzes().filter(q => q.completed === this.showCompleted())
  );

  readonly currentQuestion = computed(() => {
    const quiz = this.activeQuiz();
    const idx = this.selectedQuestion();
    if (!quiz || !quiz.questions[idx]) {
      return { id: '', question: '', options: [] as string[], correctAnswer: 0, explanation: '' };
    }
    return quiz.questions[idx];
  });

  readonly filteredSimulations = computed(() => {
    const period = this.selectedPeriod();
    const completed = this.showSimCompleted();
    const completedMap = this.completedResults();

    return this.simulations().filter(s =>
      completedMap.has(s.id) === completed &&
      (period === 'All' || s.period === period)
    );
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

  startSimulation(scenario: SimulationApiScenario): void {
    this.activeSimulation.set(scenario);
    this.userPrediction.set('');
    this.simSubmitted.set(false);
    this.simSimilarity.set(0);
    this.simFeedback.set('');
    this.simOurPrediction.set('');
  }

  backToSimulations(): void {
    this.activeSimulation.set(null);
    this.simSubmitted.set(false);
    this.userPrediction.set('');
    this.simOurPrediction.set('');
  }

  submitPrediction(): void {
    const prediction = this.userPrediction().trim();
    const scenario = this.activeSimulation();
    if (!prediction || !scenario || this.submitting()) return;

    this.submitting.set(true);

    this.educationApi.submitSimulation(scenario.id, prediction).subscribe({
      next: (result) => {
        this.simSimilarity.set(result.similarityScore);
        this.simFeedback.set(result.feedback);
        this.simOurPrediction.set(result.ourPrediction);
        this.simSubmitted.set(true);
        this.submitting.set(false);

        this.completedResults.update(map => {
          const updated = new Map(map);
          updated.set(scenario.id, result);
          return updated;
        });
      },
      error: () => {
        this.submitting.set(false);
      }
    });
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
