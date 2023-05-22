import React, {useState} from 'react';

import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../../styles';
import Image from 'next/image';
import {styles} from  './styles'


export const PamphletLeft = ({
  headline,
  line1,
  line2,
  line3,
  index,
}: {
  headline?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  index: number;
}) => {
  let png; 
  let video;
  try{
    png = require(`../../../public/static/pamphlet/${index}.png`)
  }catch(e){
    png = null
  }
  try{
    video = require(`../../../public/static/pamphlet/${index}.mp4`)
  }catch(e){
    video = null
  }
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <Box sx={styles.container}>
      <Box sx={{ flex: 1}}>
      {png ? (
          <div style={styles.imageSize}>
          <Image
            src={png}
            alt="info"
            style={styles.image}
          />
          </div>
        ): (
          <Box sx={styles.videoContainer} onClick={() => setIsPlaying(!isPlaying)}>
            <video
              title={headline}
              autoPlay={isPlaying}
              loop
              muted
              playsInline
              style={styles.videoStyle}
            >
              <source src={video} type="video/mp4" />
            </video>
            </Box>
        )}
      </Box>
      <Box sx={styles.textContainer}>
        <Typography variant="h1" sx={styles.typographyTitle}>
          {headline}
        </Typography>
        <br />
        <Typography sx={styles.typography}>{line1}</Typography>
        <br />
        <Typography sx={styles.typography}>{line2}</Typography>
        <br />
        <Typography sx={styles.typography}>{line3}</Typography>
      </Box>
    </Box>
  );
};
