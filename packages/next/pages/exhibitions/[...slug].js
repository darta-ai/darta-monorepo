// pages/galleries/[...slug].js

import { useRouter } from 'next/router';
import { useEffect } from 'react';

function GalleryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user to the landing page immediately upon component mount
    router.replace('/');
  }, [router]);

  return null; // Return null so that nothing is rendered for a brief moment before redirection
}

export default GalleryRedirect;
