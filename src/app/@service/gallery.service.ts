// gallery.service.ts

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface GalleryResponse {

  count: number;

  next: string | null;

  previous: string | null;

  results: GalleryItem[];

  numeric_stats: any;

}

export interface GalleryItem {

  id: number;

  data: any;

  form_slug: string;

  submitted_at: string;

  file_data: GalleryFile[];

  updated_at: string;

  submitted_by: string;

  updated_by: string | null;

  submit_by: number;

  update_by: number | null;

  update_by_full_name: string;

  submit_by_full_name: string;

}

export interface GalleryFile {

  id: number;

  form_data: number;

  file: string;

  updated_by: string | null;

  field_name: string;

  is_deleted: boolean;

}

@Injectable({

  providedIn: 'root'

})

export class GalleryService {

  private apiUrl = 'https://sayalisanchi.buildprohub-server.com/tenant_user_custom_app/third_party/website-gallery/third_party_data/';

  constructor(private http: HttpClient) { }

  getGalleryImages(): Observable<GalleryResponse> {

    return this.http.get<GalleryResponse>(this.apiUrl);

  }

}
