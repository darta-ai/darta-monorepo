import { Artwork, Dimensions } from '@darta/types';
import { Database } from 'arangojs';
import { ImageController } from '../controllers/ImageController';
import { ArtworkNode } from '../models/models';
import { IArtworkService, IEdgeService, IGalleryService, INodeService } from './interfaces';
import { ArtworkAndGallery } from './interfaces/IArtworkService';
export declare class ArtworkService implements IArtworkService {
    private readonly db;
    private readonly imageController;
    private readonly edgeService;
    private readonly nodeService;
    private readonly galleryService;
    constructor(db: Database, imageController: ImageController, edgeService: IEdgeService, nodeService: INodeService, galleryService: IGalleryService);
    createArtwork({ galleryId, exhibitionOrder, exhibitionId, }: {
        galleryId: string;
        exhibitionOrder?: number | null;
        exhibitionId?: string | null;
    }): Promise<Artwork>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    readArtworkAndGallery(artworkId: string): Promise<ArtworkAndGallery>;
    editArtwork({ artwork, }: {
        artwork: Artwork;
    }): Promise<ArtworkNode | null>;
    deleteArtwork({ artworkId, }: {
        artworkId: string;
    }): Promise<boolean>;
    listArtworksByGallery({ galleryId, }: {
        galleryId: string;
    }): Promise<(Artwork | null)[] | null>;
    getArtworkById(artworkId: string): Promise<Artwork | null>;
    confirmGalleryArtworkEdge({ artworkId, galleryId, }: {
        artworkId: string;
        galleryId: string;
    }): Promise<boolean>;
    private getArtworkImage;
    private getArtistFromArtworkId;
    private getMediumFromArtworkId;
    swapArtworkOrder({ artworkId, order, }: {
        artworkId: string;
        order: string;
    }): Promise<ArtworkNode | null>;
    generateArtworkId({ artworkId }: {
        artworkId: string;
    }): string;
    determinePriceBucket(price: string): string;
    determineSizeBucket(dimensions: Dimensions): string;
    determineYearBucket(yearString: string): string;
}
