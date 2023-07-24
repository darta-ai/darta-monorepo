/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

export default function Custom500() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>500 - We goof'd</h1>
      <p>
        The HyperText Transfer Protocol (HTTP) 500 Internal Server Error server
        error response code indicates that the server encountered an unexpected
        condition that prevented it from fulfilling the request.
      </p>
      <p>Redirecting to the home page in 5 seconds...</p>
      <p>
        If you are not redirected, <Link href="/">click here</Link>.
      </p>
    </div>
  );
}
