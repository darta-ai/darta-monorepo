import {db} from '../pages/_app';
import {collection, getDocs, doc, getDoc} from 'firebase/firestore/lite';

// Get all the pamphlets data from the database
export async function getPamphlet() {
  const pamphletData = collection(db, 'pamphlet');
  const pamphletSnapshot = await getDocs(pamphletData);
  const pamphletList = pamphletSnapshot.docs.map(doc => doc.data());
  return pamphletList;
}

// Get all the pamphlets data from the database
export async function getBenefits(documentName: string) {
  const docRef = doc(db, 'benefits', documentName);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.log('No such document!');
  }
}
