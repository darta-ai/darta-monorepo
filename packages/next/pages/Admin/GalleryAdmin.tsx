

// React page where user can view all galleries in a table format with their current exhibitions 

import { NextPageContext } from 'next';
import { ExhibitionPreviewAdmin } from 'packages/darta-types/dist';
import React from 'react';




export function GalleryAdmin() {
  const [exhibitions] = React.useState<ExhibitionPreviewAdmin[]>([]);

  return (
    <div>
      <h1>Galleries</h1>
    </div>
  );
}


GalleryAdmin.getInitialProps = async (ctx: NextPageContext) => {
    const res = await fetch('https://api.github.com/repos/vercel/next.js')
    const json = await res.json()
    return { stars: json.stargazers_count }
  }