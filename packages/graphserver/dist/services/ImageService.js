const __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    let c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (let i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
const __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
const __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', {value: true});
exports.ImageService = void 0;
const inversify_1 = require('inversify');
const minio_1 = require('minio');

let ImageService = (exports.ImageService = class ImageService {
  constructor(minio) {
    this.minio = minio;
  }

  uploadImage({bucketName, fileName, fileBuffer}) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const bucketExists = yield this.checkBucketExists(bucketName);
        if (!bucketExists) {
          yield this.createBucket(bucketName);
        }
        const etag = yield this.putObjectToBucket({
          bucketName,
          fileName,
          fileBuffer,
        });
        return {
          fileName,
          etag,
        };
      } catch (err) {
        throw new Error(err.message);
      }
    });
  }

  checkBucketExists(bucketName) {
    return new Promise((resolve, reject) => {
      this.minio.bucketExists(bucketName, (err, exists) => {
        if (err) {
          reject(err);
        } else {
          resolve(exists);
        }
      });
    });
  }

  createBucket(bucketName) {
    return new Promise((resolve, reject) => {
      this.minio.makeBucket(bucketName, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  putObjectToBucket({bucketName, fileName, fileBuffer}) {
    const matches = fileBuffer.match(/^data:(image\/[A-z]*);base64,/);
    if (!matches) {
      return Promise.reject(new Error('Invalid base64 format'));
    }
    const mimeType = matches[1];
    const base64String = fileBuffer.replace(matches[0], '');
    const imageBuffer = Buffer.from(base64String, 'base64');
    return new Promise((resolve, reject) => {
      const metadata = {
        'Content-type': mimeType,
        CacheControl: 'no-cache',
      };
      this.minio.putObject(
        bucketName,
        fileName,
        imageBuffer,
        400,
        metadata,
        (err, etag) => {
          if (err) {
            reject(err);
          } else {
            resolve(etag);
          }
        },
      );
    });
  }

  deleteImage({bucketName, fileName}) {
    return this.minio.removeObjects(bucketName, [fileName]);
  }

  fetchImage({fileName, bucketName}) {
    return new Promise((resolve, reject) => {
      this.minio.presignedGetObject(bucketName, fileName, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
});
exports.ImageService = ImageService = __decorate(
  [
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('MinioClient')),
    __metadata('design:paramtypes', [minio_1.Client]),
  ],
  ImageService,
);
