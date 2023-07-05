// import {
//   Box,
//   Button,
//   Card,
//   CardActionArea,
//   CardContent,
//   Typography,
// } from '@mui/material';
// import React, {useState} from 'react';

// import {Exhibition} from '../../../globalTypes';
// import {ExhibitionPressReleaseEdit} from './index';

// const useStyles = {
//   root: {
//     minWidth: '80vw',
//     alignItems: 'center',
//     flexDirection: 'column',
//     display: 'flex',

//     margin: 'auto',
//     border: '1px solid darkgrey',
//   },
//   media: {
//     height: 200,
//   },
//   expand: {
//     transform: 'rotate(0deg)',
//     marginLeft: 'auto',
//   },
//   expandOpen: {
//     transform: 'rotate(180deg)',
//   },
//   cardContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     gap: '1vh',
//     borderRadius: '0.5vw',
//     m: '1vh',
//     border: '1px solid #eaeaea',
//     alignItems: 'center',
//     '@media (min-width: 800px)': {
//       flexDirection: 'row',
//       width: '85vw',
//     },
//   },
//   buttonContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     '@media (min-width: 800px)': {
//       flexDirection: 'column',
//     },
//   },
// };

// export function ExhibitionCard({
//   exhibition,
//   saveExhibition,
// }: // saveArtwork,
// // deleteArtwork,
// // inquiries,
// {
//   exhibition: Exhibition;
//   saveExhibition: (arg0: string, arg1: Exhibition) => void;
//   // deleteArtwork: (arg0: string) => void;
//   // inquiries: InquiryArtworkData[];
// }) {
//   const [expanded, setExpanded] = useState(false);
//   const [editExhibition, setEditExhibition] = useState<boolean>(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

//   const handleSave = (savedExhibition: Exhibition) => {
//     saveExhibition(savedExhibition.exhibitionId!, savedExhibition);
//     setEditExhibition(!editExhibition);
//   };

//   const handleDelete = (arg0: any) => {
//     // return deleteArtwork(artworkId);
//     console.log('deleted', arg0);
//   };

//   return (
//     <Card sx={useStyles.root}>
//       {editExhibition ? (
//         <ExhibitionPressReleaseEdit
//           newExhibition={exhibition}
//           saveExhibition={handleSave}
//           cancelAction={() => null}
//           handleDelete={handleDelete}
//         />
//       ) : (
//         <Box sx={useStyles.cardContainer}>
//           <Box>
//             <CardActionArea
//               onClick={handleExpandClick}
//               sx={{display: 'flex', flexDirection: 'column'}}
//             />
//           </Box>
//           <Box sx={{alignSelf: 'center'}}>
//             <CardContent>
//               <Typography variant="h5" component="h2">
//                 {exhibition.exhibitionTitle.value}
//               </Typography>
//             </CardContent>
//           </Box>
//           <CardContent sx={{alignSelf: 'center'}}>
//             {exhibition?.pressRelease?.value && (
//               <Typography paragraph>exhibition.pressRelease.value</Typography>
//             )}
//           </CardContent>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={() => setEditExhibition(!editExhibition)}
//             sx={{alignSelf: 'center', m: '1vh'}}>
//             <Typography>Edit</Typography>
//           </Button>
//         </Box>
//       )}
//     </Card>
//   );
// }
