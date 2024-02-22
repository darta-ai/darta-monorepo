export interface BatchImages {
  fileBuffer: Buffer;
  fileName: string;
}

export interface ImageNeeds {
  fileBuffer: ArrayBuffer | string;
  fileName: string;
  bucketName: string;
}

export interface ImageData {
  etag: string;
  fileName: string;
}

export type ImageSize = "largeImage" | "mediumImage" | "smallImage";

export type ImageDataArray = {
  [K in ImageSize] :  ImageData
}

export interface IImageService {
  // eslint-disable-next-line no-empty-pattern
  uploadImage({}: ImageNeeds): Promise<any>;
  resizeAndUploadImages({
    bucketName,
    fileName,
    fileBuffer,
  }: {
    bucketName: string;
    fileName: string;
    fileBuffer: any;
  }): Promise<ImageData[]> 
  fetchImage({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }): Promise<any>;
  compressImage({fileBuffer}: {fileBuffer: any}): Promise<any>
  deleteImage({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }): Promise<any>;
  getPresignedUrl({
    bucketName,
    fileName,
  }: {
    bucketName: string;
    fileName: string;
  }): Promise<any>;
  shouldRegenerateUrl({
    url
  }: {url: string}): boolean;
}
