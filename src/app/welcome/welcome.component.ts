import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  // private router:  Router;

  constructor(private router:Router) { 

  }

  ngOnInit(): void {
  }
  goToScore() {
    this.router.navigate(['/scores'])
  }
}
