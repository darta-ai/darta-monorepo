from fastapi import FastAPI
from gnn_module import recommend_artworks

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/artworkRecommendation")
async def artworkRecommendation(user_id: str):
    artworks = recommend_artworks(user_id)
    return {"message": "Hello World artworkRecommendation", "user_id": user_id, "artworks": artworks}