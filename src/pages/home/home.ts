import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import axios from "axios";
import { Device } from '@ionic-native/device';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  instance: any;
  baseURL: string = 'http://xxxxx';
  version: string = "v1.0.4";
  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private device: Device,
  ) {
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 1000,
    })
  }

  public getGPS(title: string): void {
    if (title) {
      this.geolocation
        .getCurrentPosition()
        .then(resp => {
          const latitude = (resp.coords.latitude).toString();
          const longitude = (resp.coords.longitude).toString();
          this.instance.post('/position', {
            latitude,
            longitude,
            title,
            uuid: this.device.uuid
          }).then(function (response) {
            if (response.data.code === "1000") {
              alert("上传成功");
            } else {
              alert("上传失败");
            }
          }).catch(function (error) {
            alert(error.message || error);
          });
        }).catch(error => {
          alert(error.message || error);
        });
    } else {
      alert("请输入备注信息");
    }
  }

  public openLiveGPS(title: string): void {
    if (title) {
      let subscription = this.geolocation.watchPosition();
      subscription.subscribe(data => {
        this.instance.post('/position', {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          title,
          uuid: this.device.uuid
        }).then(function (response) {
          if (response.data.code === "1000") {
            console.log(response.data);
          } else {
            console.log("上传失败");
          }
        }).catch(function (error) {
          alert(error.message || error);
        });
      });
    } else {
      alert("请输入备注信息");
    }
  }
}
