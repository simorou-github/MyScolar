import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { MyOwnLoaderComponent } from './my-own-loader/my-own-loader.component';

@NgModule({
  declarations: [MyOwnLoaderComponent],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule
  ],
  exports: [
    MyOwnLoaderComponent
  ]
})

export class SharedModule { }
