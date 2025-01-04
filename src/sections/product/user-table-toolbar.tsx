import {
  Box,
  Tooltip,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { Iconify } from 'src/components/iconify';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        height: 'auto', // Adjust height to fit content in mobile mode
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack items on mobile (xs) and row for larger screens (sm)
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }, // Align left on mobile and center for larger screens
        gap: { xs: 2, sm: 0 }, // Add spacing between items in mobile mode
        p: (theme) => theme.spacing(2, 1, 1, 1),
        ...(numSelected &&
          numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} {t('toolbar.selected')}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
            gap: { xs: 2, sm: '1rem' }, // Add spacing between items
            alignItems: { xs: 'flex-start', sm: 'center' },
            width: '100%', // Ensure full width in mobile view
          }}
        >
          {/* Dropdown Filter */}
          <TextField
            select
            label={t('toolbar.category')}
            value={selectedCategory}
            onChange={onCategoryChange}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on mobile
          >
            <option value="All">{t('toolbar.all_categories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>

          {/* Date Pickers */}
          <DatePicker
            label={t('toolbar.start_date')}
            value={startDate ? dayjs(startDate) : null}
            onChange={(newDate: Dayjs | null) =>
              onStartDateChange(newDate ? newDate.toDate() : null)
            }
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: { xs: '100%', sm: 'auto' } }, // Full width on mobile
              },
            }}
          />
          <DatePicker
            label={t('toolbar.end_date')}
            value={endDate ? dayjs(endDate) : null}
            onChange={(newDate: Dayjs | null) => onEndDateChange(newDate ? newDate.toDate() : null)}
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: { xs: '100%', sm: 'auto' } }, // Full width on mobile
              },
            }}
          />

          {/* Search Input */}
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder={t('toolbar.search_product')}
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{
              maxWidth: { xs: '100%', sm: 320 }, // Full width on mobile
              height: 40,
              '& .MuiInputBase-input': {
                padding: '12px',
                fontSize: '14px',
              },
            }}
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title={t('toolbar.delete')}>
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t('toolbar.filter_list')}>
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
