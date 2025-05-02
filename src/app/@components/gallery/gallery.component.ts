// gallery.component.ts
import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/@service/gallery.service';
// import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  targetFieldName = 'image_20250421155646655';
  galleryImages: any[] = [];
  primaryImages: any[] = [];
  secondaryImages: any[] = [];

  constructor(private galleryService: GalleryService) { }

  ngOnInit(): void {
    this.loadGalleryImages();
  }

  loadGalleryImages(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.galleryService.getGalleryImages().subscribe({
      next: (response) => {
        try {
          if (Array.isArray(response)) {
            this.processGalleryData(response);
          } else {
            this.errorMessage = 'Invalid response format - expected array';
          }
        } catch (error) {
          this.errorMessage = 'Error processing gallery data';
          console.error(error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load gallery images. Please try again later.';
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  private processGalleryData(items: any[]): void {
    // Extract all images with the target field name
    this.galleryImages = items
      .flatMap(item => item.file_data || [])
      .filter(file => file?.field_name === this.targetFieldName && !file?.is_deleted && file?.file);
    console.log('Filtered images:', this.galleryImages); // Debug log
    if (this.galleryImages.length === 0) {
      this.errorMessage = 'No images found with the specified field name';
    } else {
      // Split into primary (first 4) and secondary (rest) images
      this.primaryImages = this.galleryImages.slice(0, 4);
      this.secondaryImages = this.galleryImages.slice(4, 10); // Limit to 10 total
    }
  }
}