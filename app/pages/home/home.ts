import {Component} from '@angular/core';
import {Platform, NavController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    public barcodeData: any;
    public productData: any;
    public productFound: boolean;
    constructor(private platform: Platform, private navCtrl: NavController, private http: Http) {
        platform.ready().then(() => {
            console.log("Home ready");
            this.productFound = true;
        });
    }

    scanBarcode(event) {
        BarcodeScanner.scan().then((data) => {
            this.barcodeData = data;
            console.log("Barcode found");
            this.fetchData(data.text);
        }, (error) => {
            console.log("Error: ", error);
        });
    }

    fetchData(barcode) {
        // http://world.openfoodfacts.org/api/v0/product/737628064502.json
        // http://world.openfoodfacts.org/data
        if(barcode.length > 0) {
            console.log("Fetch data");
            this.http.get('http://world.openfoodfacts.org/api/v0/product/' + barcode +'.json')
                .map(res => res.json())
                .subscribe(
                    (data) => {
                        console.log("We have data!");
                        if(data.status == 1) {
                            this.productData = data.product;
                        } else {
                            this.productFound = false;
                            console.log("Product not found");
                        }
                    });
        }
    }
}
