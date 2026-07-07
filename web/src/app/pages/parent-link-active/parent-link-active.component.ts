import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentAdminService } from 'src/app/services/parent-admin.service';

@Component({
  selector: 'app-parent-link-active',
  templateUrl: './parent-link-active.component.html',
  styleUrls: ['./parent-link-active.component.scss']
})
export class ParentLinkActiveComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  activeLinks: any[] = [];
  currentPage = 1;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private parentAdminService: ParentAdminService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Espace Parent' }, { label: 'Liaisons en place', active: true }];
    this.loadList();
  }

  loadList() {
    this.ngxLoader.startLoader('loader-spin');
    this.parentAdminService.listActiveLinks().subscribe({
      next: (v: any) => {
        this.activeLinks = v.data;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: () => this.ngxLoader.stopLoader('loader-spin')
    });
  }
}
