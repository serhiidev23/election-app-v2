import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular/index';

import { DataProvider } from '../../providers/data/data';

import { icon, latLng, Layer, marker, geoJSON, tileLayer } from 'leaflet';

let nationGeoJSON = require("../../assets/maps/nation.json")
let regionGeoJSON = require("../../assets/maps/region.json")
let region2018GeoJSON = require("../../assets/maps/region-2018.json")
let districtGeoJSON = require("../../assets/maps/district.json")
let district2018GeoJSON = require("../../assets/maps/district-2018.json")

/**
 * Generated class for the MapViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
	selector: 'map-view',
	templateUrl: 'map-view.html'
})
export class MapViewComponent {
	@Input('year') year;
	@Input('region') region;
	@Input('type') type;
	round: boolean;

	result: any;
	boundary_json: any;

	noWinner: boolean;
	isRoundAvailable: boolean;

	// Map Init
  	mapOptions = {
		zoom: 7,
		center: latLng(8.460555,-11.779889)
	};

	layers: Layer[];
	two_rounds = [1996, 2007, 2018];
	
	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public dataService: DataProvider, public events: Events, private ref: ChangeDetectorRef) {
		this.result = {
			'ResultStatus': "",
			'TotalVotes': "",
			'ValidVotes': "",
			'InvalidVotes': "",
			'VotesPecentage': "",
			'Parties': {},
			'Candidates': {},
			'Boundaries': [],
			'ElectionResults': []
		};
		this.noWinner = true;
		this.applyMap([]);
	}	

	ngAfterViewInit() {
		this.isRoundAvailable = this.type == 'president' && this.two_rounds.indexOf(this.year) != -1
		this.round = this.year == 2018;
	}

	gotoPartyDetail(party) {
		this.navCtrl.push('party', {id: party.Acronym});
	}

	gotoCandidateDetail(candidate_id) {
		this.navCtrl.push('candidate', {id: candidate_id});
	}

	candidatesEnable() {
		return this.result.ElectionResults.length > 0;
	}

	transform2d(value, columns, limit) : any {
		let results = [];
		for (let i in value) {
			if (i >= limit) continue;
			if (Number(i) % columns == 0) {
				results.push([value[i]]);
			}
			else {
				results[results.length - 1].push(value[i]);
			}
		}

		return results;
	}

	setPhotoUrl(photo) {
		return "assets/imgs/candidate/" + photo;
	}

	colorFilter(_color) {
		var default_color = "#999";
		var colors = ["Pink", "Orange", "Green", "Red", "Blue", "Purple", "Yellow"];
		var color = _color.trim();
		if (!color) return default_color;
		if (color.split(',').length > 1) {
			return color.split(',')[0];
		}
		if (colors.indexOf(color.charAt(0).toUpperCase() + color.slice(1)) > -1) {
			return color;
		}
		return "#" + color;
	}

	makeKey(value) {
		return value.toLowerCase().replace(/\ /gi, '_');
	}

	makeBoundaryJson(boundaries) {
		var boundary_key;
		var boundary_json = {};
		var vm = this;
		boundaries.forEach(function(boundary) {
			boundary_key = vm.makeKey(boundary.name)
			boundary_json[boundary_key] = boundary;
		})

		return boundary_json
	}

	otherPercent(candidates) {
		return (100.0 - parseFloat(candidates[0].ValidVotesPercentage) - parseFloat(candidates[1].ValidVotesPercentage)).toFixed(2);
	}

	getBoundaryColor(boundary) {
		var boundary_key = this.makeKey(boundary.name)
		return this.colorFilter(this.boundary_json[boundary_key].candidates[0].CandidatePoliticalPartyColor)
	}

	changeRound(round) {
		this.drawMap()
	}

	drawMap() {
		var fields = {
			year: this.year,
			type: this.type,
			region: this.region
		}
		if (this.type == 'president' && this.two_rounds.indexOf(this.year) != -1)
			fields['round'] = this.round ? 'second' : 'first'

		var vm = this;

		// Create the popup
		let loadingPopup = vm.loadingCtrl.create({
			content: 'Loading data...'
		});

		// Show the popup
		loadingPopup.present();

		this.dataService.loadResultsByFields(fields).then(data => {
			var Parties = data['Parties'];
			vm.result.Candidates = data['Candidates'];
			vm.result.Boundaries = data['Boundaries'];
			vm.result.TotalVotes = this.year == '2018' ? 3178664 : data['ValidVotes'];
			
			vm.result.InvalidVotes = this.year == '2018' ? 139427 : 0;
			vm.result.ResultStatus = "Final & Certified"
			
			vm.result.ElectionResults = [];
			vm.boundary_json = {};
			if (vm.result.Boundaries.length > 0) {
				vm.boundary_json = vm.makeBoundaryJson(vm.result.Boundaries)
				if (vm.result.Boundaries[0].candidates[0]['ValidVotes'] > 0) {
					vm.noWinner = false;
					vm.result.ValidVotes = vm.result.Boundaries[0].votes;
					if (vm.year == '2018')
						if (vm.result.TotalVotes == 0)
							vm.result.VotesPecentage = "0%"
						else
							vm.result.VotesPecentage = ((vm.result.ValidVotes / vm.result.TotalVotes) * 100).toFixed(2) + '%'
					else
						vm.result.VotesPecentage = "100%"
				}
				else {
					vm.noWinner = true;
				}

				vm.result.ElectionResults = vm.result.Boundaries[0].candidates;
				vm.events.publish('boundary:select', vm.result.Boundaries[0].name);
				vm.result.Parties = {};
				
				for (let candidate of vm.result.Boundaries[0].candidates) {
					vm.result.Parties[candidate['CandidatePoliticalParty']] = Parties[candidate['CandidatePoliticalParty']];
				}
			}

		    if (vm.region == "nation" || vm.region == "region" || vm.region == "district") {
		    	var geoData;
		    	if (vm.region == 'nation') geoData = nationGeoJSON['features']
		    	if (vm.region == 'region' && vm.year != '2018') geoData = regionGeoJSON['features']
		    	if (vm.region == 'region' && vm.year == '2018') geoData = region2018GeoJSON['features']
		    	if (vm.region == 'district' && vm.year != '2018') geoData = districtGeoJSON['features']
		    	if (vm.region == 'district' && vm.year == '2018') geoData = district2018GeoJSON['features']

		    	var geoJSONLayer = geoJSON(geoData, {
		    		onEachFeature: (feature, layer) => {
		    			var boundary_key = vm.makeKey(feature.properties.Name)
		    			var boundaryName = feature.properties.Name
		    			if (vm.type == 'mayor' && vm.boundary_json[boundary_key])
		    				boundaryName = vm.boundary_json[boundary_key]['name_council']
		    			layer.bindPopup(boundaryName)
		    			
		    			layer.on('click', function() {
		    				var boundary_key = vm.makeKey(feature.properties.Name)
		    				var boundary = vm.boundary_json[boundary_key]
		    				vm.applyResult(boundary)
		    			})
		    			if (vm.region == 'region' && feature.properties.Name == 'West') {
		    				layer.fireEvent('click')
		    				setTimeout(function() {
		    					layer.openPopup()
		    				}, 10)
		    			}
		    			if (vm.region == 'district' && feature.properties.Name == 'Western Area Urban') {
		    				layer.fireEvent('click')
		    				setTimeout(function() {
		    					layer.openPopup()
		    				}, 10)
		    			}
		    		},
		    		style: (feature) => {
		    			var boundary_key = vm.makeKey(feature.properties.Name)
		    			if (vm.boundary_json[boundary_key])
		    				return { color: vm.colorFilter(vm.boundary_json[boundary_key].candidates[0].CandidatePoliticalPartyColor) }
		    			else
		    				return { color: '#999' }
		    			
		    		}
		    	})
		    	vm.applyMap([geoJSONLayer])
		    }
		    else {
		    	var markerBoundary;
		    	var layers = [];
		    	for(let boundary of vm.result.Boundaries) {
		    		markerBoundary = marker([ boundary.latitude, boundary.longitude ], {
						icon: icon({
							iconSize: [ 25, 41 ],
							iconAnchor: [ 13, 41 ],
							iconUrl: '../../assets/imgs/marker.png',
							shadowUrl: '../../assets/imgs/marker-shadow.png'
						})
					}).bindPopup(boundary.name).on('click', () => {
	    				vm.applyResult(boundary)
					})
					layers.push(markerBoundary)
		    	}
		    	vm.applyMap(layers)
		    }
			loadingPopup.dismiss();
		});
	}

	applyResult(boundary) {
		if (boundary) {
			this.result.ElectionResults = boundary.candidates;
			this.result.ValidVotes = boundary.votes;
			if (this.year == '2018')
				if (this.result.TotalVotes == 0)
					this.result.VotesPecentage = "0%"
				else {
					this.result.VotesPecentage = ((this.result.ValidVotes / this.result.TotalVotes) * 100).toFixed(2) + '%'
				}
			else
				this.result.VotesPecentage = "100%"
		    if (boundary.votes > 0) this.noWinner = false;
			else this.noWinner = true;
		    this.events.publish('boundary:select', boundary.name);
		}
		else {
			this.result.ElectionResults = []
			this.result.ValidVotes = 0
			this.result.VotesPecentage = 0
			this.noWinner = true;
		}
		this.ref.detectChanges()
	}

	applyMap(layers) {
		layers.push(tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' }))
		this.layers = layers;
		return false;
	}
}