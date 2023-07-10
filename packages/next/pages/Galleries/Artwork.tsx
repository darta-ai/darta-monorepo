import 'firebase/compat/auth';

import {Box, Button, Divider, Typography} from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';
import React from 'react';

import {retrieveGalleryArtworks} from '../../API/DartaGETrequests';
import {Artwork} from '../../globalTypes';
import {newArtworkShell} from '../../src/common/templates';
import {ArtworkCard} from '../../src/Components/Artwork/index';
import authRequired from '../../src/Components/AuthRequired/AuthRequired';
import {DartaRadioFilter, DartaTextFilter} from '../../src/Components/Filters';
import {UploadArtworksXlsModal} from '../../src/Components/Modals';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {
  GalleryReducerActions,
  useAppState,
} from '../../src/Components/State/AppContext';
import {
  galleryInquiriesDummyData,
  InquiryArtworkData,
} from '../../src/dummyData';
import {PRIMARY_BLUE, PRIMARY_MILK} from '../../styles';
import {galleryStyles} from '../../styles/GalleryPageStyles';
import {AuthContext} from '../_app';

function GalleryProfile() {
  const {state, dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);
  const [artworks, setArtworks] = React.useState<{[key: string]: Artwork}>({
    ...state?.galleryArtworks,
  });
  React.useEffect(() => {
    const getArtworkData = async () => {
      if (
        Object?.values(state?.galleryArtworks).length === 0 &&
        Object?.keys(artworks).length === 0
      ) {
        if (state?.accessToken || user?.accessToken) {
          const {galleryArtworks} = retrieveGalleryArtworks(
            state?.accessToken || user?.accessToken,
          );
          dispatch({
            type: GalleryReducerActions.SET_ARTWORKS,
            payload: {...galleryArtworks},
          });
          setArtworks({...galleryArtworks});
        }
      }
    };
    getArtworkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [displayArtworks, setDisplayArtworks] = React.useState<Artwork[]>();
  const [inquiries, setInquiries] = React.useState<{
    [key: string]: InquiryArtworkData[];
  } | null>(null);

  React.useEffect(() => {
    const inquiriesArray = Object.values(galleryInquiriesDummyData);
    const sortedInquiries: {[key: string]: InquiryArtworkData[]} = {};
    inquiriesArray.forEach((inquiry: InquiryArtworkData) => {
      if (sortedInquiries[inquiry.artworkId!]) {
        sortedInquiries[inquiry.artworkId!].push(inquiry);
      } else {
        sortedInquiries[inquiry.artworkId!] = [inquiry];
      }
    });
    setInquiries(sortedInquiries);

    if (!artworks) {
      setDisplayArtworks(Object?.values(artworks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    dispatch({
      type: GalleryReducerActions.SET_ARTWORKS,
      payload: artworks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks]);

  const handleBatchUpload = (uploadArtworks: {[key: string]: Artwork}) => {
    setArtworks({...artworks, ...uploadArtworks});
  };

  const addNewArtwork = () => {
    const newArtwork: Artwork = _.cloneDeep(newArtworkShell);
    newArtwork.artworkId = crypto.randomUUID();
    newArtwork.updatedAt = new Date().toISOString();
    newArtwork.createdAt = new Date().toISOString();
    setArtworks({...artworks, [newArtwork.artworkId]: newArtwork});
  };

  const saveArtwork = (artworkId: string, updatedArtwork: Artwork) => {
    const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
    newArtwork[artworkId] = updatedArtwork;
    setArtworks({...newArtwork});
  };

  const deleteArtwork = (artworkId: string) => {
    const newArtwork: {[key: string]: Artwork} = _.cloneDeep(artworks);
    delete newArtwork[artworkId];
    setArtworks({...newArtwork});
  };

  const [croppingModalOpen, setCroppingModalOpen] = React.useState(true);

  const [searchString, setSearchString] = React.useState<string | undefined>();
  const [filterString, setFilterString] = React.useState<string | undefined>();
  const [
    isSortedAscending,
    // setIsSortedAscending
  ] = React.useState<boolean>(true);

  const searchByString = (
    query: string | undefined,
    currentArtworks = artworks,
  ): Artwork[] | unknown[] => {
    if (!query) return Object.values(currentArtworks);
    let results = Object.values(currentArtworks);
    if (displayArtworks) {
      results = Object.values(displayArtworks).filter((item: Artwork) => {
        const {artistName, artworkTitle} = item;
        const medium = item?.artworkMedium;
        const lowercaseQuery = query.toLowerCase();
        const lowercaseMedium = medium?.value?.toLowerCase();
        const lowercaseArtistName = artistName?.value?.toLowerCase();
        const lowercaseArtworkTitle = artworkTitle?.value?.toLowerCase();

        return (
          lowercaseMedium?.includes(lowercaseQuery) ||
          lowercaseArtistName?.includes(lowercaseQuery) ||
          lowercaseArtworkTitle?.includes(lowercaseQuery)
        );
      });
    }

    return results;
  };

  const filterByInquiry = (query: string | unknown): void => {
    let results;
    if (!inquiries) return;
    const artworksWithInquiriesIds = Object?.keys(inquiries);
    switch (query) {
      case 'All':
        results = searchByString(searchString);
        if (!results) return;
        return setDisplayArtworks(results as Artwork[]);
      case 'Has Inquiries':
        results = Object.values(artworks)?.filter(artwork =>
          artworksWithInquiriesIds.includes(artwork.artworkId),
        );
        return setDisplayArtworks(results);
      case 'No Inquiries':
        results = Object.values(artworks)?.filter(
          artwork => !artworksWithInquiriesIds.includes(artwork.artworkId),
        );
        return setDisplayArtworks(results);
      default:
    }
  };

  React.useEffect(() => {
    if (searchString) {
      const searchResults = searchByString(searchString);
      if (searchResults) {
        setDisplayArtworks(searchResults as Artwork[]);
      }
    } else {
      setDisplayArtworks(Object?.values(artworks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  React.useEffect(() => {
    filterByInquiry(filterString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

  React.useEffect(() => {
    setDisplayArtworks(Object?.values(artworks));
  }, [artworks]);

  const toolTips = {
    filterBy: "Filter by the status of the artwork's inquiries.",
    searchBy: "Search by the artwork's title, artist, or medium.",
  };

  return (
    <>
      <Head>
        <title>Darta | Gallery</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <SideNavigationWrapper>
        <Box sx={galleryStyles.container}>
          <Box>
            <Typography variant="h2" sx={galleryStyles.typographyTitle}>
              Artwork
            </Typography>
          </Box>
          <Button
            variant="contained"
            data-testid="create-new-artwork-button"
            type="submit"
            onClick={() => addNewArtwork()}
            sx={{
              backgroundColor: PRIMARY_BLUE,
              color: PRIMARY_MILK,
              width: '50%',
              alignSelf: 'center',
            }}>
            Create Artwork
          </Button>
          <UploadArtworksXlsModal handleBatchUpload={handleBatchUpload} />
          <Divider variant="middle" style={galleryStyles.divider} flexItem>
            Filters
          </Divider>
          <Box sx={galleryStyles.filterContainer}>
            <Box>
              <DartaTextFilter
                toolTips={toolTips}
                fieldName="searchBy"
                value={searchString}
                handleInputChange={setSearchString}
              />
            </Box>
            <Box>
              <DartaRadioFilter
                toolTips={toolTips}
                fieldName="filterBy"
                options={['All', 'Has Inquiries', 'No Inquiries']}
                defaultValue="All"
                handleRadioFilter={setFilterString}
              />
            </Box>
          </Box>
          {inquiries && displayArtworks && (
            <Box sx={{display: 'flex', gap: '1vh', flexDirection: 'column'}}>
              {isSortedAscending
                ? displayArtworks
                    ?.sort((a, b) => {
                      const dateA = a?.createdAt
                        ? new Date(a.createdAt)
                        : new Date(0);
                      const dateB = b?.createdAt
                        ? new Date(b.createdAt)
                        : new Date(0);
                      return (dateB as any) - (dateA as any);
                    })
                    .map(artwork => (
                      <Box>
                        <ArtworkCard
                          artwork={artwork as Artwork}
                          saveArtwork={saveArtwork}
                          deleteArtwork={deleteArtwork}
                          croppingModalOpen={croppingModalOpen}
                          setCroppingModalOpen={setCroppingModalOpen}
                          inquiries={
                            inquiries[artwork?.artworkId] ??
                            ([] as InquiryArtworkData[])
                          }
                        />
                      </Box>
                    ))
                : displayArtworks
                    ?.sort((a, b) => {
                      const dateA = a?.createdAt
                        ? new Date(a.createdAt)
                        : new Date(0);
                      const dateB = b?.createdAt
                        ? new Date(b.createdAt)
                        : new Date(0);
                      return (dateA as any) - (dateB as any);
                    })
                    .map(artwork => (
                      <Box>
                        <ArtworkCard
                          artwork={artwork as Artwork}
                          saveArtwork={saveArtwork}
                          deleteArtwork={deleteArtwork}
                          croppingModalOpen={croppingModalOpen}
                          setCroppingModalOpen={setCroppingModalOpen}
                          inquiries={
                            inquiries[artwork?.artworkId] ??
                            ([] as InquiryArtworkData[])
                          }
                        />
                      </Box>
                    ))}
            </Box>
          )}
        </Box>
      </SideNavigationWrapper>
    </>
  );
}

export default authRequired(GalleryProfile);
