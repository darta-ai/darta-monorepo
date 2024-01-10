export interface BatchImages {
  fileBuffer: Buffer;
  fileName: string;
}

export interface ImageNeeds {
  fileBuffer: ArrayBuffer | string;
  fileName: string;
  bucketName: string;
}

export interface IImageService {
  // eslint-disable-next-line no-empty-pattern
  uploadImage({}: ImageNeeds): Promise<any>;
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
