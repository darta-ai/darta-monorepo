/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import {Box, Typography} from '@mui/material';
import Image from 'next/image';
import * as React from 'react';

import {AuthEnum} from '../Auth/types';
import {styles} from './styles';

export function PamphletLeft({
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
    video = require(`../../../public/static/Home/${authType}/${index}.gif`);
  } catch (e) {
    video = null;
  }
  return (
    <Box sx={styles.container}>
      <Box sx={{flex: 1}}>
        {png ? (
          <div style={styles.imageSize}>
            <Image src={png} alt="info" style={styles.image} />
          </div>
        ) : (
          <Box sx={styles.videoContainer}>
            <Image src={video} alt="my gif" />
          </Box>
        )}
      </Box>
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
    </Box>
  );
}
