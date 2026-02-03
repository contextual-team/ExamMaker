import { Component, OnInit } from '@angular/core';
import { QuestionService } from './questions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'practice-exam-app';
  numberOfQuestions: number = 25;
  examStarted: boolean = false;
  selectedExam: string = 'cloud-architect';
  
  exams = [
    { value: 'cloud-architect', viewValue: 'Professional Cloud Architect' },
    { value: 'CloudData', viewValue: 'Professional Data Engineer' },
    { value: 'network', viewValue: 'Professional Cloud Network Engineer' },
    { value: 'questions', viewValue: 'General Questions' }
  ];

  constructor(private questionService: QuestionService, private router: Router) {

   }

   ngOnInit(): void {
   }

  startExam(): void {
    this.examStarted = true;
    this.questionService.loadQuestions(this.selectedExam).subscribe(() => {
        this.questionService.loadUsedQuestionsFromLocalStorage();
        this.router.navigate(['/question', { numQuestions: this.numberOfQuestions }]);
    });
  }
}
