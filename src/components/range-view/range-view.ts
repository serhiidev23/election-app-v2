import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the RangeViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'range-view',
  templateUrl: 'range-view.html'
})
export class RangeViewComponent {
	nationAvailable: boolean;
	regionAvailable: boolean;
	districtAvailable: boolean;
	constituencyAvailable: boolean;
	wardAvailable: boolean;
	pollingCentreAvailable: boolean;

	constructor(public viewCtrl: ViewController, public dataService: DataProvider, public navParams: NavParams) {
		var year = dataService.getYear();
		var type = this.navParams.data.type;

		this.nationAvailable = false;
	    this.regionAvailable = false;
	    this.districtAvailable = false;
	    this.constituencyAvailable = false;
	    this.wardAvailable = false;
	    this.pollingCentreAvailable = false;

	    if (type == "villageheadman") {
	      this.pollingCentreAvailable = true;
	    }
	    else {
	      if (year != '2018') {
	        switch (type) {
	          case "president":
	            this.nationAvailable = true;
	            this.regionAvailable = true;
	            this.districtAvailable = true;
	            break;
	          case "parliament":
	            this.constituencyAvailable = true;
	            break;
	          case "mayor":
	            this.districtAvailable = true;
	            break;
	          case "chairperson":
	            this.districtAvailable = true;
	            break;
	          case "councilor":
	            this.wardAvailable = true;
	            break;
	          default:
	            // code...
	            break;
	        }
	      }
	      else {
	        switch (type) {
	          case "president":
	            this.nationAvailable = true;
	            this.regionAvailable = true;
	            this.districtAvailable = true;
	            break;
	          case "parliament":
	            this.constituencyAvailable = true;
	            break;
	          case "mayor":
	            this.districtAvailable = true;
	            break;
	          case "chairperson":
	            this.districtAvailable = true;
	            break;
	          case "councilor":
	            this.wardAvailable = true;
	            break;
	          default:
	            // code...
	            break;
	        }
	      }
	    }
	}

	seletGranularity(granularity) {
		this.dataService.setGranularity(granularity);
		this.viewCtrl.dismiss();
	}
}