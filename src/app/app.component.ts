import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { SplashPage } from '../pages/splash/splash';
import { PresidentPage } from '../pages/president/president';
import { ParliamentPage } from '../pages/parliament/parliament';
import { MayorPage } from '../pages/mayor/mayor';
import { ChairpersonPage } from '../pages/chairperson/chairperson';
import { CouncilorPage } from '../pages/councilor/councilor';
import { AboutPage } from '../pages/about/about';
// import { VillageHeadmanPage } from '../pages/village-headman/village-headman';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SplashPage;

  pages: Array<{title: string, name: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'SLOEDP Platform', name: "", component: "" },
      { title: 'Presidential', name: "presidential", component: PresidentPage },
      { title: 'Parliamentary', name: "parliamentary", component: ParliamentPage },
      { title: 'Mayor', name: "mayor", component: MayorPage },
      { title: 'Chairperson', name: "chairperson", component: ChairpersonPage },
      { title: 'Councilor', name: "councilor", component: CouncilorPage },
      { title: 'About this app', name: "about", component: AboutPage },
      // { title: 'VillageHeadman', component: VillageHeadmanPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == 'SLOEDP Platform')
      location.href = "https://electiondata.io"
    else
      this.nav.setRoot(page.name);
  }
}
