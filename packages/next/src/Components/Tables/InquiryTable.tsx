import {InquiryArtworkData} from '@darta-types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import React from 'react';

import { editArtworkInquiryAPI } from '../../API/artworks/artworkRoutes';
import { formStyles } from '../FormComponents/styles';

const tableStyles = {
  container: {
    minWidth: '100%',
    width: '90vw',
    '@media (min-width: 1280px)': {
      width: '70vw',
    },
  },
};

interface HeadCell {
  id: keyof InquiryArtworkData;
  label: string;
  date: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'legalFirstName',
    date: false,
    label: 'Inquirer',
  },
  {
    id: 'status',
    date: false,
    label: 'Status',
  },
  {
    id: 'email',
    date: false,
    label: 'Contact',
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string},
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map(el => el[0]);
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof InquiryArtworkData,
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {order, orderBy, onRequestSort} = props;
  const createSortHandler =
    (property: keyof InquiryArtworkData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map(headCell => {
        const isStatusCell = headCell.label === 'Status';
        if (isStatusCell){
          return (
            <TableCell
              key={headCell.id}
              sx={formStyles.hiddenOnMobile}
              sortDirection={orderBy === headCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}>
                  <Typography variant="h6">{headCell.label}</Typography>
                </TableSortLabel>
            </TableCell>
          )
        } 
          return (
          <TableCell
          key={headCell.id}
          sortDirection={orderBy === headCell.id ? order : false}>
            <Typography variant="h6">{headCell.label}</Typography>
            </TableCell>
            )
          }
          )
        }
      </TableRow>
    </TableHead>
  );
}

export function InquiryTable({
  inquiryData,
  artist,
}: {
  inquiryData: InquiryArtworkData[] | undefined;
  artist: string;
}) {
  let inquiryDataArray;
  if (inquiryData) {
    inquiryDataArray = Object.values(inquiryData);
  }
  const [rows, setRows] = React.useState<any[] | undefined>(inquiryDataArray);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof InquiryArtworkData>('updatedAt');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleArtworkStatusChange = async ({value, row} : {value: string, row: InquiryArtworkData}) => {
      try{
        const {status} = await editArtworkInquiryAPI({
          edge_id: row.edge_id,
          status: value,
        });
        if (status) {
          const updatedRows = rows?.map((r) => {
            if (r.edge_id === row.edge_id) {
              return {...r, status: value}
            }
            return r
          })
          setRows(updatedRows)
        }
      } catch (error: any) {
        // TO-DO: throw error for frontend
        // console.log(error)
      }
    };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof InquiryArtworkData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // console.error('Failed to copy text: ', err);
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows?.length || 0)) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows as any[], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rows, rowsPerPage],
  );

  return (
    <Box sx={tableStyles.container}>
      <Paper sx={{width: '100%', mb: 2}}>
        <TableContainer>
          <Table
            sx={{maxWidth: '100%', alignSelf: 'center'}}
            aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy as string}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map(row => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.artwork_id}
                    sx={{cursor: 'pointer'}}>
                    <TableCell padding="checkbox" />
                    <TableCell sx={{maxWidth: '5vw'}} align="left">
                      <Typography fontSize="medium">{`${row.legalFirstName} ${row.legalLastName}`}</Typography>
                    </TableCell>

                    <TableCell sx={{...formStyles.hiddenOnMobile, maxWidth: '5vw'}} align="left">
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={row?.status as string}
                          name={row?.status?.toString()}
                          onChange={(e) => handleArtworkStatusChange({value: e?.target?.value!, row: row as InquiryArtworkData})}>
                          <MenuItem value="inquired">
                            <Typography fontSize="small">Inquired</Typography>
                          </MenuItem>
                          <MenuItem value="gallery_responded">
                            <Typography fontSize="small">Responded</Typography>
                          </MenuItem>
                          <MenuItem value="negotiation">
                            <Typography fontSize="small">
                              In Negotiation
                            </Typography>
                          </MenuItem>
                          <MenuItem value="accepted">
                            <Typography fontSize="small">Accepted</Typography>
                          </MenuItem>
                          <MenuItem value="payment_received">
                            <Typography fontSize="small">
                              Payment Received
                            </Typography>
                          </MenuItem>
                          <MenuItem value="artwork_sent">
                            <Typography fontSize="small">
                              Artwork Sent
                            </Typography>
                          </MenuItem>
                          <MenuItem value="closed">
                            <Typography fontSize="small">
                              Closed
                            </Typography>
                          </MenuItem>
                          <MenuItem value="gallery_declined">
                            <Typography fontSize="small">Declined</Typography>
                          </MenuItem>
                          <MenuItem value="gallery_archived">
                            <Typography fontSize="small">Archived</Typography>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell
                      sx={{maxWidth: '10vh', textOverflow: 'ellipsis'}}
                      align="left">
                      <Typography fontSize="medium">
                        {row?.email}
                        <IconButton
                          onClick={() =>
                            copyToClipboard(row?.email as string)
                          }>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        {row?.email && (
                          <a
                            style={{color: 'inherit'}}
                            href={`mailto:${row?.email}?subject=Darta%20Inquiry:%20${artist}
                          &body=Hi%20${row.legalFirstName} ${row.legalLastName},`}>
                            <SendIcon fontSize="small" />
                          </a>
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows?.length as number}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
