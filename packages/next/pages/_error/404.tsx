import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, []);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>
        Sorry, the page you are looking for might have been removed had its name
        changed or is temporarily unavailable
      </p>
      <p>Redirecting to the home page in 5 seconds...</p>
      <p>
        If you are not redirected, <Link href="/">click here</Link>.
      </p>
    </div>
  );
}
