/* eslint-disable class-methods-use-this */
import { Dimensions, Exhibition, Images } from '@darta-types/dist';
import axios from 'axios';
import { Buffer } from 'buffer';
import { load } from 'cheerio';
import {inject, injectable} from 'inversify';
import fetch from 'node-fetch';

import { IAdminService,IArtworkService,IExhibitionService, IScrapeService } from './interfaces';

type HighLevelData = {
  artistName: string;
  showTitle: string;
  dates: string;
};

interface GalleryKeys {
  galleryName: string;
  pressRelease: string;
  highLevelData: {
    artistName: string;
    showTitle: string;
    dates: string;
  };
  pressReleaseFunction: (data: any, key: string) => string;
  highLevelDataFunction: (data: any, keys: HighLevelData) => any;
  artworkDataFunction: (baseUrl:string, $: any, url: string) => any;
  artworkHref: string;
  artworkData?: {
    artistName: string;
    artworkTitle: string;
    year: string;
    medium: string;
    dimensions: string;
    artworkImageUrl?: string;
  };
}

@injectable()
export class ScrapeService implements IScrapeService {
  constructor(
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
    @inject('IAdminService') private readonly adminService: IAdminService,
  ) {}

  // public async scrapeFromArtLogic({ url, galleryId, userId }: { url: string; galleryId: string, userId: string }): Promise<Exhibition | void> {
  //   try {
      
  //     const keys = this.getKeysFromGalleryId(galleryId);

  //     if (!keys) {
  //       throw new Error('Gallery ID not found');
  //     }
  
  //     const baseUrl = this.parseBaseUrl(url);
  
  //     const response = await axios.get(url);
  //     const $ = load(response.data);
  
  //     const pressRelease = keys.pressReleaseFunction($, keys.pressRelease);
  
  //     const { artistName, showTitle, startDate, endDate } = keys.highLevelDataFunction($, keys.highLevelData);
          
  //     const artworks = await keys.artworkDataFunction(baseUrl, $, url);

  //     const exhibition = await this.saveExhibitionForAdmin({
  //       artistName, galleryId, userId, showTitle, pressRelease, startDate, endDate})
  
  //     if (!exhibition){
  //       throw new Error('Failed to save exhibition');
  //     }
  
  //     try {
  //       await Promise.all(
  //         artworks.map((artwork: any, index: any) =>
  //           this.saveArtworkForAdmin({
  //             galleryId,
  //             exhibitionId: exhibition._id!,
  //             artistName: artwork.artistName,
  //             artworkTitle: artwork.artworkTitle,
  //             year: artwork.artworkCreatedYear,
  //             medium: artwork.artworkMedium,
  //             dimensions: {
  //               heightIn: {value : artwork.artworkDimensions.heightIn},
  //               widthIn: {value : artwork.artworkDimensions.widthIn},
  //               depthIn: {value : artwork.artworkDimensions.depthIn},
  //               text: {value: this.createDimensionsString({heightIn: artwork.artworkDimensions.heightIn, widthIn: artwork.artworkDimensions.widthIn, depthIn: artwork.artworkDimensions.depthIn})},
  //               heightCm: {
  //                 value: this.convertInchesToCentimeters(artwork.artworkDimensions.heightIn),
  //               },
  //               widthCm: {
  //                 value: this.convertInchesToCentimeters(artwork.artworkDimensions.widthIn),
  //               },
  //               depthCm: {
  //                 value: this.convertInchesToCentimeters(artwork.artworkDimensions.depthIn),
  //               },
  //               displayUnit: {
  //                 value: 'in' as 'in' | 'cm',
  //               }
  //             },
  //             artworkImage: artwork.artworkImage,
  //             index,
  //           })
  //         )
  //       );
  //     } catch (e) {
  //       return
  //     }
  
  
  //     return this.adminService.getExhibitionForGallery({exhibitionId: exhibition._id!});
  //   } catch (e) {
  //     return; 
  //   }
  // }

  public async generateArtworksFromArtLogicUrl({ 
    url, galleryId, exhibitionId }: { url: string; galleryId: string; userId: string, exhibitionId: string }): Promise<Exhibition | void>{

      try {
        const baseUrl = this.parseBaseUrl(url);
  
        const response = await axios.get(url);
        const $ = load(response.data);
        
        const artworks = await this.getArtworksFromArtLogicVersion1(baseUrl, $);

        for (const [index, artwork] of artworks.entries()) {
          // eslint-disable-next-line no-await-in-loop
          await this.saveArtworkForAdminWithDuplicates({
            galleryId,
            exhibitionId: exhibitionId!,
            artistName: artwork.artistName,
            artworkTitle: artwork.artworkTitle,
            year: artwork.artworkCreatedYear,
            medium: artwork.artworkMedium,
            dimensions: {
              heightIn: { value: artwork.artworkDimensions.heightIn },
              widthIn: { value: artwork.artworkDimensions.widthIn },
              depthIn: { value: artwork.artworkDimensions.depthIn },
              text: {
                value: this.createDimensionsString({
                  heightIn: artwork.artworkDimensions.heightIn,
                  widthIn: artwork.artworkDimensions.widthIn,
                  depthIn: artwork.artworkDimensions.depthIn,
                }),
              },
              heightCm: {
                value: this.convertInchesToCentimeters(artwork.artworkDimensions.heightIn),
              },
              widthCm: {
                value: this.convertInchesToCentimeters(artwork.artworkDimensions.widthIn),
              },
              depthCm: {
                value: this.convertInchesToCentimeters(artwork.artworkDimensions.depthIn),
              },
              displayUnit: {
                value: 'in' as 'in' | 'cm',
              },
            },
            artworkImage: artwork.artworkImage,
            index,
          });
        }
        
      }catch (e) {
        // console.log(e);
      } 

      return this.adminService.getExhibitionForGallery({exhibitionId});
    }

  private getExhibitionPressReleaseVersion1($: any, key: string): string {
    const data: string[] = [];

    $(key).each((index: number, element: any) => {
      const paragraph = $(element).text().trim();
      data.push(paragraph);
    });

    return data.join('\n');
  }

  private getExhibitionPressReleaseVersion2($: any): string {  

    const pressReleaseContent = $('.description').html();

    // Split the raw press release into paragraphs based on the <p>&nbsp;</p> pattern
    const rawParagraphs = pressReleaseContent.split('<p>&nbsp;</p>');

    const formattedParagraphs = rawParagraphs.map((paragraph: string) => {
      // Remove HTML tags using a regular expression
      const cleanedParagraph = paragraph.replace(/<[^>]*>?/gm, '');

      // Remove newline characters and extra whitespace
      const formattedParagraph = cleanedParagraph.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      return formattedParagraph;
    });

    // Remove empty paragraphs
    const filteredParagraphs = formattedParagraphs.filter((paragraph: string) => paragraph !== '').join('\n');

    return filteredParagraphs;
  }


  private getExhibitionHighLevelDataVersion1($: any, { artistName, showTitle, dates }: HighLevelData): {
    artistName: string;
    showTitle: string;
    startDate: string;
    endDate: string;
  } {
    const extractedArtistName = $(artistName).text()?.trim() || '';
    const extractedShowTitle = $(showTitle).text()?.trim() || '';
    const extractedDates = $(dates).text()?.trim().split(' - ') || [];
    const startDate = extractedDates[0]?.trim() || '';
    const endDate = extractedDates[1]?.trim() || '';

    const [day, month] = startDate.split(' ');
    const currentYear = new Date().getFullYear();
    const updatedDateString = `${month} ${day}, ${currentYear}`;
    let fullStartDate: Date | string = new Date(updatedDateString)
    if (fullStartDate){
      fullStartDate = fullStartDate.toISOString();
    }

    return {
      artistName: extractedArtistName,
      showTitle: extractedShowTitle,
      startDate: fullStartDate,
      endDate: new Date(endDate).toISOString(),
    };
  }


  private getExhibitionHighLevelDataVersion2($: any): {
    artistName: string;
    showTitle: string;
    startDate: string;
    endDate: string;
  } {

    const heroHeader = $('#hero_header');
    const titleElement = heroHeader.find('.title a');
    const subtitleElement = heroHeader.find('.subtitle');

    const showTitle = titleElement.text().trim();
    const subtitleText = subtitleElement.text().trim();

    const artistName = subtitleText.split(' ')[0];
    const datesText = subtitleElement.find('.subtitle_date').text().trim();

    const [startDate, endDate] = datesText.split(' - ');

    const [day, month] = startDate.split(' ');
    const currentYear = new Date().getFullYear();
    const updatedDateString = `${month} ${day}, ${currentYear}`;
    const fullStartDate = new Date(updatedDateString).toISOString();

    return {
      artistName,
      showTitle,
      startDate: fullStartDate,
      endDate: new Date(endDate)?.toISOString(),
    };
  }

  private async getArtworksFromArtLogicVersion1(
    baseUrl: string,
    $: any,
  ): Promise<Array<{ 
    artistName: string; 
    artworkTitle: string; 
    artworkCreatedYear: string;
    artworkMedium: string; 
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    } 
    artworkImage: Images;
  }>> {
    const hrefs: string[] = [];

    $('.subsection-works .records_list .item a').each((index: number, element: any) => {
      const href = $(element).attr('href');
      hrefs.push(href);
    });

    
    // eslint-disable-next-line no-script-url
    const filteredHrefs = hrefs.filter((href) => href !== 'javascript:void(0)');

    const uniqueArray = filteredHrefs.reduce((acc: any, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);

    const artworkPromises = uniqueArray.map(async (href: any) => {
      const artworkUrl = `${baseUrl}${href}`;
      const artworkResponse = await axios.get(artworkUrl);
      const $artwork = load(artworkResponse.data);

      const artistName = $artwork('.artwork_details_wrapper .artist a').text().trim();
      const artworkTitle = $artwork('.artwork_details_wrapper .subtitle .title').text().trim();
      const artworkCreatedYear = $artwork('.artwork_details_wrapper .subtitle .year').text().trim();
      const artworkMedium = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .medium').text().trim();
      const dimensions = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions').text().trim();
      
      const parseDimension = (dimensionStr: string) => {
        const match = dimensionStr.trim().match(/^(\d+)(?:\s+(\d+)\s*\/\s*(\d+))?\s*(\w+)?$/);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, whole, numerator, denominator] = match;
          const parsedValue = numerator && denominator
            ? Number(whole) + Number(numerator) / Number(denominator)
            : Number(whole);
          return parsedValue;
        }
        return 0;
      };
      
      const dimensionsSpilt = dimensions.split('\n')[0].split('x');
      
      const parsedDimensions = dimensionsSpilt.map(parseDimension);
      
      const heightIn = parsedDimensions[0].toString();
      const widthIn = parsedDimensions[1].toString();
      const depthIn = parsedDimensions?.[2]?.toString() ?? "0";

      const artworkDimensions = {
        heightIn,
        widthIn,
        depthIn
      }


    // Extract the image URL from the HTML
    let artworkImageUrl = $artwork('#image_gallery .item .image a').attr('href');

    if (!artworkImageUrl) {
      artworkImageUrl = $artwork('.image img').attr('data-src');
    }

    const artworkImage = {
      value: '',
      fileData: '',
      fileName: artworkTitle,
    };

    if (artworkImageUrl) {
      try {
        const response = await fetch(artworkImageUrl);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        artworkImage.fileData = `data:image/jpeg;base64,${base64}`;
      } catch (error: any) {
        artworkImage.value = '';
      }
    }

      return {
        artistName,
        artworkTitle,
        artworkCreatedYear,
        artworkMedium,
        artworkDimensions,
        artworkImage,
      };
    });

    const artworks = await Promise.all(artworkPromises);

    return artworks;
  }


  private async getArtworksFromArtLogicVersion2(
    baseUrl: string,
    $: any,
    fullUrl?: string,
  ): Promise<Array<{ 
    artistName: string; 
    artworkTitle: string; 
    artworkCreatedYear: string;
    artworkMedium: string; 
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    } 
    artworkImage: Images;
  }>> {

    const worksUrl = fullUrl?.replace('overview', 'works')
    const request = await axios.get(worksUrl!);
    const $fullArtwork = load(request.data);

    const hrefs: string[] = [];

    $fullArtwork('ul.clearwithin li.item a').each((index: number, element: any) => {
      const href = $(element).attr('href');
      hrefs.push(href);
    });
    
    const artworkPromises = hrefs.map(async (href) => {
      const artworkUrl = `${baseUrl}${href}`;
      const artworkResponse = await axios.get(artworkUrl);
      const $artwork = load(artworkResponse.data);

      const artistName = $artwork('.artwork_details_wrapper .artist a').text().trim();
      const artworkTitle = $artwork('.artwork_details_wrapper .subtitle .title').text().trim();
      const artworkCreatedYear = $artwork('.artwork_details_wrapper .subtitle .year').text().trim();
      const artworkMedium = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .medium').text().trim();
      const dimensions = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions').text().trim();
      

      const parseDimension = (dimensionStr: string) => {
        const match = dimensionStr.trim().match(/^(\d+)(?:\s+(\d+)\s*\/\s*(\d+))?\s*(\w+)?$/);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, whole, numerator, denominator] = match;
          const parsedValue = numerator && denominator
            ? Number(whole) + Number(numerator) / Number(denominator)
            : Number(whole);
          return parsedValue;
        }
        return 0;
      };
      
      const dimensionsSpilt = dimensions.split('\n')[0].split('x');
      
      const parsedDimensions = dimensionsSpilt.map(parseDimension);
      
      const widthIn = parsedDimensions[0]?.toString() ?? "0";
      const heightIn = parsedDimensions[1]?.toString() ?? "0";
      const depthIn = parsedDimensions[2]?.toString() ?? "0";
      
      const artworkDimensions = {
        heightIn,
        widthIn,
        depthIn,
      };
      
      // Extract the image URL from the HTML
      const artworkImageUrl = $artwork('.image img').attr('data-src');
      
      const artworkImage = {
        value: '',
        fileData: '',
        fileName: artworkTitle,
      };
      
      if (artworkImageUrl) {
        try {
          const response = await axios.get(artworkImageUrl, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(response.data, 'binary');
          const base64 = buffer.toString('base64');
          const fileExtension = artworkImageUrl.split('.').pop()?.toLowerCase() || 'jpg';
          artworkImage.fileData = `data:image/${fileExtension};base64,${base64}`;
        } catch (error: any) {
          artworkImage.value = '';
        }
      }
      return {
        artistName,
        artworkTitle,
        artworkCreatedYear,
        artworkMedium,
        artworkDimensions,
        artworkImage,
      };
    });

    const artworks = await Promise.all(artworkPromises);
    return artworks;
  }

  private async saveExhibitionForAdmin({artistName, galleryId, userId, showTitle, pressRelease, startDate, endDate}: {
    artistName: string;
    galleryId: string;
    userId: string;
    showTitle: string;
    pressRelease: string;
    startDate: string;
    endDate: string;
  }
  ){

    const exhibition = await this.adminService.createExhibitionForAdmin({galleryId, userId});

    const modifiedExhibition = {
      ...exhibition,
      exhibitionTitle: {value : showTitle},
      exhibitionPressRelease: {value: pressRelease},
      exhibitionDates: {
        // need to update to current year for first part of string
        exhibitionStartDate: {value: startDate},
        exhibitionEndDate: {value: endDate},
        exhibitionDuration: {value: 'Temporary'},
      },
      exhibitionPrimaryImage: {fileData: '', fileName: showTitle},
      exhibitionArtist: {value: artistName},
      published: false,
      exhibitionLocation: {
        isPrivate: false,
      },
      receptionDates: {
        hasReception: {value: 'No'},
        receptionStartTime: {value: ''},
        receptionEndTime: {value: ''},
      }
    }

    const exhibitionResults = await this.adminService.editExhibitionForAdmin({galleryId, exhibition: modifiedExhibition as Exhibition});
    return exhibitionResults;
  }

  // private async saveArtworkForAdmin({galleryId, exhibitionId, artistName, artworkTitle, year, medium, dimensions, artworkImage, index}: {
  //   galleryId: string;
  //   exhibitionId: string;
  //   artistName: string;
  //   artworkTitle: string;
  //   year: string;
  //   medium: string;
  //   dimensions: Dimensions;
  //   artworkImage: Images;
  //   index: number;
  // }) {

  //   const artwork = await this.adminService.createArtworkForAdmin({
  //     galleryId, exhibitionId, exhibitionOrder: index
  //   });

  //   await this.adminService.createExhibitionToArtworkEdgeWithExhibitionOrder({
  //     exhibitionId, artworkId: artwork._id!
  //   });

  //   const edited = await this.adminService.editArtworkForAdmin({
  //     artwork: {
  //       ...artwork,
  //       artistName: {value: artistName},
  //       artworkTitle: {value: artworkTitle},
  //       artworkCreatedYear: {value: year},
  //       artworkMedium: {value: medium},
  //       artworkDimensions: dimensions,
  //       artworkImage: {fileData: artworkImage.fileData, fileName: artworkTitle?.trim() ?? new Date().toISOString()},
  //       canInquire: {value: 'Yes'},
  //     }
  //   });

  //   return edited;
  // }

  private async saveArtworkForAdminWithDuplicates({galleryId, exhibitionId, artistName, artworkTitle, year, medium, dimensions, artworkImage, index}: {
    galleryId: string;
    exhibitionId: string;
    artistName: string;
    artworkTitle: string;
    year: string;
    medium: string;
    dimensions: Dimensions;
    artworkImage: Images;
    index: number;
  }) {

    const isDuplicate = await this.artworkService.checkForDuplicatesWithImageNameAndArtist({
      artistName, artworkTitle, galleryId
    });

    if (isDuplicate) {
      return null;
    }

    const artwork = await this.adminService.createArtworkForAdmin({
      galleryId, exhibitionId, exhibitionOrder: index
    });

    await this.adminService.createExhibitionToArtworkEdgeWithExhibitionOrder({
      exhibitionId, artworkId: artwork._id!
    });

    const edited = await this.adminService.editArtworkForAdmin({
      artwork: {
        ...artwork,
        artistName: {value: artistName},
        artworkTitle: {value: artworkTitle},
        artworkCreatedYear: {value: year},
        artworkMedium: {value: medium},
        artworkDimensions: dimensions,
        artworkImage: {fileData: artworkImage.fileData, fileName: artworkTitle?.trim() ?? new Date().toISOString()},
        canInquire: {value: 'Yes'},
      }
    });

    return edited;
  }


  private getKeysFromGalleryId(galleryId: string): GalleryKeys | null {
    const keys: { [key: string]: GalleryKeys } = {
      'Galleries/183505181': {
        galleryName: 'Massey Klein',
        pressRelease: '.subsection-press_release .content_module.prose p',
        highLevelData: {
          artistName: '.exhibition-header .h1_subtitle',
          showTitle: '.exhibition-header .h1_heading',
          dates: '.exhibition-header .subtitle_date',
        },
        highLevelDataFunction: this.getExhibitionHighLevelDataVersion1,
        pressReleaseFunction: this.getExhibitionPressReleaseVersion1,
        artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        artworkHref: '.subsection-works .records_list .item a',
        artworkData: {
          artistName: '.artwork_details_wrapper .artist a',
          artworkTitle: '.artwork_details_wrapper .subtitle .title',
          year: '.artwork_details_wrapper .subtitle .year',
          medium: '.artwork_details_wrapper .detail_view_module_artwork_caption .medium',
          dimensions: '.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions',
          artworkImageUrl: '#image_gallery .item .image a',
        },
        
      },
      'Galleries/80753011': {
        galleryName: 'Yi Gallery',
        pressRelease: '.subsection-press_release .content_module.prose p',
        highLevelData: {
          artistName: '.exhibition-header .h1_heading',
          showTitle: '.exhibition-header .h1_subtitle',
          dates: '.exhibition-header .subtitle_date',
        },
        highLevelDataFunction: this.getExhibitionHighLevelDataVersion1,
        pressReleaseFunction: this.getExhibitionPressReleaseVersion1,
        artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        artworkHref: '.subsection-works .records_list .item a',
        artworkData: {
          artistName: '.artwork_details_wrapper .artist a',
          artworkTitle: '.artwork_details_wrapper .subtitle .title',
          year: '.artwork_details_wrapper .subtitle .year',
          medium: '.artwork_details_wrapper .detail_view_module_artwork_caption .medium',
          dimensions: '.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions',
          artworkImageUrl: '#image_gallery .item .image a',
        }
      },
      'Galleries/185714669': {
        galleryName: 'Trotter&Sholer',
        pressRelease: '.subsection-press_release .content_module.prose p',
        highLevelData: {
          artistName: '.exhibition-header .h1_subtitle',
          showTitle: '.exhibition-header .h1_heading',
          dates: '.exhibition-header .subtitle_date',
        },
        highLevelDataFunction: this.getExhibitionHighLevelDataVersion2,
        pressReleaseFunction: this.getExhibitionPressReleaseVersion2,
        artworkDataFunction: this.getArtworksFromArtLogicVersion2,
        artworkHref: '.subsection-works .records_list .item a',
        artworkData: {
          artistName: '.artwork_details_wrapper .artist a',
          artworkTitle: '.artwork_details_wrapper .subtitle .title',
          year: '.artwork_details_wrapper .subtitle .year',
          medium: '.artwork_details_wrapper .detail_view_module_artwork_caption .medium',
          dimensions: '.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions',
          artworkImageUrl: '#image_gallery .item .image a',
        },
      },
      'Galleries/184287215': {
        galleryName: 'Thomas Nickles',
        pressRelease: '.subsection-press_release .content_module.prose p',
        highLevelData: {
          artistName: '.exhibition-header .h1_subtitle',
          showTitle: '.exhibition-header .h1_heading',
          dates: '.exhibition-header .subtitle_date',
        },
        highLevelDataFunction: this.getExhibitionHighLevelDataVersion1,
        pressReleaseFunction: this.getExhibitionPressReleaseVersion2,
        artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        artworkHref: '.subsection-works .records_list .item a',
        artworkData: {
          artistName: '.artwork_details_wrapper .artist a',
          artworkTitle: '.artwork_details_wrapper .subtitle .title',
          year: '.artwork_details_wrapper .subtitle .year',
          medium: '.artwork_details_wrapper .detail_view_module_artwork_caption .medium',
          dimensions: '.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions',
          artworkImageUrl: '#image_gallery .item .image a',
        },
      },
      'Galleries/202083685': {
        galleryName: 'Yi Gallery',
        pressRelease: '.subsection-press_release .content_module.prose p',
        highLevelData: {
          artistName: '.exhibition-header .h1_heading',
          showTitle: '.exhibition-header .h1_subtitle',
          dates: '.exhibition-header .subtitle_date',
        },
        highLevelDataFunction: this.getExhibitionHighLevelDataVersion1,
        pressReleaseFunction: this.getExhibitionPressReleaseVersion1,
        artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        artworkHref: '.subsection-works .records_list .item a',
        artworkData: {
          artistName: '.artwork_details_wrapper .artist a',
          artworkTitle: '.artwork_details_wrapper .subtitle .title',
          year: '.artwork_details_wrapper .subtitle .year',
          medium: '.artwork_details_wrapper .detail_view_module_artwork_caption .medium',
          dimensions: '.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions',
          artworkImageUrl: '#image_gallery .item .image a',
        }
      }
    };

    // const artistName = $artwork('.artwork_details_wrapper .artist a').text().trim();
    // const artworkTitle = $artwork('.artwork_details_wrapper .subtitle .title').text().trim();
    // const year = $artwork('.artwork_details_wrapper .subtitle .year').text().trim();
    // const medium = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .medium').text().trim();
    // const dimensions = $artwork('.artwork_details_wrapper .detail_view_module_artwork_caption .dimensions').text().trim();

    return keys[galleryId] || null;
  }

  private updateDateToCurrentYear(dateString: string) {
    const [day, month] = dateString.split(' ');
    const currentYear = new Date().getFullYear();
    const updatedDateString = `${month} ${day}, ${currentYear}`;
    return new Date(updatedDateString).toISOString();
  }
  
  private parseBaseUrl(url: string): string {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  }

  private createDimensionsString = ({
    depthIn,
    heightIn,
    widthIn,
  
  }: {
    depthIn: string;
    heightIn: string;
    widthIn: string;
  }) => {
    const heightCm = this.convertInchesToCentimeters(heightIn);
    const widthCm = this.convertInchesToCentimeters(widthIn);
    const depthCm = this.convertInchesToCentimeters(depthIn);
    if (Number(depthIn)) {
      return `${heightIn} x ${widthIn} x ${depthIn} inches; ${heightCm} x ${widthCm} x ${depthCm} centimeters`;
    } 
      return `${heightIn} x ${widthIn} inches; ${heightCm} x ${widthCm} centimeters`;
  };

  private convertInchesToCentimeters = (
    inches: number | string | null,
  ): string => {
    if (!inches) {
      return '0';
    }
    const centimeters = (Number(inches) * 2.54).toString();
    if (centimeters){
      return this.formatNumber(centimeters);
    }
    return '0';
  };
  
  private convertCentimetersToInches = (
    centimeters: number | string | null,
  ): string => {
    if (!centimeters) {
      return '0';
    }
    const inches = (Number(centimeters) / 2.54).toString();
    return this.formatNumber(inches);
  };
  
  private formatNumber(num: string) {
    const floatNum = parseFloat(num);
  
    if ((Math.round(floatNum * 10) / 10) % 1 === 0) {
      return parseInt(floatNum.toString(), 10).toString();
    }
  
    return floatNum.toFixed(1);
  }
}

