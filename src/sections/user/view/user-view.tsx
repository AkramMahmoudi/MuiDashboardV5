// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import { _users } from 'src/_mock';
// import { DashboardContent } from 'src/layouts/dashboard';

// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from '../table-no-data';
// import { UserTableRow } from '../user-table-row';
// import { UserTableHead } from '../user-table-head';
// import { TableEmptyRows } from '../table-empty-rows';
// import { UserTableToolbar } from '../user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from '../utils';

// import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

// export function UserView() {
//   const table = useTable();

//   const [filterName, setFilterName] = useState('');

//   const dataFiltered: UserProps[] = applyFilter({
//     inputData: _users,
//     comparator: getComparator(table.order, table.orderBy),
//     filterName,
//   });

//   const notFound = !dataFiltered.length && !!filterName;

//   return (
//     <DashboardContent>
//       <Box display="flex" alignItems="center" mb={5}>
//         <Typography variant="h4" flexGrow={1}>
//           Users
//         </Typography>
//         <Button
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//         >
//           New user
//         </Button>
//       </Box>

//       <Card>
//         <UserTableToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
//             setFilterName(event.target.value);
//             table.onResetPage();
//           }}
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 800 }}>
//               <UserTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={_users.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     _users.map((user) => user.id)
//                   )
//                 }
//                 headLabel={[
//                   { id: 'name', label: 'Name' },
//                   { id: 'company', label: 'Company' },
//                   { id: 'role', label: 'Role' },
//                   { id: 'isVerified', label: 'Verified', align: 'center' },
//                   { id: 'status', label: 'Status' },
//                   { id: '' },
//                 ]}
//               />
//               <TableBody>
//                 {dataFiltered
//                   .slice(
//                     table.page * table.rowsPerPage,
//                     table.page * table.rowsPerPage + table.rowsPerPage
//                   )
//                   .map((row) => (
//                     <UserTableRow
//                       key={row.id}
//                       row={row}
//                       selected={table.selected.includes(row.id)}
//                       onSelectRow={() => table.onSelectRow(row.id)}
//                     />
//                   ))}

//                 <TableEmptyRows
//                   height={68}
//                   emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
//                 />

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           page={table.page}
//           count={_users.length}
//           rowsPerPage={table.rowsPerPage}
//           onPageChange={table.onChangePage}
//           rowsPerPageOptions={[5, 10, 25]}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Card>
//     </DashboardContent>
//   );
// }

// ----------------------------------------------------------------------
// new version with api call
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, emptyRowsv2, applyFilter, getComparator } from '../utils';

// Define the structure of a user and the response
interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: string;
}

interface UserResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
}

export function UserView() {
  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0); // Tracks current page (0-based index for MUI)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [totalUsers, setTotalUsers] = useState(0); // Total users count

  // Fetch users based on page and rows per page
  const fetchUsers = async (p = 1) => {
    try {
      const response = await axios.get<UserResponse>(`http://192.168.1.9:3000/api/users?page=${p}`);

      const { data, per_page, total } = response.data;
      setUsers(data); // Set the raw data directly
      setRowsPerPage(per_page); // Set rows per page dynamically
      setTotalUsers(total); // Update the total user count
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when the component mounts or when the page changes
  useEffect(() => {
    fetchUsers(page + 1); // Adjust to 1-based page index for the API
  }, [page]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage); // Update the page number
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator('asc', 'name'),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={0} // Adjust based on your selection logic
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            setPage(0); // Reset to the first page when filter changes
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order="asc"
                orderBy="name"
                rowCount={users.length}
                numSelected={0} // Adjust based on your selection logic
                onSort={() => {}} // Add sorting logic if needed
                onSelectAllRows={() => {}} // Add selection logic if needed
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'username', label: 'Username' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={false} // Adjust based on your selection logic
                    onSelectRow={() => {}} // Add selection logic if needed
                  />
                ))}

                {emptyRowsv2(page, rowsPerPage, totalUsers) > 0 && (
                  <TableEmptyRows
                    height={68} // Set the height for empty rows
                    emptyRows={emptyRowsv2(page, rowsPerPage, totalUsers)}
                  />
                )}

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page} // Current page (0-based for Material-UI)
          count={totalUsers} // Total number of users from the API
          rowsPerPage={rowsPerPage} // Rows per page
          onPageChange={handlePageChange} // Handle page change
          rowsPerPageOptions={[rowsPerPage]} // Fixed to the API's per_page value
        />
      </Card>
    </DashboardContent>
  );
}
