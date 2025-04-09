import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [

    // { path: '', component: HomeComponent },
    // { path: 'terms-and-conditions', component: TncComponent },
    // { path: 'privacy-policy', component: PrivacyPolicyComponent },
    // { path: 'about-us', component: AboutUsComponent },
    // // { path: 'services', component: ServicesComponent },
    // { path: 'contact-us', component: ContactUsComponent },
    // { path: 'faq', component: FaqComponent },






    // { path: 'tnc', component: TncComponent },
    // { path: '**', redirectTo: '' }

]

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabledBlocking'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }