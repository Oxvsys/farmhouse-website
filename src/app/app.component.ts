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
    if (form.valid) {
      this.isLoading = true;

      const payload = {
        data:
        {
          string_20250408120124701: this.formData.full_name,
          string_20250408120153885: this.formData.email,
          datetime_20250409063431768: this.formData.date,
          dropdown_20250408120313945: this.formData.package,
          description_20250408120421751: `<p>${this.formData.description}</p>`,
        },

        recaptcha: this.formData.recaptcha
      };

      const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/online-booking/third_party_data/';

      this.http.post(apiUrl, payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Booking Confirm!',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          form.resetForm();
        },

        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Form not submitted!',
            html: 'An unexpected error occurred. Please try again later.',
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
