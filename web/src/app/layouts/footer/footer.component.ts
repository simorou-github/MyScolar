import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

/**
 * Footer component
 */
export class FooterComponent implements OnInit {

  // set the currenr year
  year: number = 2024;

  constructor() { }

  ngOnInit() {
  }

}
