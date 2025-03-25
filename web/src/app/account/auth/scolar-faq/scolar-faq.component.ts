import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scolar-faq',
  templateUrl: './scolar-faq.component.html',
  styleUrls: ['./scolar-faq.component.scss']
})
export class ScolarFaqComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Utility' }, { label: 'FAQs', active: true }];
  }
}
