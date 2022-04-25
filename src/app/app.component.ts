import { AfterViewInit, Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public appPages = [
    { title: 'Mapa', url: '/mapa', icon: 'paper-plane' },
    { title: 'Lista De Clientes', url: '/listado-de-cliente', icon: 'people' },
    { title: 'Listado De Ruta', url: '/listado-de-ruta', icon: 'list' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy
    ) {
    localStorage.setItem('vendedor',JSON.stringify('1'));

  }
  ngAfterViewInit(): void {
    this.checkGPSPermission();
  }
    //Check if application having GPS access permission
    checkGPSPermission() {
      try{
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
          result => {
            if (result.hasPermission) {

              //If having permission show 'Turn On GPS' dialogue
              this.askToTurnOnGPS();
            } else {

              //If not having permission ask for permission
              this.requestGPSPermission();
            }
          },
          err => {

          }
        );
      }catch(e){

      }

    }

    requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS();
              },
              error => {
                //Show alert if user click on 'No Thanks'
                alert('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }

    askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
    }
}
