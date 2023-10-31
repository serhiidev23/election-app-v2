import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChairpersonPage } from './chairperson';
import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [
    ChairpersonPage,
  ],
  imports: [
    IonicPageModule.forChild(ChairpersonPage),
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ChairpersonPageModule {}