import { ExhibitionPreviewAdmin } from '@darta-types';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
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
import { useRouter } from 'next/router';
import * as React from 'react';

interface Data {
  id: number;
  location: string;
  galleryName: string;
  exhibitionTitle: string;
  exhibitionStart: Date;
  exhibitionEnd: Date;
  hasArtwork: string;   
  website: string;
}


function descendingComparator<T>(a: ExhibitionPreviewAdmin, b: ExhibitionPreviewAdmin, orderBy: keyof T) {

    switch(orderBy) { 
        case 'exhibitionStart': { 
            if (!a.openingDate?.value || !b.openingDate?.value) {
                return 0;
            } 
            
            // Convert date strings to Date objects
            const dateA = new Date(a.openingDate.value);
            const dateB = new Date(b.openingDate.value);

            // Compare the Date objects
            if (dateA < dateB) {
                return -1;
            }
            if (dateA > dateB) {
                return 1;
            }
            return 0;
        } 
        case 'exhibitionEnd': { 
            if (!a.closingDate?.value || !b.closingDate?.value) {
                return 0;
            } 
            
            // Convert date strings to Date objects
            const dateA = new Date(a.closingDate.value);
            const dateB = new Date(b.closingDate.value);

            // Compare the Date objects
            if (dateA < dateB) {
                return -1;
            }
            if (dateA > dateB) {
                return 1;
            }
            return 0;
        } 
        case 'galleryName': { 
            if (!a.galleryName?.value || !b.galleryName?.value) {
                return 0;
            } 
            
            // Convert date strings to Date objects
            const nameA = a.galleryName.value
            const nameB = b.galleryName.value

            // Compare the Date objects
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        } 
        case 'exhibitionTitle': { 
            if (!a.galleryName?.value || !b.galleryName?.value) {
                return 0;
            } 
            
            // Convert date strings to Date objects
            const nameA = a.galleryName.value
            const nameB = b.galleryName.value

            // Compare the Date objects
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        } 
        default: { 
           // statements; 
           break; 
        } 
     } 

     return 0

}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: ExhibitionPreviewAdmin,
  b: ExhibitionPreviewAdmin,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy as never)
    : (a, b) => -descendingComparator(a, b, orderBy as never);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    disablePadding: true,
    label: 'Action',
  },
  {
    id: 'location',
    disablePadding: true,
    label: 'Location',
  },
  {
    id: 'galleryName',
    disablePadding: false,
    label: 'Gallery',
  },
  {
    id: 'exhibitionTitle',
    disablePadding: false,
    label: 'Exhibition Title',
  },
  {
    id: 'exhibitionStart',
    disablePadding: false,
    label: 'Exhibition Start',
  },
  {
    id: 'exhibitionEnd',
    disablePadding: false,
    label: 'Exhibition End',
  },
  {
    id: 'hasArtwork',
    disablePadding: false,
    label: 'Artwork?',
  },
  {
    id: 'website',
    disablePadding: false,
    label: 'Website',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Galleries
        </Typography>
    </Toolbar>
  );
}
export default function EnhancedTable({exhibitions} : {exhibitions: ExhibitionPreviewAdmin[]}) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('exhibitionEnd');
  const [selected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [rows] = React.useState<ExhibitionPreviewAdmin[]>(exhibitions)

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    [order, orderBy, page, rowsPerPage],
  );

  const setTextColor = (date: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to remove time part
  
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to remove time part
  
    const differenceInTime = inputDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      if (differenceInDays > -7) {
        return 'white';
      } 
        return 'black';
      
    } if (differenceInDays >= 0 && differenceInDays <= 7) {
      return 'orange';
    }
  
    return 'black'; // Default color for dates beyond the next 7 days
  };

  const setBackgroundColor = (date: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to remove time part
  
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to remove time part
  
    const differenceInTime = inputDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      if (differenceInDays > -7) {
        return 'black';
      } 
        return 'red';
      
    } if (differenceInDays >= 0 && differenceInDays <= 7) {
      return 'black';
    }
  
    return 'white'; // Default color for dates beyond the next 7 days
  };


  const setTextColorHasArtwork = (date: Date, hasArtwork: boolean) => {
    if (hasArtwork){
        return 'black'
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to remove time part
  
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to remove time part
  
    const differenceInTime = inputDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      if (differenceInDays > -7) {
        return 'white';
      } 
        return 'red';
      
    } if (differenceInDays >= 0 && differenceInDays <= 7) {
      return 'orange';
    }
  
    return 'black'; // Default color for dates beyond the next 7 days
  };

  const setBackgroundColorHasArtwork = (date: Date, hasArtwork: boolean) => {
    if (hasArtwork){
        return 'black'
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to remove time part
  
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); // Normalize input date to remove time part
  
    const differenceInTime = inputDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      if (differenceInDays > -7) {
        return 'black';
      } 
        return 'red';
      
    } if (differenceInDays >= 0 && differenceInDays <= 7) {
      return 'black';
    }
  
    return 'white'; // Default color for dates beyond the next 7 days
  };


  const router = useRouter();
  const navigateToExhibition = (galleryId: string) => {
    router.push({
      pathname: '/Admin/AddExhibition',
      query: { galleryId },
    });
  }


  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row: ExhibitionPreviewAdmin, index: number) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const startDate = row?.openingDate?.value ? new Date(row?.openingDate?.value) : new Date()
                const closeDate = row?.closingDate?.value ? new Date(row?.closingDate?.value) : new Date()
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.exhibitionId}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                     >
                      <Button onClick={() => navigateToExhibition(row.galleryId)} variant="contained" color="primary">Add</Button>
                      </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                     />
                    <TableCell align="left">{row.exhibitionLocation.exhibitionLocationString.value}</TableCell>
                    <TableCell align="left">{row.galleryName?.value}</TableCell>
                    <TableCell align="left">{row.exhibitionTitle?.value}</TableCell>
                    <TableCell align="left">{startDate.toDateString()}</TableCell>
                    <TableCell align="left" sx={{
                        color: setTextColor(closeDate),
                        backgroundColor: setBackgroundColor(closeDate),        
                        }}>{closeDate.toDateString()}</TableCell>
                    <TableCell align="left" sx={{
                        color: setTextColorHasArtwork(closeDate, row.hasArtwork),
                        backgroundColor: setBackgroundColorHasArtwork(closeDate, row.hasArtwork),        
                        }}>{row.hasArtwork.toString()}</TableCell>
                    <TableCell align="left">
                        <a href={row.galleryWebsite?.value ?? ""} target="_blank" rel="noreferrer">
                            {row.galleryWebsite?.value}
                        </a>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 40, 60, 80, 100]}
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