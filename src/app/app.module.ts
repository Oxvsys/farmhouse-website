import { AppComponent } from './app.component'; 
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { SafeHTMLPipe } from './@components/safe-html.pipe'; 
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    SafeHTMLPipe,   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [[], {

    provide: RECAPTCHA_SETTINGS,
    useValue: { siteKey: "6LeZd90ZAAAAAFqJYXE35InkzRXkE2QdQ6_bqhZY" } as RecaptchaSettings,

  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
