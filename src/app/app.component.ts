import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

declare var $: any; // Declare jQuery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'business-website';
  tenantForm: any;







  formData = {
    full_name: '',
    email: '',
    date: '',
    package: '',
    description: '',
    recaptcha: ''
  };

  constructor(private http: HttpClient) {

  }

  onCaptchaResolved(captchaResponse: string) {
    this.formData.recaptcha = captchaResponse;
  }


  isLoading = false;  // Declare this in your component

  onSubmit(form: any) {
    console.log(form.value)
    if (form.valid) {
      this.isLoading = true;  // Start loader
      const apiUrl = 'https://sayalisanchi.ajems.in/public-access/app/website/form/online-booking/submit';

      this.http.post(apiUrl, this.formData).subscribe({
        next: (response) => {
          this.isLoading = false;  // Stop loader
          Swal.fire({
            title: 'Booking Confirm!',

            icon: 'success',
            confirmButtonText: 'OK'
          });

        },
        error: (error) => {
          this.isLoading = false;  // Stop loader
          let errorMessage = 'An unexpected error occurred. Please try again later.';


          Swal.fire({
            title: 'form not submitted!',
            html: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });


          console.error('API Error:', error);
        }
      });
    } else {
      Swal.fire({
        title: 'Form Submission Failed!',
        text: 'Please fill in all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }




}
