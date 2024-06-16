/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import { Artwork } from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames } from '../config/collections';
import { filterOutPrivateRecordsSingleObject } from '../middleware';
import {
  IArtworkService,
  IEdgeService,
  IExhibitionService,
  IGalleryService,
  INodeService,
  IRecommenderService,
  IUserService,
} from './interfaces';

@injectable()
export class RecommenderService implements IRecommenderService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
    @inject('IUserService') private readonly userService: IUserService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
  ) {}
  
  public async generateArtworkToRecommend({
    uid,
    startNumber,
    endNumber
  } : {
    uid: string;
    startNumber: number;
    endNumber: number;
  }): Promise<{[key: string] : Artwork}> {
    const userId = this.userService.generateDartaUserId({uid});
    const count = endNumber - startNumber;
    const ArtworkQuery = `
    WITH ${CollectionNames.Artwork}, 
    ${CollectionNames.ArtworkArtists}, 
    ${CollectionNames.Galleries}, 
    ${CollectionNames.ArtworkMediums}, 
    ${CollectionNames.Exhibitions}
    LET allArtwork = (
      FOR art IN ${CollectionNames.Artwork}
      SORT RAND()
      FILTER art.published == true AND art.artworkDimensions.depthIn.value == '' OR art.artworkDimensions.depthIn.value == null
      RETURN DISTINCT art._key
    )

    LET ratedArtworkByUserSAVE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkSAVE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET ratedArtworkByUserLIKE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkLIKE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET ratedArtworkByUserDISLIKE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkDISLIKE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET notViewedByUserArtworkKeys = MINUS(allArtwork, ratedArtworkByUserLIKE, ratedArtworkByUserSAVE, ratedArtworkByUserDISLIKE)

    FOR key IN notViewedByUserArtworkKeys
      FOR art IN ${CollectionNames.Artwork}
        FILTER art._key == key
        LET artistName = (
          FOR v, e IN 1..1 OUTBOUND art ${EdgeNames.FROMArtworkTOArtist}
          RETURN v.value
        )[0]
        LET galleryId = (
          FOR v, e IN 1..1 INBOUND art ${EdgeNames.FROMGalleryToArtwork}
          RETURN v._id
        )[0]
        LET exhibitionId = (
          FOR v, e IN 1..1 INBOUND art ${EdgeNames.FROMCollectionTOArtwork}
          RETURN v._id
        )[0]
      
        LIMIT @limit, @count
        RETURN {
          artwork: art,
          artistName,
          galleryId,
          exhibitionId,
        } 
    `

    try {
      let cursor = await this.db.query(ArtworkQuery, {userId, limit: endNumber, count});
      let artworks: any = await cursor.all();
       // Shuffle and organize artworks here
       let groupedArtworks = this.groupArtworksByExhibition(artworks);
       if (Object.keys(groupedArtworks).length === 0) {
        cursor = await this.db.query(ArtworkQuery, {userId, limit: endNumber, count});
        artworks = await cursor.all();
        groupedArtworks = this.groupArtworksByExhibition(artworks);
       }
       Object.keys(groupedArtworks).forEach(exhibitionId => {
         groupedArtworks[exhibitionId] = this.shuffleArray(groupedArtworks[exhibitionId]);
       });
       
       const variedArtworks = this.pickVariedArtworks(groupedArtworks, count);
       
       // Process varied artworks into the desired format
       const results: {[key: string]: Artwork} = {};
       variedArtworks.forEach((artwork, index) => {
         const resultKey = (startNumber + index).toString();
         results[resultKey] = filterOutPrivateRecordsSingleObject(artwork);
       });
      return results;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i-=1) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private groupArtworksByExhibition(artworks: any[]): {[exhibitionId: string]: any[]} {
    const groupedArtworks: {[exhibitionId: string] : Artwork[]} = {};
    artworks.forEach(item => {
      const {exhibitionId} = item;
      if (!groupedArtworks[exhibitionId]) {
        groupedArtworks[exhibitionId] = [];
      }
      if (item.artwork?.published){
        groupedArtworks[exhibitionId].push({
          ...item.artwork,
          artistName: {value: item.artistName},
          galleryId: item.galleryId,
          artworkMedium: {value: item.medium},
          exhibitionId: item.exhibitionId
        });
    }
    });
    return groupedArtworks;
  }

  private pickVariedArtworks(groupedArtworks: {[exhibitionId: string]: any[]}, count: number): any[] {
    const pickedArtworks: Artwork[] = [];
    const exhibitionIds = Object.keys(groupedArtworks);

    while (pickedArtworks.length < count) {
      exhibitionIds.forEach(exhibitionId => {
        if (groupedArtworks[exhibitionId] && groupedArtworks[exhibitionId].length > 0) {
          pickedArtworks.push(groupedArtworks[exhibitionId].shift());
        }
      });
      if (exhibitionIds.every(exhibitionId => groupedArtworks[exhibitionId].length === 0)) {
        break; // break the loop if all arrays are empty
      }
    }
    return pickedArtworks;
  }

  public async getRecommendationsRandomSampling({
    uid,
    startNumber,
    endNumber,
    artworkIds,
  }: {
    uid: string;
    startNumber: number;
    endNumber: number;
    artworkIds: string[];
  }): Promise<{[key: string]: Artwork}> {
    const artworks = await this.executeRecommendationQuery({uid, startNumber, endNumber});
    if (!artworkIds || artworkIds.length === 0) return artworks;
    const fixedArtworkIds = artworkIds.map(artworkId => artworkId.replace(/%/g, "/"));
    const filteredArtworks = Object.values(artworks).filter(artwork => !fixedArtworkIds.includes(artwork._id!));

    const results: {[key: string]: Artwork} = {};
    filteredArtworks.forEach((artwork, index) => {
      const resultKey = (startNumber + index).toString();
      results[resultKey] = artwork;
    });  
    return results;
  }

  public async readArtworksToRecommend({uid, startNumber} : {uid: string, startNumber: number}): Promise<{[key: string] : Artwork}> {
    try {
      const userA = this.userService.generateDartaUserId({uid});
      const user = await this.nodeService.getNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: userA,
      });
      if (!user) {
        return {};
      }
      const { recommendationArtworkIds: savedUserArtworkIds } = user;
      const artworks = await this.turnArtworkIdsIntoArtworks(savedUserArtworkIds);
      const results = await this.addOrderKeysToArtworks(artworks, startNumber);
      return results;
    } catch(error: any){
      throw new Error(error.message);
    }
  }

  public async generateAndSaveArtworkToRecommend({uid, startNumber, endNumber} : {uid: string, startNumber: number, endNumber: number}): Promise<{[key: string] : Artwork}> {
    const artworks = await this.executeRecommendationQuery({uid, startNumber, endNumber});
    const artworkIds = Object.values(artworks).map(artwork => artwork._id!);
    await this.writeArtworkIdsToUser({userA: uid, artworkIds});
    return artworks;
  }
    

  public async executeRecommendationQuery({uid, startNumber, endNumber} : {uid: string, startNumber: number, endNumber: number}): Promise<{[key: string]: Artwork}> {
    const userA = this.userService.generateDartaUserId({uid});

    const count = endNumber - startNumber;

    try{
      let artworkIds = [];
      const { userAInteractedArtworks, recommendedArtworks } = await this.getRecommendationsCollaborativeFiltering({userA, limit: count});
      artworkIds = [ ...recommendedArtworks];
      if (artworkIds.length < count) {
        const randomLowInteractionArtworks = await this.randomLowInteractionArtworks({userAInteractedArtworks, recommendedArtworks, limit: count - artworkIds.length});
        artworkIds = [...artworkIds, ...randomLowInteractionArtworks];
        }


      if (artworkIds.length < count) {
        const fallbackRandomArtworks = await this.fallBackRandomNewerArtworks({recommendedArtworks, limit: count - artworkIds.length});
        artworkIds = [...artworkIds, ...fallbackRandomArtworks];
      } else {
        const supplementalArtworksNewerArtworks = await this.fallBackRandomNewerArtworks({recommendedArtworks, limit: 5});
        artworkIds = [...artworkIds, ...supplementalArtworksNewerArtworks];
      }

      const artworks = await this.turnArtworkIdsIntoArtworks(artworkIds);

      const results = await this.addOrderKeysToArtworks(artworks, startNumber);

      return results;


    } catch (error: any) {
      throw new Error(error.message);
    }

  }

  public async getRecommendationsCollaborativeFiltering({userA, limit} : {userA: string, limit: number}): Promise <{userAInteractedArtworks: Array<string>, recommendedArtworks: Array<string>}> {
    const query = `
      WITH Artwork, DartaUsers
        LET similarUsers = (
            FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
                LET userA_ratings = edge.value
                
                FOR userB, edge2 IN 1..1 INBOUND artwork GRAPH 'ArtworkGraph'
                    FILTER userB._id != @userA
                    
                    LET userB_ratings = edge2.value
                    
                    COLLECT userids = userB._id INTO g
                        KEEP userB_ratings, userA_ratings
                        
                        LET sharedArtworkCount = LENGTH(g[*].userA_ratings[**])
                        
                        FILTER sharedArtworkCount >= 10
                        
                        LET userA_numericRatings = (
                            FOR rating IN g[*].userA_ratings[**]
                                RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                        )
                        
                        LET userB_numericRatings = (
                            FOR rating IN g[*].userB_ratings[**]
                                RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                        )
                        
                    LET cos_sim = COSINE_SIMILARITY(userA_numericRatings, userB_numericRatings)
                    
                    // FILTER cos_sim > 0.90
                    
                    SORT cos_sim DESC
                    LIMIT 15
                    
                    RETURN {
                        userB: userids,
                        cosine_similarity: cos_sim
                    }
        )


        LET userAInteractedArtworks = (
            FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
                FILTER edge.value == 'VIEWED' AND DATE_DIFF(DATE_NOW(), edge.createdAt, "day") <= 14
                RETURN artwork._id
        )


        LET recommendedArtworks = (
            FOR similarUser IN similarUsers
                LET similarUserInteractions = (
                    FOR artwork, edge IN 1..1 OUTBOUND similarUser.userB GRAPH 'ArtworkGraph'
                        FILTER edge.value IN ["INQUIRE", "SAVE", "LIKE"]
                        RETURN {
                            artworkId: artwork._id,
                            interactionScore: edge.value == "INQUIRE" ? 4 : edge.value == "SAVE" ? 3 : 2
                        }
                )
                
                FOR interaction IN similarUserInteractions
                    FILTER interaction.artworkId NOT IN userAInteractedArtworks
                    
                    COLLECT artworkId = interaction.artworkId
                    AGGREGATE score = SUM(interaction.interactionScore)
                    
                    SORT score DESC
                    
                    LIMIT @limit
                    
                    RETURN artworkId
          )
        RETURN {
            userAInteractedArtworks: userAInteractedArtworks,
            recommendedArtworks: UNIQUE(recommendedArtworks)
        }
      `;

      try {
        const cursor = await this.db.query(query, { userA, limit });
        const result = await cursor.next();
        return result as {userAInteractedArtworks: Array<string>, recommendedArtworks: Array<string>}
      }catch (error: any){
        throw new Error(error.message);
      }
  }

  public async generateNewArtworksToRecommendBackfill({uid, generatedArtworks} : {uid: string, generatedArtworks: {[key: string] : Artwork}}): Promise<void> {

    const generatedArtworkIds = Object.values(generatedArtworks).map(artwork => artwork._id!);
    const userA = this.userService.generateDartaUserId({uid});
    const query = `
    WITH Artwork, DartaUsers
      LET similarUsers = (
          FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
              LET userA_ratings = edge.value
              
              FOR userB, edge2 IN 1..1 INBOUND artwork GRAPH 'ArtworkGraph'
                  FILTER userB._id != @userA
                  FILTER artwork._id NOT IN @excludedArtworks
                  LET userB_ratings = edge2.value
                  
                  COLLECT userids = userB._id INTO g
                      KEEP userB_ratings, userA_ratings
                      
                      LET sharedArtworkCount = LENGTH(g[*].userA_ratings[**])
                      
                      FILTER sharedArtworkCount >= 10
                      
                      LET userA_numericRatings = (
                          FOR rating IN g[*].userA_ratings[**]
                              RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                      )
                      
                      LET userB_numericRatings = (
                          FOR rating IN g[*].userB_ratings[**]
                              RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                      )
                      
                  LET cos_sim = COSINE_SIMILARITY(userA_numericRatings, userB_numericRatings)
                  
                  // FILTER cos_sim > 0.90
                  
                  SORT cos_sim DESC
                  LIMIT 15
                  
                  RETURN {
                      userB: userids,
                      cosine_similarity: cos_sim
                  }
      )


      LET userAInteractedArtworks = (
          FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
              FILTER edge.value == 'VIEWED' AND DATE_DIFF(DATE_NOW(), edge.createdAt, "day") <= 14
              RETURN artwork._id
      )


      LET recommendedArtworks = (
          FOR similarUser IN similarUsers
              LET similarUserInteractions = (
                  FOR artwork, edge IN 1..1 OUTBOUND similarUser.userB GRAPH 'ArtworkGraph'
                      FILTER edge.value IN ["INQUIRE", "SAVE", "LIKE"]
                      RETURN {
                          artworkId: artwork._id,
                          interactionScore: edge.value == "INQUIRE" ? 4 : edge.value == "SAVE" ? 3 : 2
                      }
              )
              
              FOR interaction IN similarUserInteractions
                  FILTER interaction.artworkId NOT IN userAInteractedArtworks
                  
                  COLLECT artworkId = interaction.artworkId
                  AGGREGATE score = SUM(interaction.interactionScore)
                  
                  SORT score DESC
                  
                  LIMIT @limit
                  
                  RETURN artworkId
        )
        RETURN {
            userAInteractedArtworks: userAInteractedArtworks,
            recommendedArtworks: UNIQUE(recommendedArtworks)
        }
    `;

    try {
      const cursor = await this.db.query(query, { userA, limit: 15, excludedArtworks: generatedArtworkIds });
      const result = await cursor.next();

      const {recommendedArtworks, userAInteractedArtworks} = result;
      let artworkIds = [];
      artworkIds = [ ...recommendedArtworks];
      if (artworkIds.length < 20) {
        const randomLowInteractionArtworks = await this.randomLowInteractionArtworks({userAInteractedArtworks, recommendedArtworks, limit: 5});
        artworkIds = [...artworkIds, ...randomLowInteractionArtworks];
        }


      if (artworkIds.length < 20) {
        const fallbackRandomArtworks = await this.fallBackRandomNewerArtworks({recommendedArtworks, limit: 20 - artworkIds.length});
        artworkIds = [...artworkIds, ...fallbackRandomArtworks];
      } else {
        const supplementalArtworksNewerArtworks = await this.fallBackRandomNewerArtworks({recommendedArtworks, limit: 5});
        artworkIds = [...artworkIds, ...supplementalArtworksNewerArtworks];
      }
      return await this.writeArtworkIdsToUser({userA: uid, artworkIds});
    }catch (error: any){
      throw new Error(error.message);
    }

  }

  public async randomLowInteractionArtworks({userAInteractedArtworks, recommendedArtworks, limit} : {userAInteractedArtworks: string[], recommendedArtworks: string[], limit: number}): Promise<string[]> {
    const query = `
      WITH Artwork
        LET randomLowInteractionArtworks = (
            FOR artwork IN Artwork
                LET interactionCount = LENGTH(
                    FOR v, e IN 1..1 INBOUND artwork._id GRAPH 'ArtworkGraph'
                        RETURN e
                )
                
                FILTER interactionCount < 20 // Adjust the threshold as needed
                FILTER artwork._id NOT IN @userAInteractedArtworks
                FILTER artwork._id NOT IN @recommendedArtworks
                
                SORT RAND()
                LIMIT @limit
                
                RETURN artwork._id
        )

        RETURN randomLowInteractionArtworks
      `;

      try {
        const cursor = await this.db.query(query, { userAInteractedArtworks, recommendedArtworks, limit });
        const result = await cursor.next();
        return result;
      } catch (error: any) {
        throw new Error(error.message);
      }
  }

  public async fallBackRandomNewerArtworks({recommendedArtworks, limit} : {recommendedArtworks: string[], limit: number}): Promise<string[]> {
    const query = `
      WITH Artwork
        LET fallbackRandomArtworks = (
            FOR artwork IN Artwork
                FILTER artwork._id NOT IN @recommendedArtworks
                FILTER artwork.createdAt >= DATE_SUBTRACT(DATE_NOW(), 2, "month")
                SORT RAND()
                LIMIT @limit
                
                RETURN artwork._id
        )

        RETURN fallbackRandomArtworks
      `;

      try {
        const cursor = await this.db.query(query, { recommendedArtworks, limit });
        const result = await cursor.next();
        return result;
      } catch (error: any) {
        throw new Error(error.message);
      }
  }

  private async turnArtworkIdsIntoArtworks(artworkIds: string[]): Promise<Artwork[]> {
    const res = await Promise.all(
      artworkIds.map(async (artworkId: string) => {
        const artwork = await this.artworkService.readArtwork(artworkId);
        
        if (artwork && artwork.exhibitionId){
          artwork.exhibitionId = this.exhibitionService.generateExhibitionId({exhibitionId: artwork.exhibitionId});
        }
        return artwork;
      })
    );
    return res.filter((el): el is Artwork => el !== null);
  }

  private async addOrderKeysToArtworks(artworks: Artwork[], startNumber: number): Promise<{[key: string]: Artwork}> {
    const results: {[key: string]: Artwork} = {};
    artworks.forEach((artwork, index) => {
      const resultKey = (startNumber + index).toString();
      results[resultKey] = filterOutPrivateRecordsSingleObject(artwork);
    });
    return results;
  }

  private async writeArtworkIdsToUser({ userA, artworkIds } : { userA: string, artworkIds: string[] }): Promise<void> {
    try {
      await this.userService.editDartaUser({uid: userA, recommendationArtworkIds: artworkIds});
    } catch (error: any) {
      throw new Error(error.message
      );
    }
  }


  public async collaborativeFilteringCollectRatings({uid, startNumber} : {uid: string, startNumber: number, endNumber : number}): Promise<{ [key: string]: Artwork; }>{
    const userA = this.userService.generateDartaUserId({uid});
    const query = `
     WITH Artwork, DartaUsers
        LET similarUsers = (
            FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
                LET userA_ratings = edge.value
                
                FOR userB, edge2 IN 1..1 INBOUND artwork GRAPH 'ArtworkGraph'
                    FILTER userB._id != @userA
                    
                    LET userB_ratings = edge2.value
                    
                    COLLECT userids = userB._id INTO g
                        KEEP userB_ratings, userA_ratings
                        
                        LET sharedArtworkCount = LENGTH(g[*].userA_ratings[**])
                        
                        FILTER sharedArtworkCount >= 10
                        
                        LET userA_numericRatings = (
                            FOR rating IN g[*].userA_ratings[**]
                                RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                        )
                        
                        LET userB_numericRatings = (
                            FOR rating IN g[*].userB_ratings[**]
                                RETURN rating == "INQUIRE" ? 4 : rating == "SAVE" ? 3 : rating == "LIKE" ? 2 : rating == "DISLIKE" ? 1 : 0
                        )
                        
                    LET cos_sim = COSINE_SIMILARITY(userA_numericRatings, userB_numericRatings)
                    
                    FILTER cos_sim > 0.90
                    
                    SORT cos_sim DESC
                    LIMIT 15
                    
                    RETURN {
                        userB: userids,
                        cosine_similarity: cos_sim
                    }
        )

        LET userAInteractedArtworks = (
            FOR artwork, edge IN 1..1 OUTBOUND @userA GRAPH 'ArtworkGraph'
                RETURN artwork._id
        )

        LET recommendedArtworks = (
            FOR similarUser IN similarUsers
                LET similarUserInteractions = (
                    FOR artwork, edge IN 1..1 OUTBOUND similarUser.userB GRAPH 'ArtworkGraph'
                        FILTER edge.value IN ["INQUIRE", "SAVE", "LIKE"]
                        RETURN {
                            artworkId: artwork._id,
                            interactionScore: edge.value == "INQUIRE" ? 4 : edge.value == "SAVE" ? 3 : 2
                        }
                )
                
                FOR interaction IN similarUserInteractions
                    FILTER interaction.artworkId NOT IN userAInteractedArtworks
                    
                    COLLECT artworkId = interaction.artworkId
                    AGGREGATE score = SUM(interaction.interactionScore)
                    
                    SORT score DESC
                    LIMIT 15
                    
                    RETURN artworkId
        )

        LET randomLowInteractionArtworks = (
            FOR artwork IN Artwork
                LET interactionCount = LENGTH(
                    FOR v, e IN 1..1 INBOUND artwork._id GRAPH 'ArtworkGraph'
                        RETURN e
                )
                
                FILTER interactionCount < 20 // Adjust the threshold as needed
                FILTER artwork._id NOT IN userAInteractedArtworks
                FILTER artwork._id NOT IN recommendedArtworks
                
                SORT RAND()
                LIMIT 20
                
                RETURN artwork._id
        )

        LET combinedArtworks = UNION(recommendedArtworks, randomLowInteractionArtworks)

        LET fallbackRandomArtworks = (
            FOR artwork IN Artwork
                FILTER artwork._id NOT IN userAInteractedArtworks
                FILTER artwork._id NOT IN combinedArtworks
                
                SORT RAND()
                LIMIT 10
                
                RETURN artwork._id
        )


        LET finalArtworks = UNION(combinedArtworks, fallbackRandomArtworks)

        RETURN UNIQUE(finalArtworks)
      `;
      try {
        const cursor = await this.db.query(query, { userA });
        const result = await cursor.next();

        const artworks = await Promise.all(
          result.map(async (artworkId: string) => {
            const artwork = await this.artworkService.readArtwork(artworkId);
            if (artwork?.artworkDimensions.depthCm?.value === '' || artwork?.artworkDimensions.depthCm?.value !== '0'){
              return null
            }
            return artwork;
          })
        );
            
        const filteredArtworks = artworks.filter((el): el is Artwork => el !== null);
      
        const results: { [key: string]: Artwork } = {};
        filteredArtworks.forEach((artwork: Artwork, index: number) => {
          const resultKey = (startNumber + index).toString();
          results[resultKey] = filterOutPrivateRecordsSingleObject(artwork);
        });
      

        return results;
      } catch (error: any) {
        // Handle any errors
        throw new Error(error?.message);
      }
  }

}  
