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

import {InquiryArtworkData} from '../../dummyData';

const tableStyles = {
  container: {
    '@media (min-width: 800px)': {
      width: '80vw',
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
    id: 'user',
    date: false,
    label: 'Inquirer',
  },
  {
    id: 'status',
    date: false,
    label: 'Status',
  },
  {
    id: 'userContactEmail',
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
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.label === 'Status' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}>
                <Typography variant="h6">{headCell.label}</Typography>
              </TableSortLabel>
            ) : (
              <Typography variant="h6">{headCell.label}</Typography>
            )}
          </TableCell>
        ))}
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
  const [rows] = React.useState<any[] | undefined>(inquiryDataArray);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof InquiryArtworkData>('updatedAt');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleArtworkStatusChange = () =>
    // event: SelectChangeEvent
    {
      // const {name, value} = event.target;
      // // NEED BACKEND CALL TO UPDATE STATUS
      // if (tableRows) {
      //   setRows(tableRows =>
      //     tableRows.map(row =>
      //       row.id === name
      //         ? {
      //             ...row,
      //             status: value as String,
      //           }
      //         : row,
      //     ),
      //   );
      // }
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
              {visibleRows.map(row => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{cursor: 'pointer'}}>
                    <TableCell padding="checkbox" />
                    <TableCell sx={{maxWidth: '10vh'}} align="left">
                      <Typography fontSize="medium">{row.user}</Typography>
                    </TableCell>

                    <TableCell sx={{maxWidth: '15vh'}} align="left">
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={row.status as string}
                          name={row.id.toString()}
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
                    <TableCell
                      sx={{maxWidth: '10vh', textOverflow: 'ellipsis'}}
                      align="left">
                      <Typography fontSize="medium">
                        {row.userContactEmail}
                        <IconButton
                          onClick={() =>
                            copyToClipboard(row.userContactEmail as string)
                          }>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        {row.userContactEmail && (
                          <a
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{color: 'inherit'}}
                            href={`mailto:${row.userContactEmail}?subject=Darta%20Inquiry:%20${artist}
                          &body=Hi%20${row.user},`}>
                            <SendIcon fontSize="small" />
                          </a>
                        )}
                      </Typography>
                    </TableCell>
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
