/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import {Box, Divider, Typography} from '@mui/material';
import Image from 'next/image';
import React from 'react';

import {AuthEnum} from '../Auth/types';
import {styles} from './styles';

export function PamphletRight({
  headline,
  line1,
  line2,
  line3,
  index,
  authType,
}: {
  authType: AuthEnum;
  index: number;
  headline: string;
  line1: string;
  line2: string;
  line3: string;
}) {
  let png;
  let video;
  try {
    png = require(`../../../public/static/Home/${authType}/${index}.png`);
  } catch (e) {
    png = null;
  }
  try {
    video = require(`../../../public/static/Home/${authType}/${index}.mp4`);
  } catch (e) {
    video = null;
  }
  return (
    <Box sx={styles.container}>
      <Box sx={styles.textContainer}>
        <Typography variant="h1" sx={styles.typographyTitle}>
          {headline}
        </Typography>
        <br />
        <Typography variant="body1" sx={styles.typography}>
          {line1}
        </Typography>
        <br />
        <Typography variant="body1" sx={styles.typography}>
          {line2}
        </Typography>
        <br />
        <Typography variant="body1" sx={styles.typography}>
          {line3}
        </Typography>
      </Box>
      <Box sx={{flex: 1}}>
        {png ? (
          <div style={styles.imageSize}>
            <Image src={png} alt="info" style={styles.image} />
          </div>
        ) : (
          <Box sx={styles.videoContainer}>
            <video title={headline} muted playsInline style={styles.videoStyle}>
              <source src={video} type="video/mp4" />
            </video>
          </Box>
        )}
      </Box>
      <Divider />
    </Box>
  );
}
