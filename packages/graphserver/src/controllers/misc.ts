// const { Database, aql } = require("arangojs");

// async function createArtwork(artworkDetails, mediumDetails, artistDetails, ownerDetails, listerDetails) {
//   const db = new Database();

//   // Start a transaction
//   const trx = await db.beginTransaction({
//     write: ["artwork", "medium", "artist", "owner", "lister", "artwork_medium", "artwork_artist", "artwork_owner", "artwork_lister"],
//   });

//   try {
//     // Create artwork node
//     const artwork = await trx.step(() => db.collection("artwork").save(artworkDetails));

//     // Create medium node and edge
//     const medium = await trx.step(() => db.collection("medium").save(mediumDetails));
//     await trx.step(() => db.collection("artwork_medium").save({ _from: artwork._id, _to: medium._id }));

//     // Create artist node and edge
//     const artist = await trx.step(() => db.collection("artist").save(artistDetails));
//     await trx.step(() => db.collection("artwork_artist").save({ _from: artwork._id, _to: artist._id }));

//     // Create owner node and edge
//     const owner = await trx.step(() => db.collection("owner").save(ownerDetails));
//     await trx.step(() => db.collection("artwork_owner").save({ _from: artwork._id, _to: owner._id }));

//     // Create lister node and edge
//     const lister = await trx.step(() => db.collection("lister").save(listerDetails));
//     await trx.step(() => db.collection("artwork_lister").save({ _from: artwork._id, _to: lister._id }));

//     // Commit the transaction
//     await trx.commit();

//     return { artwork, medium, artist, owner, lister };
//   } catch (error) {
//     // Abort the transaction in case of errors
//     await trx.abort();
//     throw error;
//   }
// }

// // Usage example
// createArtwork(
//   { title: "Artwork Title" },
//   { type: "Oil" },
//   { name: "Artist Name" },
//   { name: "Owner Name" },
//   { name: "Lister Name" }
// ).then((result) => console.log("Artwork created:", result))
//   .catch((error) => console.error("Error creating artwork:", error));
