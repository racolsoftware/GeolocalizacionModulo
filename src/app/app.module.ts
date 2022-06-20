import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule  } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AlertController, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SQLite } from '@ionic-native/SQLite/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { alertController } from '@ionic/core';
import { Chart } from 'chart.js';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { AppVersion } from '@ionic-native/app-version/ngx';



export class MyHammerConfig extends HammerGestureConfig {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    overrides = <any> {
        pinch: { enable: false },
        rotate: { enable: false }
    };
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HammerModule ,

  ],
  providers: [
    AppVersion,
    AlertController,
    ForegroundService,
    BackgroundMode,
    BackgroundGeolocation,
    OpenNativeSettings,
    InAppBrowser,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    NativeGeocoder,
    SQLite,
    Deeplinks,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
