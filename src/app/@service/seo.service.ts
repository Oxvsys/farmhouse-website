import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface MetaData {
    title: string,
    description: string,
    image: string,
    keywords: string,
    authors?: string,
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly appTitle = 'Page Perk | Enhance the power of single page';
    private readonly appDescription = 'Best Single Page Applications | Digital Marketing Tools';

    constructor(
        private readonly metaTagService: Meta,
        private readonly titleService: Title
    ) { }

    initDefaultMetaInformation(): void {
        this.titleService.setTitle(this.appTitle);

        this.metaTagService.addTags([
            { name: 'robots', content: 'index, follow' },
            // {name: 'author', content: ''},
        ]);
    }


    setTitle(title: string): void {
        this.titleService.setTitle(title);
    }

    updateMetaData(metaData: MetaData): void {

        const tags = [
            { name: 'description', content: metaData.description },
            { name: 'keywords', content: metaData.keywords },
            { name: 'author', content: metaData.authors ? metaData.authors : "" },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:image', content: metaData.image },
            { name: 'twitter:title', content: metaData.title },
            { name: 'twitter:description', content: metaData.description },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black translucent' },
            { name: 'apple-mobile-web-app-title', content: metaData.title },
            { name: 'apple-touch-startup-image', content: metaData.image },
            { name: 'og:title', content: metaData.title },
            { name: 'og:description', content: metaData.description },
            { name: 'image', property: 'og:image', content: metaData.image },];

        tags.forEach((tag: any) => this.metaTagService.updateTag(tag));
    }
}

