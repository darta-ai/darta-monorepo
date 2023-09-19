import { Artwork, Exhibition, IBusinessLocationData } from '@darta/types';
import { Database } from 'arangojs';
import { Client } from 'minio';
import { ImageController } from '../controllers/ImageController';
import { IArtworkService, IEdgeService, IExhibitionService, IGalleryService, INodeService } from './interfaces';
export declare class ExhibitionService implements IExhibitionService {
    private readonly db;
    private readonly edgeService;
    private readonly artworkService;
    private readonly minio;
    private readonly imageController;
    private readonly nodeService;
    private readonly galleryService;
    constructor(db: Database, edgeService: IEdgeService, artworkService: IArtworkService, minio: Client, imageController: ImageController, nodeService: INodeService, galleryService: IGalleryService);
    createExhibition({ galleryId, userId, }: {
        galleryId: string;
        userId: string;
    }): Promise<Exhibition | void>;
    readExhibitionForGallery({ exhibitionId, }: {
        exhibitionId: string;
    }): Promise<Exhibition | void>;
    readExhibitionForUser({ exhibitionId, }: {
        exhibitionId: string;
    }): Promise<Exhibition | void>;
    editExhibition({ exhibition, }: {
        exhibition: Exhibition;
    }): Promise<Exhibition | void>;
    getExhibitionById({ exhibitionId, }: {
        exhibitionId: string;
    }): Promise<Exhibition | void>;
    listExhibitionForGallery({ galleryId, }: {
        galleryId: string;
    }): Promise<Exhibition[] | void>;
    deleteExhibition({ exhibitionId, galleryId, deleteArtworks, }: {
        exhibitionId: string;
        galleryId: string;
        deleteArtworks?: boolean;
    }): Promise<boolean>;
    private getExhibitionImage;
    listAllExhibitionArtworks({ exhibitionId, }: {
        exhibitionId: string;
    }): Promise<any>;
    createExhibitionToArtworkEdgeWithExhibitionOrder({ exhibitionId, artworkId, }: {
        exhibitionId: string;
        artworkId: string;
    }): Promise<string>;
    reOrderExhibitionToArtworkEdgesAfterDelete({ exhibitionId, }: {
        exhibitionId: string;
    }): Promise<boolean>;
    batchEditArtworkToLocationEdgesByExhibitionId({ locationId, uid, exhibitionId, }: {
        locationId: string;
        uid: string;
        exhibitionId: string;
    }): Promise<boolean>;
    batchEditArtworkToLocationEdges({ locationData, artwork, }: {
        locationData: IBusinessLocationData;
        artwork: {
            [key: string]: Artwork;
        };
    }): Promise<boolean>;
    editArtworkToLocationEdge({ locationData, artworkId, }: {
        locationData: IBusinessLocationData;
        artworkId: string;
    }): Promise<boolean>;
    deleteArtworkToLocationEdge(): Promise<boolean>;
    deleteExhibitionToArtworkEdge({ exhibitionId, artworkId, }: {
        exhibitionId: string;
        artworkId: string;
    }): Promise<boolean>;
    verifyGalleryOwnsExhibition({ exhibitionId, galleryId, }: {
        exhibitionId: string;
        galleryId: string;
    }): Promise<boolean>;
    reOrderExhibitionArtwork({ exhibitionId, artworkId, desiredIndex, currentIndex, }: {
        exhibitionId: string;
        artworkId: string;
        desiredIndex: number;
        currentIndex: number;
    }): Promise<boolean>;
    private generateExhibitionId;
}
