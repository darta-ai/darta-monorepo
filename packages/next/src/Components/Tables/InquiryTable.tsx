import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {alpha} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';

type GalleryInquiryStats =
  | 'inquired'
  | 'responded'
  | 'negotiation'
  | 'accepted'
  | 'purchase_agreement_sent'
  | 'payment_received'
  | 'declined'
  | 'archived';

type ArtworkData = {
  id: string;
  artist: string;
  artwork: string;
  workURL: string;
  user: string;
  userContactEmail?: string;
  status: GalleryInquiryStats;
  artworkId: string;
  inquiredAt: string;
  updatedAt: string;
};

type InputArtworkData = {
  [key: string]: ArtworkData;
};

interface HeadCell {
  id: keyof ArtworkData;
  label: string;
  date: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'user',
    date: false,
    label: 'Inquirer Name',
  },
  {
    id: 'userContactEmail',
    date: false,
    label: 'Inquirer Contact',
  },
  {
    id: 'status',
    date: false,
    label: 'Status',
  },
];

const galleryInquiriesDummyData: InputArtworkData = {
  '0': {
    id: '1',
    user: 'Hannah Chinn',
    userContactEmail: 'JohnDoe@gmail.com',
    status: 'responded',
    artworkId: '57505fd17622dd6614001e39',
    inquiredAt: '2021-12-10',
    updatedAt: '2021-11-10',
  },
  '1': {
    id: '2',
    artist: 'Luke Murphy',
    artwork: 'Death from Above',
    workURL:
      'https://d32dm0rphc51dk.cloudfront.net/iF-uaFfUQ37zFSWeN_Cicg/larger.jpg',
    user: 'John Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: '57505fd17622dd6614001e40',
    inquiredAt: '2021-10-10',
    updatedAt: '2021-10-10',
  },
  '2': {
    id: '3',
    artist: 'Dave Roberts',
    artwork: 'Hmmmmmmm',
    workURL:
      'https://d32dm0rphc51dk.cloudfront.net/iF-uaFfUQ37zFSWeN_Cicg/larger.jpg',
    user: 'Dave Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: '57505fd17622dd6614001e41',
    inquiredAt: '2021-10-10',
    updatedAt: '2023-08-10',
  },
  '3': {
    id: '4',
    artist: 'This is a really long name for testing cell size',
    artwork: 'This is a really long name for testing cell size',
    workURL:
      'https://d32dm0rphc51dk.cloudfront.net/iF-uaFfUQ37zFSWeN_Cicg/larger.jpg',
    user: 'This is a really long name for testing cell sizes',
    userContactEmail: 'This is a really long name for testing cell size',
    status: 'inquired',
    artworkId: '57505fd17622dd6614001e42',
    inquiredAt: '2022-10-10',
    updatedAt: '2023-03-10',
  },
  '4': {
    id: '5',
    artist: 'Brandon Crawford',
    artwork: 'Hangman',
    workURL:
      'https://d32dm0rphc51dk.cloudfront.net/iF-uaFfUQ37zFSWeN_Cicg/larger.jpg',
    user: 'Jolene Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: '57505fd17622dd6614001e43',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
  '5': {
    id: '6',
    artist: 'Brandon Belt',
    artwork: 'Hanging Slider',
    workURL:
      'https://d32dm0rphc51dk.cloudfront.net/iF-uaFfUQ37zFSWeN_Cicg/larger.jpg',
    user: 'Jolene Doe',
    userContactEmail: 'JamesDoe@gmail.com',
    status: 'inquired',
    artworkId: '57505fd17622dd6614001e43',
    inquiredAt: '2021-09-10',
    updatedAt: '2021-10-10',
  },
};

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
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ArtworkData,
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {order, orderBy, onRequestSort} = props;
  const createSortHandler =
    (property: keyof ArtworkData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              <Typography variant="h6">{headCell.label}</Typography>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function InquiryTable() {
  const [rows, setRows] = React.useState<any[]>(
    Object.values(galleryInquiriesDummyData),
  );
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ArtworkData>('updatedAt');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleArtworkStatusChange = (event: SelectChangeEvent) => {
    const {name, value} = event.target;
    // NEED BACKEND CALL TO UPDATE STATUS
    setRows(tableRows =>
      tableRows.map(row =>
        row.artworkId === name
          ? {
              ...row,
              status: value as String,
            }
          : row,
      ),
    );
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ArtworkData,
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
    console.log('triggered', parseInt(event.target.value, 5));
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rows, rowsPerPage],
  );

  return (
    <Box sx={{width: '100%'}}>
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
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{cursor: 'pointer'}}>
                    <TableCell padding="checkbox" />
                    <TableCell sx={{maxWidth: '10vh'}} align="left">
                      <Typography fontSize="medium">
                        {row.user}{' '}
                        {row.userContactEmail && row.status === 'inquired' && (
                          <a
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{color: 'inherit'}}
                            href={`mailto:${row.userContactEmail}?subject=Darta%20Inquiry:%20${row.artist},%20${row.artwork}
                          &body=Hi%20${row.user},`}>
                            <SendIcon fontSize="small" />
                          </a>
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{maxWidth: '10vh'}} align="left">
                      <Typography fontSize="medium">
                        {row.userContactEmail}
                        <IconButton
                          onClick={() =>
                            copyToClipboard(row.userContactEmail as string)
                          }>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{maxWidth: '15vh'}} align="left">
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={row.status as string}
                          name={row.artworkId.toString()}
                          onChange={handleArtworkStatusChange}>
                          <MenuItem value="inquired">
                            <Typography fontSize="small">Inquired</Typography>
                          </MenuItem>
                          <MenuItem value="responded">
                            <Typography fontSize="small">Responded</Typography>
                          </MenuItem>
                          <MenuItem value="negotiation">
                            <Typography fontSize="small">
                              Negotiation
                            </Typography>
                          </MenuItem>
                          <MenuItem value="accepted">
                            <Typography fontSize="small">Accepted</Typography>
                          </MenuItem>
                          <MenuItem value="purchase_agreement_sent">
                            <Typography fontSize="small">
                              Purchase Agreement Sent
                            </Typography>
                          </MenuItem>
                          <MenuItem value="payment_received">
                            <Typography fontSize="small">
                              Payment Received
                            </Typography>
                          </MenuItem>
                          <MenuItem value="declined">
                            <Typography fontSize="small">Declined</Typography>
                          </MenuItem>
                          <MenuItem value="archived">
                            <Typography fontSize="small">Archived</Typography>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="left" />
                  </TableRow>
                );
              })}
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
