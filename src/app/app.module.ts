import { AppComponent } from './app.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { SafeHTMLPipe } from './@components/safe-html.pipe';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AboutUsComponent } from './@components/about-us/about-us.component';
import { BookingComponent } from './@components/booking/booking.component';
import { ContactUsComponent } from './@components/contact-us/contact-us.component';
import { GalleryComponent } from './@components/gallery/gallery.component';
import { PackageComponent } from './@components/package/package.component';
import { ServiceComponent } from './@components/service/service.component';
import { TeamComponent } from './@components/team/team.component';
import { TestimonialComponent } from './@components/testimonial/testimonial.component';
import { GalleryService } from './@service/gallery.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    AppComponent,
    SafeHTMLPipe,
    AboutUsComponent,
    BookingComponent,
    ContactUsComponent,
    GalleryComponent,
    PackageComponent,
    ServiceComponent,
    TeamComponent,
    TestimonialComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,

  ],
  providers: [[
    GalleryService,
  ], {

    provide: RECAPTCHA_SETTINGS,
    useValue: { siteKey: "6LecstspAAAAAJBhT3n2hfQragrEwgJuoD3t0RRk" } as RecaptchaSettings,

  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
