import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { fetchData } from '../../apiService';

export interface ProductFormData {
  id?: string; // Optional, since new products may not have an ID yet
  name: string;
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number;
}
interface Category {
  id: number;
  name: string;
}
interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  formData: ProductFormData | null;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData | null>>;
  fetchUsers: () => void;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  fetchUsers,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories dynamically (replace with actual API if necessary)
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const response = await fetchData<Category[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/categories`,
            {}
          );

          setCategories(response.data.flat());
          console.log(response.data.flat());
          
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>
  ) => {
    const { name, value } = e.target as { name: string; value: unknown };

    setFormData((prevFormData) => {
      if (!prevFormData) return null;

      return {
        ...prevFormData,
        [name]:
          name === 'category_id' || name === 'price' || name === 'sell_price' || name === 'quantity'
            ? Number(value)
            : value, // Convert numeric fields
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!formData) {
        setSnackbarMessage('Failed to process product data.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      console.log(formData);
      const url =
        formData.id !== ''
          ? `${import.meta.env.VITE_API_BASE_URL}/api/product/${formData.id}`
          : `${import.meta.env.VITE_API_BASE_URL}/api/product`;
      const method = formData.id ? 'put' : 'post';

      const payload = {
        name: formData.name,
        price: formData.price,
        sell_price: formData.sell_price,
        quantity: formData.quantity,
        category_id: formData.category_id,
      };
      console.log(payload);
      const response = await axios({
        method,
        url,
        data: payload,
      });
      console.log(response);
      setSnackbarMessage(
        formData.id ? 'Product updated successfully!' : 'Product added successfully!'
      );
      setSnackbarSeverity('success');
      fetchUsers(); // Refresh the product list
      onClose();
    } catch (error: any) {
      console.log(error.response.data.message);
      const errorArr = error.response.data;
      setSnackbarSeverity('error');

      if (error.response.data.message === 'invalid token') {
        setSnackbarMessage(error.response.data.message);
      } else {
        errorArr.map((err: string) => setSnackbarMessage(err));
      }
      // setSnackbarMessage('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formData?.id ? 'Edit Product' : 'New Product'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Name"
          name="name"
          value={formData?.name || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={formData?.price || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sell Price"
          name="sell_price"
          type="number"
          value={formData?.sell_price || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Quantity"
          name="quantity"
          type="number"
          value={formData?.quantity || ''}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select name="category_id" value={formData?.category_id || ''} onChange={handleChange}>
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
