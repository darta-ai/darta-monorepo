/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import {Box,Typography} from '@mui/material';
import React from 'react';

import { DownloadFromAppStore } from './DownloadFromAppStore';
import {splashStyles} from './styles';

export type dataType = {
  headline: string;
  explainer1: string;
  explainer2: string;
}

export function IntroComponent({data, source} : {data: dataType, source: string }) {
  return (
    <Box sx={splashStyles.container}>
        <Box sx={splashStyles.textContainer}>
          <Box sx={splashStyles.typographyTitleContainer}>
            <Typography sx={splashStyles.typographyTitle}>
              {data.headline}
            </Typography>
          </Box>
          <br />
          <Box sx={splashStyles.subheaderContainer}>
            <Typography sx={splashStyles.subheader}>
              {data.explainer1}
            </Typography>
          </Box>
          <br />
          <Typography variant="subtitle1" sx={splashStyles.typography}>
            {data.explainer2}
          </Typography>
          <br />
          <Box style={splashStyles.downloadFromAppStoreContainer}>
            <DownloadFromAppStore />
          </Box>
        </Box>
      <Box sx={splashStyles.phonePreviewContainer}>
        <video style={{height: '100%', width: '100%'}} autoPlay loop muted playsInline>
            <source src={source} type="video/mp4" />
        </video>
      </Box>
    </Box>
  );
}
