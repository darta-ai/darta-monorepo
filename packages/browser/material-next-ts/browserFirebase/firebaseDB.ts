import {db} from '../pages/_app';
import { collection, addDoc, getDocs, doc, getDoc, setDoc} from "firebase/firestore"; 
// Get all the pamphlets data from the database
export async function getPamphlet() {
  try {
    const pamphletData = collection(db, 'pamphlet');
    const pamphletSnapshot = await getDocs(pamphletData);
    const pamphletList = pamphletSnapshot.docs.map(doc => doc.data());
    return pamphletList;
  } catch (e) {
    console.log({e});
  }
}

// Get all the benefits from Signing Up data from the database
export async function signUpBenefits(documentName: string) {
  const docRef = doc(db, 'benefits', documentName);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.log('No such document!');
  }
}

// Welcome Back to the App
export async function welcomeBack(documentName: string) {
  const docRef = doc(db, 'welcomeBack', documentName);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.log('No such document!');
  }
}

// About page
export async function getAbout() {
  const docRefText = doc(db, 'FrontendUI', 'About');
  try {
    const docSnap = await getDoc(docRefText);
    return docSnap.data();
  } catch (e) {
    console.log('No such document!');
  }
}

// Get all the benefits from Signing Up data from the database
export async function writeWaitList(user: any, documentName: string) {
  console.log(documentName)
  try {
    const results = await setDoc(doc(db, "EarlyRegister", documentName), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
    console.log('results', {results})
  }catch(e){
    console.log('error', {e})
  }
}
