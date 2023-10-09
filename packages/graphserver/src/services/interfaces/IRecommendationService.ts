export interface IRecommendationService {
  recommendArtworkToUser(): Promise<string[]>;
}
