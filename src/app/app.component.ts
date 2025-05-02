import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'business-website';
  formData = {
    full_name: '',
    email: '',
    date: '',
    package: '',
    packagePrice: 0,
    addOn: '',
    addOnPrice: 0,
    title: '',
    description: '',
    recaptcha: ''
  };

  totalPrice = 0;
  isLoading = false;
  packages: any[] = [];
  packagesAddOn: any[] = [];

  constructor(private http: HttpClient) { }

  onCaptchaResolved(captchaResponse: string) {
    this.formData.recaptcha = captchaResponse;
  }

  ngOnInit(): void {
    this.getPackages();
    this.getPackagesAddOn();
  }

  updateTotalPrice() {
    this.totalPrice = this.formData.packagePrice + this.formData.addOnPrice;
  }

  onPackageSelect(pkg: any) {
    this.formData.package = pkg.description; // or whatever field contains the package name
    this.formData.packagePrice = pkg.basePrice;
    this.updateTotalPrice();
  }

  onAddOnSelect(addOn: any) {
    this.formData.addOn = addOn.package;
    this.formData.addOnPrice = addOn.price;
    this.updateTotalPrice();
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;

      const payload = {
        data: {
          string_20250408120124701: this.formData.full_name,
          string_20250408120153885: this.formData.email,
          datetime_20250409063431768: this.formData.date,
          // dropdown_20250408120313945: `${this.formData.package} ($${this.formData.packagePrice})` +
          //   (this.formData.addOn ? ` + ${this.formData.addOn} ($${this.formData.addOnPrice})` : ''),
          string_20250502044127803: this.formData.title,
          other_form_20250502052020800: this.formData.title,
          other_form_20250502052644117: this.formData.addOn,
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
          this.totalPrice = 0;
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

  getPackagesAddOn(): void {
    const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/add-on-packages/third_party_data/';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.packagesAddOn = response.map((item) => {
          const data = item.data || {};
          return {
            id: item.id,
            package: data.string_20250421164933300 || 'Add-on Package',
            price: data.number_20250421164937980 || 0
          };
        });
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }

  getPackages(): void {
    const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/packages/third_party_data/';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.packages = response.map((item) => {
          const data = item.data || {};
          const duration = data.number_20250414044819204 || 0;
          const people = data.number_20250414045134277 || 0;
          const title = data.other_form_20250502052020800 || 0;

          const descriptionKey = Object.keys(data).find((key) => key.startsWith('description_'));
          const description = descriptionKey ? data[descriptionKey] : '<p>No description</p>';

          const numberValues = Object.entries(data)
            .filter(([key, val]) => key.startsWith('number_') && typeof val === 'number')
            .map(([_, val]) => val as number);
          const basePrice = numberValues.length ? Math.max(...numberValues) : 0;

          const fileData = item.file_data || [];
          const cardImage = fileData.find((file: any) => file.field_name.startsWith('image_'))?.file ?? '/assets/img/default.png';
          const readMoreLink = fileData.find((file: any) => file.field_name.startsWith('file_'))?.file ?? '#';

          return {
            id: item.id,
            image: cardImage,
            basePrice,
            totalPrice: basePrice,
            description,
            duration,
            people,
            readMoreLink,
            title: data.string_20250502044127803 || 'Package' // assuming this is the title field
          };
        });
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }
}