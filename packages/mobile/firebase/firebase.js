// import {
//   collection, updateDoc, doc, getDocs,
// } from 'firebase/firestore/lite';
// import firebaseConfig from './serviceAccountKey';

// const auth = new Auth({
//   apiKey: `${firebaseConfig.apiKey}`,
// });

// const db = new Database({ projectId: `${firebaseConfig.projectId}`, auth });

// const imageCollection = collection(db, 'Images');
// const manualReviewCollection = collection(db, 'ManualReview');

// // const getImageCollection = async () => await getDocs(imageCollection);

// // const manualApprovalCollection = doc(db, 'ManualReview/ManualApproval')

// const approvedImagesRef = doc(db, 'approvedImages/ApprovedImages');

// const declinedImagesRef = doc(db, 'declinedImages/DeclinedImages');

// const manualImagesRef = doc(db, 'ManualReview/ManualApproval');

// const updateApprovedImages = async (id) => {
//   await updateDoc(approvedImagesRef, id, true);
//   await updateDoc(manualImagesRef, id, true);
// };

// const updateDeclinedImages = async (id) => {
//   await updateDoc(declinedImagesRef, id, true);
//   await updateDoc(manualImagesRef, id, false);
// };

// export {
//   imageCollection, manualReviewCollection,
//   db, getImageCollection, updateApprovedImages, updateDeclinedImages,
// };
