import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export type UserProps = {
  id: string;
  name: string;
  phone: string;
  montant: number;
  ancien: number;
};
type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: (row: UserProps) => void; // New prop
  onDelete: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onEdit, onDelete }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.id} />
            {/* {row.name} */}
          </Box>
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.phone}</TableCell>
        {/* <TableCell>
          {row.barcode.length > 0
            ? row.barcode.map((item, index) => item.barcode).join(', ') // Extract and join barcodes
            : 'N/A'}
        </TableCell> */}
        <TableCell>{row.montant}</TableCell>
        <TableCell>{row.ancien}</TableCell>
        {/* <TableCell align="center">
          {row.phone ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell> */}

        {/* <TableCell>
          <Label color={(row.role === 'banned' && 'error') || 'success'}>{row.role}</Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              padding: 1.2,
            },
          }}
        >
          <MenuItem onClick={() => onEdit(row)}>
            <Iconify icon="akar-icons:edit" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={onDelete}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
