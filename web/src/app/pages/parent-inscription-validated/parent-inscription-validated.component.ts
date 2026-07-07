import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentAdminService } from 'src/app/services/parent-admin.service';

@Component({
  selector: 'app-parent-inscription-validated',
  templateUrl: './parent-inscription-validated.component.html',
  styleUrls: ['./parent-inscription-validated.component.scss']
})
export class ParentInscriptionValidatedComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  inscriptions: any[] = [];
  currentPage = 1;

  constructor(
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private parentAdminService: ParentAdminService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Espace Parent' }, { label: 'Inscriptions validées', active: true }];
    this.loadList();
  }

  loadList() {
    this.ngxLoader.startLoader('loader-spin');
    this.parentAdminService.listInscriptionsValidated().subscribe({
      next: (v: any) => {
        this.inscriptions = v.data;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: () => this.ngxLoader.stopLoader('loader-spin')
    });
  }
}
