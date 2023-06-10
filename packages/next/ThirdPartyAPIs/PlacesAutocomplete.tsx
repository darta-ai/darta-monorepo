// import {
//   Box,
//   IconButton,
//   Input,
//   InputAdornment,
//   List,
//   ListItem,
//   TextField,
//   Tooltip,
// } from '@mui/material';
// import React from 'react';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import Autocomplete from 'react-google-autocomplete';

// export function PlacesAutocomplete({
//   adornmentText,
//   inputBoxStyles,
//   inputFormStyles,
//   placeHolderText,
// }: {
//   adornmentText: string;
//   inputBoxStyles: any;
//   inputFormStyles: any;
//   placeHolderText: string;
// }) {
//   // const handleInput = (e: any) => {
//   //   // Update the keyword of the input element
//   //   setValue(e.target.value);
//   // };

//   // const handleSelect =
//   //   ({description}: {description: any}) =>
//   //   () => {
//   //     // When user selects a place, we can replace the keyword without request data from API
//   //     // by setting the second parameter to "false"
//   //     setValue(description, false);
//   //     clearSuggestions();

//   //     // Get latitude and longitude via utility functions
//   //     getGeocode({address: description}).then(results => {
//   //       const {lat, lng} = getLatLng(results[0]);
//   //       console.log('📍 Coordinates: ', {lat, lng});
//   //     });
//   //   };

//   // const renderSuggestions = () =>
//   //   data.map(suggestion => {
//   //     const {
//   //       place_id,
//   //       structured_formatting: {main_text, secondary_text},
//   //     } = suggestion;
//   //     console.log('triggered');
//   //     return (
//   //       <ListItem key={place_id} onClick={handleSelect(suggestion)}>
//   //         <strong>{main_text}</strong> <small>{secondary_text}</small>
//   //       </ListItem>
//   //     );
//   //   });

//   console.log({key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY});

//   return (
//     <Box
//       // ref={ref}
//       sx={inputBoxStyles}>
//       <InputAdornment sx={{width: '12vw'}} position="start">
//         {adornmentText}
//       </InputAdornment>
//       <Input
//         // value={value}
//         // onChange={handleInput}
//         disabled
//         sx={inputFormStyles}
//         placeholder={placeHolderText}
//         // inputProps={{
//         //   startAdornment: (

//         //   ),
//         // }}
//       >
//         <Autocomplete
//           apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
//           onPlaceSelected={place => {
//             console.log(place);
//           }}
//         />
//       </Input>
//     </Box>
//   );
// }
