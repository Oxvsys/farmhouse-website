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
    this.getpackages()
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



  packages: any[] = [];


  getpackages() {
    const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/packages/third_party_data/';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        const cardData = response.map((item) => {
          const data = item.data || {};
          const duration = data.number_20250414044819204

          const people = data.number_20250414045134277


          // Get description
          const descriptionKey = Object.keys(data).find((key) => key.startsWith('description_'));
          const description = descriptionKey ? data[descriptionKey] : '<p>No description</p>';

          // Get price (use highest number from number_ keys)
          const numberValues = Object.entries(data)
            .filter(([key, val]) => key.startsWith('number_') && typeof val === 'number')
            .map(([_, val]) => val as number);
          const price = numberValues.length ? Math.max(...numberValues) : 0;

          const fileData = item.file_data || [];

          // Get image for card (field_name starts with image_)
          const cardImage = fileData.find((file: any) => file.field_name.startsWith('image_'))?.file ?? '/assets/img/default.png';

          // Get file for "Read More" (field_name starts with file_)
          const readMoreLink = fileData.find((file: any) => file.field_name.startsWith('file_'))?.file ?? '#';

          return {
            image: cardImage,
            price,
            description,
            duration,
            people,
            readMoreLink
          };
        });

        this.packages = cardData;
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }



}
