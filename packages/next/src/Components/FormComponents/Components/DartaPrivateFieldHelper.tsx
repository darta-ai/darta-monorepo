/* eslint-disable react/jsx-props-no-spreading */
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import {Controller} from 'react-hook-form';

import {PRIMARY_DARK_GREY} from '../../../../styles';
import {PrivateFields} from '../../Profile/types';
import {formStyles} from '../styles';

export function DartaPrivateFieldHelper({
  fieldName,
  data,
  register,
  control,
  testIdValue,
  isPrivate,
  setIsPrivate,
  switchStringValue,
}: {
  fieldName: string;
  data: PrivateFields | any;
  register: any;
  control: any;
  testIdValue: string;
  isPrivate: boolean;
  setIsPrivate: (arg0: boolean) => void;
  switchStringValue?: string;
}) {
  return (
    <Box >
      <Controller
        control={control}
        name={fieldName}
        {...register(`${testIdValue}.${switchStringValue}`)}
        render={({field}: {field: any}) => (
            <FormControlLabel
              labelPlacement="bottom"
              label={
                <>
                  <Box sx={formStyles.makePrivateContainerMobile}>
                    <Typography
                      sx={formStyles.toolTip}
                      data-testid={`${testIdValue}-privacy-display`}>
                      {isPrivate ? 'Private' : 'Public'}
                      <Tooltip
                        title={
                          <Box>
                            <Typography
                              sx={{textAlign: 'center', fontSize: 15}}>
                              {isPrivate
                                ? 'Private information is only visible to you and is not displayed on the app.'
                                : 'Public information is available to any user.'}
                            </Typography>
                            <IconButton>
                              <HelpOutlineIcon
                                fontSize="small"
                                sx={formStyles.helpIconTiny}
                              />
                            </IconButton>
                          </Box>
                        }
                        placement="bottom">
                        <IconButton>
                          <HelpOutlineIcon
                            fontSize="small"
                            sx={formStyles.helpIconTiny}
                          />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Box sx={formStyles.makePrivateContainerDesktop}>
                    <Typography
                      sx={formStyles.toolTip}
                      data-testid={`${testIdValue}-privacy-display`}>
                      {isPrivate ? 'Private' : 'Public'}
                    </Typography>
                  </Box>
                </>
              }
              control={
                <Switch
                  color="secondary"
                  value={data?.isPrivate}
                  id="isPrivate"
                  size="small"
                  data-testid={`${testIdValue}-privacy-switch`}
                  onChange={e => field.onChange(e.target.checked)}
                  checked={field.value}
                  onClick={() => {
                    setIsPrivate(!isPrivate);
                  }}
                />
              }
              sx={{
                width: '10vw',
                color: PRIMARY_DARK_GREY,
              }}
            />
          )}
      />
    </Box>
  );
}
DartaPrivateFieldHelper.defaultProps = {
  switchStringValue: 'isPrivate',
};
