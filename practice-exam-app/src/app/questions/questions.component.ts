import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../questions.service';
import { Question } from './question.model';

@Component({
  selector: 'app-question',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionComponent {
  selectedQuestions: Question[] = [];
  currentQuestionIndex = 0;
  score = 0;
  currentQuestion!: Question;
  userAnswers: { [key: string]: boolean } = {};
  results: any[] = [];
  examFinished = false;

  constructor(private questionService: QuestionService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const numQuestions = +params['numQuestions'];
      // Filter out used questions
      const questions = this.questionService.getQuestions()
      const usedQuestions = this.questionService.getUsedQuestions();


      const unusedQuestions = questions.filter(q => !usedQuestions.some(uq => uq.question_text === q.question_text));

      if (unusedQuestions.length >= numQuestions) {
        // If there are enough unused questions, use them
        this.selectedQuestions = unusedQuestions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
      } else {
        // If not, combine unused and used questions and shuffle
        this.selectedQuestions = [...unusedQuestions, ...questions].sort(() => Math.random() - 0.5).slice(0, numQuestions);
      }
      console.log("Preguntas", this.selectedQuestions)
      this.loadNextQuestion();
    });
  }

  loadNextQuestion(): void {
    if (this.currentQuestionIndex < this.selectedQuestions.length) {
      this.currentQuestion = this.selectedQuestions[this.currentQuestionIndex];
      this.userAnswers = {}; // Reset user answers for new question
    } else {
      this.score = (this.results.filter(result => result.correct).length / this.results.length) * 100;
      this.examFinished = true;
    }
  }

  submitAnswer(): void {
    const userAnswerKeys = Object.keys(this.userAnswers).filter(key => this.userAnswers[key]);
    const correctAnswers = this.currentQuestion.answer.split('');
    const isCorrect = userAnswerKeys.length === correctAnswers.length &&
      userAnswerKeys.every(key => correctAnswers.includes(key));

    this.results.push({
      question: this.currentQuestion,
      correct: isCorrect,
      userAnswers: userAnswerKeys.map(key => this.currentQuestion.choices[key]),
      correctAnswers: correctAnswers.map((key: string | number) => this.currentQuestion.choices[key])
    });

    this.questionService.markQuestionAsUsed(this.currentQuestion);
    this.results.sort((a, b) => {

      if (a.correct === b.correct) {
        // If the flag property is the same, then sort by id in ascending order
        return a.question.id - b.question.id;
      } else {
        // Sort by flag (true should come before false)
      }
      return a.correct ? 1 : -1;
    })
    this.currentQuestionIndex++;
    this.loadNextQuestion();
  }

  toggleAnswer(choiceKey: string): void {
    this.userAnswers[choiceKey] = !this.userAnswers[choiceKey];
  }
}
