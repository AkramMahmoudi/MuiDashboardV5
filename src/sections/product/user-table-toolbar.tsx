import { TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
type Category = {
  id: number;
  name: string;
};
type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: Category[]; // قائمة الفئات
  selectedCategory: string | number; // الفئة المختارة
  onCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // تغيير الفئة
  startDate: Date | null; // Start date for filtering
  endDate: Date | null; // End date for filtering
  onStartDateChange: (date: Date | null) => void; // Start date change handler
  onEndDateChange: (date: Date | null) => void; // End date change handler
};

export function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  categories,
  selectedCategory,
  onCategoryChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: UserTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected &&
          numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Dropdown Filter */}
          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={onCategoryChange}
            SelectProps={{
              native: true,
            }}
            size="small"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>
          {/* Date Pickers */}
          <DatePicker
            label="Start Date"
            value={startDate ? dayjs(startDate) : null}
            onChange={
              (newDate: Dayjs | null) => onStartDateChange(newDate ? newDate.toDate() : null) // Convert Dayjs to Date
            }
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: { size: 'small' },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate ? dayjs(endDate) : null} // Convert Date to Dayjs
            onChange={
              (newDate: Dayjs | null) => onEndDateChange(newDate ? newDate.toDate() : null) // Convert Dayjs to Date
            }
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: { size: 'small' },
            }}
          />
          {/* search input */}
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search Product..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{
              maxWidth: 320,
              height: 40, // Set the height
              '& .MuiInputBase-input': {
                padding: '12px', // Adjust the padding for the text inside the input
                fontSize: '14px', // Adjust font size if needed
              },
            }}
          />
        </div>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
