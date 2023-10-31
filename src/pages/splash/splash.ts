import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { PresidentPage } from '../../pages/president/president';
/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {
  @ViewChild(Slides) slides: Slides;
  back = "Skip"
  next = "Next"

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  onSkip() {
    var current_index = this.slides.getActiveIndex()
    if (current_index == 0)
      this.navCtrl.setRoot(PresidentPage);
    else
      this.slides.slideTo(this.slides.getActiveIndex() - 1, 500)
  }

  onStart() {
    var current_index = this.slides.getActiveIndex()
    if (current_index == 2)
      this.navCtrl.setRoot(PresidentPage);
    else
      this.slides.slideTo(this.slides.getActiveIndex() + 1, 500)
  }

  slideChanged() {
    var current_index = this.slides.getActiveIndex()
    switch (current_index) {
      case 0:
        // code...
        this.back = "Skip"
        this.next = "Next"
        break;
      case 1:
        this.back = "Back"
        this.next = "Next"
        // code...
        break;
      case 2:
        this.back = "Back"
        this.next = "Start using App"
        // code...
        break;
    }
  }
}
