import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  hasCode:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showQuestion(){
    this.hasCode = true;
  }
}
