/* eslint-disable class-methods-use-this */
import { Dimensions, Exhibition, Images } from '@darta-types/dist';
import axios from 'axios';
import { Buffer } from 'buffer';
import { load } from 'cheerio';
import {inject, injectable} from 'inversify';

import { standardConsoleLog } from '../config/templates';
import { IAdminService,IArtworkService,IExhibitionService, IScrapeService } from './interfaces';

interface GalleryKeys {
  galleryName: string;
  artworkDataFunction: ({baseUrl, $}: {baseUrl:string, $: any}) => any;
  artworkDataFunctionBackup?: ({baseUrl, $}: {baseUrl:string, $: any}) => any;
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

        const functions = this.getKeysFromGalleryId(galleryId);
        
        let artworks = await functions?.artworkDataFunction({baseUrl, $});

        const validArtworks = artworks.filter((artwork: any) => 
          artwork.artworkTitle && 
          artwork.artworkCreatedYear && 
          artwork.artworkMedium && 
          artwork.artworkDimensions.heightIn && 
          artwork.artworkDimensions.widthIn && 
          artwork.artworkImage
        );
        if (!validArtworks.length && functions?.artworkDataFunctionBackup){
          artworks = await functions?.artworkDataFunctionBackup!({baseUrl, $});
        }
        if (artworks){
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
        }
      }catch (e) {
        throw new Error(`Failed to generate artworks from ${url}, error: ${e}`);
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

  private async getArtworksFromArtLogicVersion1(
    // baseUrl: string,
    // $: any,
    {baseUrl, $}: {baseUrl: string, $: any},
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
      
      const convertToDecimal = (value: string) => {
        const match = value.trim().match(/^(\d+)(?:\s+(\d+)\/(\d+))?$/);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, whole, numerator, denominator] = match;
          const decimal = numerator && denominator
            ? Number(whole) + Number(numerator) / Number(denominator)
            : Number(whole);
          return decimal.toString();
        }
        return value;
      };
    

      const parseDimension = (dimensionStr: string) => {
        // eslint-disable-next-line max-len
        const threeDimensionalMatch = dimensionStr.trim().match(/^(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)?\s*(?:in|cm)?/i);
        const twoDimensionalMatch = dimensionStr.trim().match(/^(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)\s*(?:in|cm)?/i);
      
        if (threeDimensionalMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width, depth] = threeDimensionalMatch;
          return {
            heightIn: convertToDecimal(height?.trim() || '0'),
            widthIn: convertToDecimal(width?.trim() || '0'),
            depthIn: convertToDecimal(depth?.trim() || '0'),
          };
        } if (twoDimensionalMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width] = twoDimensionalMatch;
          return {
            heightIn: convertToDecimal(height?.trim() || '0'),
            widthIn: convertToDecimal(width?.trim() || '0'),
            depthIn: '0',
          };
        }
        return {
          heightIn: '0',
          widthIn: '0',
          depthIn: '0',
        };
      };
      
      const dimensionsStr = dimensions.split('\n')[0];
      const artworkDimensions = parseDimension(dimensionsStr);
      

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
    {baseUrl, $}: {baseUrl: string, $: any},
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
  
      const artistName = $artwork('#content_module .artist a').text().trim();
      const artworkTitle = $artwork('#content_module .title').text().trim();
      const artworkCreatedYear = artworkTitle.match(/(\d{4})$/)?.[1] || '';
      const artworkMedium = $artwork('#content_module .medium').text().trim();
      const dimensions = $artwork('#content_module .dimensions').text().trim();
  
      const convertToDecimal = (value: string) => {
        const match = value.trim().match(/^(\d+)(?:\s+(\d+)\/(\d+))?$/);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, whole, numerator, denominator] = match;
          const decimal = numerator && denominator
            ? Number(whole) + Number(numerator) / Number(denominator)
            : Number(whole);
          return decimal.toString();
        }
        return value;
      };
  
      const parseDimension = (dimensionStr: string) => {
        // eslint-disable-next-line max-len
        const threeDimensionalMatch = dimensionStr.trim().match(/^(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)?\s*(?:in|cm)?/i);
        const twoDimensionalMatch = dimensionStr.trim().match(/^(\d+(?:\s+\d+\/\d+)?)\s*(?:x)\s*(\d+(?:\s+\d+\/\d+)?)\s*(?:in|cm)?/i);
  
        if (threeDimensionalMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width, depth] = threeDimensionalMatch;
          return {
            heightIn: convertToDecimal(height?.trim() || '0'),
            widthIn: convertToDecimal(width?.trim() || '0'),
            depthIn: convertToDecimal(depth?.trim() || '0'),
          };
        } if (twoDimensionalMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width] = twoDimensionalMatch;
          return {
            heightIn: convertToDecimal(height?.trim() || '0'),
            widthIn: convertToDecimal(width?.trim() || '0'),
            depthIn: '0',
          };
        }
  
        return {
          heightIn: '0',
          widthIn: '0',
          depthIn: '0',
        };
      };
  
      const dimensionsStr = dimensions.split('\n')[0];
      const artworkDimensions = parseDimension(dimensionsStr);
        
      // Extract the image URL from the HTML
      // Extract the image URL from the HTML
      let artworkImageUrl = $('#image_container_wrapper #image_container .item img').attr('src');

      // If the 'src' attribute is not present, try getting the URL from 'data-src' attribute
      if (!artworkImageUrl) {
        artworkImageUrl = $('#image_container_wrapper #image_container .item img').attr('data-src');
      }

      // If the 'data-src' attribute is not present, try getting the URL from 'data-responsive-src' attribute
      if (!artworkImageUrl) {
        const $artwork2 = $('#image_container_wrapper #image_container .item img');
        const responsiveSrcJson = $artwork2.attr('data-responsive-src');
        if (responsiveSrcJson) {
          const responsiveSrcObj = JSON.parse(responsiveSrcJson);
          artworkImageUrl = responsiveSrcObj['1400']; // Change the key to the desired width
        }
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
  
  private async getArtworksFromArtLogicVersion3(
    // baseUrl: string,
    // $: any,
    {baseUrl, $}: {baseUrl: string, $: any},
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
        const match = dimensionStr.trim().match(/^(\d+(?:\.\d+)?)\s*(?:x\s*(\d+(?:\.\d+)?)\s*(?:x\s*(\d+(?:\.\d+)?))?)?/);
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
      
      const heightIn = parsedDimensions[0]?.toString();
      const widthIn = parsedDimensions[1]?.toString();
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

  private async getArtworksFromKatesFerriProjects({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    };
    artworkImage: Images;
    artworkPrice: string;
  }>> {
    const artworkPromises = $('.sqs-block.image-block').map(async (index: number, element: any) => {
      const figureElement = $(element).find('figure.sqs-block-image-figure');
      const imgElement = figureElement.find('img');
      const captionElement = figureElement.find('figcaption .image-caption p');
  
      const captionText = captionElement.text().trim();
      const colonIndex = captionText.indexOf(':');
  
      if (colonIndex === -1) {
        return null;
      }
  
      const artistName = captionText.substring(0, colonIndex).trim();
      const artworkInfo = captionText.substring(colonIndex + 1).trim();
  
      const openParenIndex = artworkInfo.indexOf('(');
      const closeParenIndex = artworkInfo.indexOf(')');
  
      if (openParenIndex === -1 || closeParenIndex === -1) {
        return null;
      }
  
      const artworkTitle = artworkInfo.substring(0, openParenIndex).trim();
      const artworkCreatedYear = artworkInfo.substring(openParenIndex + 1, closeParenIndex);
  
      const dimensionsRegex1 = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:x\s*(\d+(?:\.\d+)?))?\s*inches/;
      const dimensionsRegex2 = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*inches/;
      const dimensionsRegex3 = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*inches/;
      const dimensionsRegex4 = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(?:feet|foot|ft)(?:\.)?/;
      
      let artworkMedium = '';
      const artworkDimensions = {
        heightIn: '',
        widthIn: '',
        depthIn: '',
      };
      let artworkPrice = '';
  
      const artworkInfoAfterYear = artworkInfo.substring(closeParenIndex + 1).trim();
  
      if (dimensionsRegex1.test(artworkInfoAfterYear)) {
        const dimensionsMatch = artworkInfoAfterYear.match(dimensionsRegex1);
        if (dimensionsMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width, depth] = dimensionsMatch;
          artworkMedium = artworkInfoAfterYear.substring(0, dimensionsMatch.index).trim().replace(/,\s*$/, '');
          artworkDimensions.heightIn = height;
          artworkDimensions.widthIn = width;
          artworkDimensions.depthIn = depth || '';
          artworkPrice = artworkInfoAfterYear.substring(dimensionsMatch.index + dimensionsMatch[0].length).trim();
        }
      } else if (dimensionsRegex2.test(artworkInfoAfterYear)) {
        const dimensionsMatch = artworkInfoAfterYear.match(dimensionsRegex2);
        if (dimensionsMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width] = dimensionsMatch;
          artworkMedium = artworkInfoAfterYear.substring(0, dimensionsMatch.index).trim().replace(/,\s*$/, '');
          artworkDimensions.heightIn = height;
          artworkDimensions.widthIn = width;
          artworkPrice = artworkInfoAfterYear.substring(dimensionsMatch.index + dimensionsMatch[0].length).trim();
        }
      } else if (dimensionsRegex3.test(artworkInfoAfterYear)) {
        const dimensionsMatch = artworkInfoAfterYear.match(dimensionsRegex3);
        if (dimensionsMatch) {
          artworkMedium = artworkInfoAfterYear.substring(0, dimensionsMatch.index).trim().replace(/,\s*$/, '');
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, height, width, depth] = dimensionsMatch; // Use array destructuring
          artworkDimensions.heightIn = height;
          artworkDimensions.widthIn = width;
          artworkDimensions.depthIn = depth;
          artworkPrice = artworkInfoAfterYear.substring(dimensionsMatch.index + dimensionsMatch[0].length).trim();
        }
      } else if (dimensionsRegex4.test(artworkInfoAfterYear)) {
        const dimensionsMatch = artworkInfoAfterYear.match(dimensionsRegex4);
        if (dimensionsMatch) {
          artworkMedium = artworkInfoAfterYear.substring(0, dimensionsMatch.index).trim().replace(/,\s*$/, '');
          artworkDimensions.heightIn = (parseFloat(dimensionsMatch[1]) * 12).toString();
          artworkDimensions.widthIn = (parseFloat(dimensionsMatch[2]) * 12).toString();
          artworkPrice = artworkInfoAfterYear.substring(dimensionsMatch.index + dimensionsMatch[0].length).trim();
        }
      } else {
        standardConsoleLog({message: 'Could not parse dimensions', data: artworkInfoAfterYear, request: "parsing kates ferri artwork"});
        return null;
      }
  
      const artworkImageUrl = imgElement.attr('data-src');
  
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
        artworkPrice,
      };
    }).get();
  
    const artworks = await Promise.all(artworkPromises);
    const filteredArtworks = artworks.filter((artwork) => artwork !== null);
  
    return filteredArtworks;
  }

  private async getArtworksFroKiSmith({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    };
    artworkImage: Images;
  }>> {
    const artworkPromises = $('ul[data-hook="product-list-wrapper"] li[data-hook="product-list-grid-item"]').map(async (index: number, element: any) => {
      const artworkUrl = $(element).find('a[data-hook="product-item-container"]').attr('href');
  
      if (!artworkUrl) {
        return null;
      }
  
      const artworkResponse = await axios.get(artworkUrl);
      const $artwork = load(artworkResponse.data);
  
      const titleElement = $artwork('h1[data-hook="product-title"]');
      const descriptionElement = $artwork('pre[data-hook="description"]');
  
      const titleText = titleElement.text().trim();
      const [artworkTitle, artworkCreatedYear] = titleText.split(', ');
        
      const dimensionsText = descriptionElement.children().eq(0).text().trim();
      const artworkMedium = descriptionElement.children().eq(1).text().trim();
      const artistName = descriptionElement.children().eq(3).text().trim();  

      const convertToDecimal = (value: string) => {
        const match = value.trim().match(/^(\d+)(?:\s+(\d+)\/(\d+))?$/);
        if (match) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const [_, whole, numerator, denominator] = match;
          const decimal = numerator && denominator
            ? Number(whole) + Number(numerator) / Number(denominator)
            : Number(whole);
          return decimal.toString();
        }
        return value;
      };
  
      const dimensionsRegex = /([\d.]+(?:\s+\d+\/\d+)?)\s*(?:x|×)\s*([\d.]+(?:\s+\d+\/\d+)?)\s*(?:x|×)\s*([\d.]+(?:\s+\d+\/\d+)?)\s*(?:in|inches)?/i;
      const dimensionsMatch = dimensionsText.match(dimensionsRegex);
      const artworkDimensions = {
        heightIn: '',
        widthIn: '',
        depthIn: '',
      };
  
      if (dimensionsMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const [_, height, width, depth] = dimensionsMatch;
        artworkDimensions.heightIn = convertToDecimal(height);
        artworkDimensions.widthIn = convertToDecimal(width);
        artworkDimensions.depthIn = convertToDecimal(depth);
      }
      const artworkImageElement = $artwork('div[data-hook="ProductImageDataHook.ProductImage"] img');
      const artworkImageUrl = artworkImageElement.attr('src');
  
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
    }).get();
  
    const artworks = await Promise.all(artworkPromises);
    const filteredArtworks = artworks.filter((artwork) => artwork !== null);
  
    return filteredArtworks;
  }

  private async getArtworksForFierman({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    };
    artworkImage: Images;
  }> | void> {
    try {
      const gallery = $('.sqs-gallery');
      if (gallery.length === 0) {
        return [];
      }
  
      const artworks = await Promise.all(gallery.children().map(async (index: any, element: any) => {
        const $element = $(element);
        const $anchor = $element.find('a.image-slide-anchor');
        
        if ($anchor.length === 0) {
          return null;
        }
  
        const description = $anchor.attr('data-description');
        if (!description) {
          return null;
        }
  
        const descriptionText = $('<div>').html(description).text().trim();
        
        // Split the description into parts
        const parts = descriptionText.split(',');
        
        // Extract artist name and title
        const artistNameAndTitle = parts[0].trim().split(' ');
        const artistName = artistNameAndTitle.slice(0, 2).join(' '); // Assume first two words are the artist name
        const artworkTitle = artistNameAndTitle.slice(2).join(' ');
  
        // Extract year and rest of the information
        const yearAndRest = parts.slice(1).join(',').trim();
        const yearMatch = yearAndRest.match(/^\d{4}/);
        const artworkCreatedYear = yearMatch ? yearMatch[0] : '';
  
        // Extract medium and dimensions
        const mediumAndDimensions = yearAndRest.replace(artworkCreatedYear, '').trim();
        const dimensionsIndex = mediumAndDimensions.search(/\d+h\s*x\s*\d+w/);
        
        let artworkMedium = '';
        let dimensions = '';
        
        if (dimensionsIndex !== -1) {
          artworkMedium = mediumAndDimensions.slice(0, dimensionsIndex).trim();
          dimensions = mediumAndDimensions.slice(dimensionsIndex).trim();
        } else {
          artworkMedium = mediumAndDimensions;
        }
  
        // Parse dimensions
        const dimensionsMatch = dimensions.match(/(\d+(?:\s+\d+\/\d+)?)h\s*x\s*(\d+(?:\s+\d+\/\d+)?)w(?:\s*x\s*(\d+(?:\s+\d+\/\d+)?)d)?\s*in/);
        const artworkDimensions = {
          heightIn: dimensionsMatch?.[1] || '',
          widthIn: dimensionsMatch?.[2] || '',
          depthIn: dimensionsMatch?.[3] || '',
        };
  
        const artworkImageUrl = $anchor.attr('href');
        const artworkImage: Images = {
          value: artworkImageUrl || '',
          fileData: '',
          fileName: artworkTitle,
        };
  
        // Fetch and process the image
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
      }).get());
  
      const validArtworks = artworks.filter((artwork: any) => artwork !== null);
      return validArtworks;
    } catch (error) {
      throw new Error('Error fetching artworks from Fierman gallery');
    }
  }
  
  private async getArtworksForLubov({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    };
    artworkImage: Images;
  }> | void> {
    try {
      const gallery = $('.sqs-gallery');
      if (gallery.length === 0) {
        return [];
      }
  
      const artworks = await Promise.all(gallery.children('.image-wrapper').map(async (index: any, element: any) => {
        const $element = $(element);
        const $img = $element.find('img');
        const $meta = $element.next('.meta');
        
        if ($img.length === 0 || $meta.length === 0) {
          return null;
        }
  
        const description = $meta.find('.meta-description p').text().trim();
        if (!description || description.toLowerCase().includes('installation') || description.toLowerCase().includes('(detail)')){
          return null;
        }
  
        // Extract artist name and title
        const titleMatch = description.match(/^(?:([^,]+),\s*)?(.+?),/);
        const artistName = titleMatch?.[1]?.trim() || 'Unknown Artist';
        const artworkTitle = titleMatch?.[2]?.trim().replace(/^[^A-Za-z]+/, '') || '';
  
        // Extract year, medium, and dimensions
        const remainingDesc = description.substring(description.indexOf(',') + 1).trim();
        const parts = remainingDesc.split('.').map((part: string) => part.trim());
  
        const yearMatch = parts[0].match(/\d{4}/);
        const artworkCreatedYear = yearMatch ? yearMatch[0] : '';
  
        const artworkMedium = parts[1] || '';
  
        const dimensionsMatch = description.match(/(\d+(?:\s+\d+\/\d+)?)(?:\s*x\s*(\d+(?:\s+\d+\/\d+)?))?(?:\s*x\s*(\d+(?:\s+\d+\/\d+)?))?\s*inches?/);
        const artworkDimensions = {
          heightIn: dimensionsMatch?.[1] || '',
          widthIn: dimensionsMatch?.[2] || '',
          depthIn: dimensionsMatch?.[3] || '',
        };
  
        const artworkImageUrl = $img.attr('data-src');
        const artworkImage: Images = {
          value: artworkImageUrl || '',
          fileData: '',
          fileName: artworkTitle,
        };
  
        // Fetch and process the image
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
      }).get());
  
      const validArtworks = artworks.filter((artwork: any) => artwork !== null);
      return validArtworks;
    } catch (error) {
      return [];
    }
  }


  private async getArtworksForFrancoisGhebaly({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
      depthIn: string;
    };
    artworkImage: Images;
  }> | void> {
    try {
      const artworks: any[] = [];
  
      $('.column-image').each((index: number, element: any) => {
        const $element = $(element);
        const $img = $element.find('img');
        const $description = $element.closest('.masonry-item').find('.wysiwyg-ce p[data-font-size="11px"], .wysiwyg-ce p[data-font-size="12px"]');
        
        if ($img.length === 0 || $description.length === 0) {
          return;
        }
  
        const imageUrl = $img.attr('src') || '';
        const description = $description.text().trim();

        if (!description || description.toLowerCase().includes('installation') || description.toLowerCase().includes('(detail)')){
          return;
        }

      const parts = description.split(', ');
      if (parts.length < 4) {
        standardConsoleLog({
          message: `Unexpected description format: ${description}`, data: description, request: "parsing francois ghebaly artwork"
        });
        return;
      }

      const artistName = parts[0];
      const artworkTitle = parts[1];
      const artworkCreatedYear = parts[2].split('.')[0];
      const artworkMedium = parts[2].split('.')[1];

      // Extract dimensions
      const dimensionsPart = description.split(', ').slice(-1)[0];
      const dimensionsMatch = dimensionsPart.match(/(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+(?:\.\d+)?))?\s*inches/);
      const artworkDimensions = {
        heightIn: dimensionsMatch?.[1] || '',
        widthIn: dimensionsMatch?.[2] || '',
        depthIn: dimensionsMatch?.[3] || '',
      };

        const artworkImage: Images = {
          value: imageUrl,
          fileData: '',
          fileName: artworkTitle,
        };
  
        artworks.push({
          artistName,
          artworkTitle,
          artworkCreatedYear,
          artworkMedium,
          artworkDimensions,
          artworkImage,
        });
      });
    
      // Fetch images
      const artworksWithImages = await Promise.all(artworks.map(async (artwork) => {
        if (artwork.artworkImage.value) {
          try {
            const response = await axios.get(artwork.artworkImage.value, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const base64 = buffer.toString('base64');
            const fileExtension = artwork.artworkImage.value.split('.').pop()?.toLowerCase() || 'jpg';
            // eslint-disable-next-line no-param-reassign
            artwork.artworkImage.fileData = `data:image/${fileExtension};base64,${base64}`;
          } catch (error: any) {
            // eslint-disable-next-line no-param-reassign
            artwork.artworkImage.value = '';
          }
        }
        return artwork;
      }));
  
      return artworksWithImages;
    } catch (error) {
      return [];
    }
  }
    
  private async getArtworksForSusanEleyFineArt({ $ }: { $: any }): Promise<Array<{
    artistName: string;
    artworkTitle: string;
    artworkCreatedYear: string;
    artworkMedium: string;
    artworkDimensions: {
      heightIn: string;
      widthIn: string;
    };
    artworkImage: Images;
  }> | void> {
    try {
      const artworks: any[] = [];
      $('.jcarousel li').each((index: number, element: any) => {
        const $element = $(element);
        const $caption = $element.find('.caption');
        const $img = $element.find('img');

        if ($caption.length === 0 || $img.length === 0) {
          return;
        }

        const captionText = $caption.text().trim();
        const imageUrl = $img.attr('src') || '';

        const description = captionText.replace(/^\(\d+\/\d+\)/, '').replace(/\s*Inquire$/, '').trim();

        const parts = description.split(', ');
        if (parts.length < 4) {
          return;
        }
      
        const artistName = parts[0];
        const artworkTitle = parts[1].replace(/\s*\(\d{4}\)$/, '');
        const artworkCreatedYear = parts[1].match(/\((\d{4})\)$/)?.[1] || '';
        const artworkMedium = parts[2];
      
        // Extract dimensions
        const dimensionsPart = parts[parts.length - 1];
        const dimensionsMatch = dimensionsPart.match(/(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?(?:\s*x\s*(\d+(?:\.\d+)?))?\s*(in|inches)/i);
                
        const artworkDimensions = {
          heightIn: dimensionsMatch?.[1] || '',
          widthIn: dimensionsMatch?.[2] || '',
          depthIn: dimensionsMatch?.[3] || '',
        };

        const artworkImage: Images = {
          value: imageUrl,
          fileData: '',
          fileName: artworkTitle,
        };
  
        artworks.push({
          artistName,
          artworkTitle,
          artworkCreatedYear,
          artworkMedium,
          artworkDimensions,
          artworkImage,
        });
      });


      // Fetch images
      const artworksWithImages = await Promise.all(artworks.map(async (artwork) => {
        if (artwork.artworkImage.value) {
          try {
            const response = await axios.get(artwork.artworkImage.value, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const base64 = buffer.toString('base64');
            const fileExtension = artwork.artworkImage.value.split('.').pop()?.toLowerCase() || 'jpg';
            // eslint-disable-next-line no-param-reassign
            artwork.artworkImage.fileData = `data:image/${fileExtension};base64,${base64}`;
          } catch (error: any) {
            // eslint-disable-next-line no-param-reassign
            artwork.artworkImage.value = '';
          }
        }
        return artwork;
      }));

  
      return artworksWithImages;
    } catch (error) {
      return [];
    }
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
    switch (galleryId) {
      case 'Galleries/183505181':
        return {
          galleryName: 'Massey Klein',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        };
      case 'Galleries/80753011':
        return {
          galleryName: 'Yi Gallery',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        };
      case 'Galleries/185714669':
        return {
          galleryName: 'Trotter&Sholer',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        };
      case 'Galleries/184287215':
        return {
          galleryName: 'Thomas Nickles',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        };
      case 'Galleries/38504882':
        return {
          galleryName: 'Kates Ferri Projects',
          artworkDataFunction: this.getArtworksFromKatesFerriProjects,
        };
      case 'Galleries/182933530':
        return {
          galleryName: 'Natalie Karg',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
          artworkDataFunctionBackup: this.getArtworksFromArtLogicVersion2,
        };
      case 'Galleries/67002969':
        return {
          galleryName: 'Ki Smith Gallery',
          artworkDataFunction: this.getArtworksFroKiSmith,
        };
      case 'Galleries/48836334':
        return {
          galleryName: 'Fierman',
          artworkDataFunction: this.getArtworksForFierman,
        };
      case 'Galleries/199209101':
        return {
          galleryName: 'Lubov',
          artworkDataFunction: this.getArtworksForLubov,
        };
      case 'Galleries/48715540':
        return {
          galleryName: 'Francois Ghebaly',
          artworkDataFunction: this.getArtworksForFrancoisGhebaly,
        };
      case 'Galleries/66737890':
        return {
          galleryName: 'Susan Eley Fine Art',
          artworkDataFunction: this.getArtworksForSusanEleyFineArt,
        };
      default:
        return {
          galleryName: 'Default',
          artworkDataFunction: this.getArtworksFromArtLogicVersion1,
        };
    }
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

