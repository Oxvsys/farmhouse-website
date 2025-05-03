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
    recaptcha: '',
    packageId: null,
  };

  totalPrice = 0;
  isLoading = false;
  packages: any[] = [];
  packagesAddOn: any[] = [];

  testimonials: any[] = [];
  defaultImage = '/assets/img/default-user.jpg';

  constructor(private http: HttpClient) { }

  onCaptchaResolved(captchaResponse: string) {
    this.formData.recaptcha = captchaResponse;
  }

  ngOnInit(): void {
    this.getPackages();
    this.getPackagesAddOn();
    this.loadTestimonials();
  }

  updateTotalPrice() {
    this.totalPrice = this.formData.packagePrice + this.formData.addOnPrice;
  }



  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;

      // Find the selected package and add-on from their respective arrays
      const selectedPackage = this.packages.find(pkg => pkg.id === this.formData.packageId);
      const selectedAddOn = this.packagesAddOn.find(addOn => addOn.package === this.formData.addOn);

      const payload = {
        data: {
          string_20250408120124701: this.formData.full_name,
          string_20250408120153885: this.formData.email,
          datetime_20250409063431768: this.formData.date,
          // Submit package ID (assuming other_form_20250502052020800 is for package ID)
          other_form_20250502052020800: this.formData.packageId,
          // Submit add-on ID (assuming other_form_20250502052644117 is for add-on ID)
          other_form_20250502052644117: selectedAddOn?.id || null,
          description_20250408120421751: `<p>${this.formData.description}</p>`,
        },
        recaptcha: this.formData.recaptcha
      };

      const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/online-booking/third_party_data/';

      this.http.post(apiUrl, payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Inquiry Sent!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          form.resetForm();
          this.totalPrice = 0;
          // Reset the form data
          this.formData = {
            full_name: '',
            email: '',
            date: '',
            package: '',
            packagePrice: 0,
            addOn: '',
            addOnPrice: 0,
            title: '',
            description: '',
            recaptcha: '',
            packageId: null,
          };
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




  loadTestimonials(): void {
    const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/testimonial/third_party_data/';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.testimonials = response;
      },
      error: (error) => {
        console.error('Error loading testimonials:', error);
      }
    });
  }
  getTestimonialImage(testimonial: any): string {
    if (testimonial.file_data && testimonial.file_data.length > 0) {
      return testimonial.file_data[0].file;
    }
    return this.defaultImage;
  }
  getStars(rating: string): string[] {
    const numStars = parseInt(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= numStars ? 'fas fa-star' : 'far fa-star');
    }
    return stars;
  }


  openReviewForm(): void {
    // Open review form in new tab
    window.open(
      'https://sayalisanchi.ajems.in/public-access/app/website/form/testimonial/submit',
      '_blank'
    );
  }
  scrollToTestimonials(): void {
    // Scroll to testimonials section
    const element = document.getElementById('testimonials');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


  getPackages(): void {
    const apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/packages/third_party_data/';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.packages = response.map((item) => {
          const data = item.data || {};
          const id = data.id; // This is the ID you want to use
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
            id, // This will be used as the value
            image: cardImage,
            basePrice,
            totalPrice: basePrice,
            description,
            duration,
            people,
            readMoreLink,
            title: data.string_20250502044127803 || 'Package'
          };
        });
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }


  onPackageSelect() {

    // Find the selected package using the current packageId

    const selectedPackage = this.packages.find(pkg => pkg.id === this.formData.packageId);

    if (selectedPackage) {

      this.formData.package = selectedPackage.title;

      this.formData.packagePrice = selectedPackage.basePrice;

      this.updateTotalPrice();

    }

  }

  onAddOnSelect() {

    // Find the selected add-on using the current addOn value

    const selectedAddOn = this.packagesAddOn.find(addOn => addOn.package === this.formData.addOn);

    if (selectedAddOn) {

      this.formData.addOnPrice = selectedAddOn.price;

      this.updateTotalPrice();

    }

  }


}