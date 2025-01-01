// import axios from 'axios';
import * as Yup from 'yup';
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

import { productValidationSchema } from '../../validation';
import { fetchData, createEntity, updateEntity } from '../../apiService';

export interface ProductFormData {
  id?: string; // Optional, since new products may not have an ID yet
  name: string;
  price: number;
  sell_price: number;
  quantity: number;
  category_id: number;
  image: File | null;
  barcode: { name: string }[];
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
          // console.log(response.data.flat());
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] !== undefined ? e.target.files?.[0] : null;
    // console.log(file);
    setFormData((prevFormData) => (prevFormData ? { ...prevFormData, image: file } : null));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>
  ) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData((prevFormData) =>
      prevFormData
        ? {
            ...prevFormData,
            [name]:
              name === 'category_id' ||
              name === 'price' ||
              name === 'sell_price' ||
              name === 'quantity'
                ? Number(value)
                : value,
          }
        : null
    );
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
      await productValidationSchema.validate(formData, { abortEarly: false });

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', String(formData.price));
      payload.append('sell_price', String(formData.sell_price));
      payload.append('quantity', String(formData.quantity));
      payload.append('category_id', String(formData.category_id));
      // console.log(formData.barcode.map((code) => code.name));
      // because backend accept simple array of barcodes so i convert to array without key
      const convBarcode = formData.barcode.map((code) => code.name);
      payload.append('barcode', JSON.stringify(convBarcode));
      // console.log(JSON.stringify(convBarcode));
      console.log(formData.image instanceof File);
      if (formData.image instanceof File) {
        payload.append('image', formData.image);
      } else {
        payload.append('image', 'null');
      }

      let response;
      if (!formData.id) {
        const defaultImageResponse = await fetch('/DPI.jpg'); // Adjust path based on your public folder
        const defaultImageBlob = await defaultImageResponse.blob();
        const defaultImageFile = new File([defaultImageBlob], 'DPI.jpg', { type: 'image/jpg' });
        console.log(defaultImageFile);
        payload.set('image', defaultImageFile); // Replace the existing value
        response = await createEntity('product', payload);
        setSnackbarMessage('Product added successfully!');
      } else {
        response = await updateEntity('product', formData.id, payload);
        setSnackbarMessage('Product updated successfully!');
      }

      setSnackbarSeverity('success');
      fetchUsers(); // Refresh the product list
      onClose();
    } catch (error: any) {
      // const errorArr = error.response.data;

      if (error instanceof Yup.ValidationError) {
        // Collect all validation errors
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors); // Update errors state
      }
      // else {
      //   setSnackbarMessage('An unexpected error occurred.');
      // }
      if (error.response?.data?.message) {
        console.log('first');
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response?.data?.message);
      } else if (error.response?.data instanceof Array) {
        // errorArr.map((err: string) => setSnackbarMessage(err));
        const errorArr = error.response?.data;

        errorArr.forEach((err: string) => {
          setSnackbarSeverity('error');
          setSnackbarMessage(err);
        });
      } else {
        // console.log('i m here');
        setSnackbarSeverity('error');
        setSnackbarMessage('form valdation error');
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
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={formData?.price || ''}
          onChange={handleChange}
          error={Boolean(errors.price)}
          helperText={errors.price}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sell Price"
          name="sell_price"
          type="number"
          value={formData?.sell_price || ''}
          onChange={handleChange}
          error={Boolean(errors.sell_price)}
          helperText={errors.sell_price}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Quantity"
          name="quantity"
          type="number"
          value={formData?.quantity || ''}
          onChange={handleChange}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="category_id"
            value={formData?.category_id || ''}
            onChange={handleChange}
            error={Boolean(errors.category_id)}
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="dense"
          label="Barcode"
          name="barcode"
          value={formData?.barcode?.map((barcodeObj) => barcodeObj.name).join(', ') || ''} // Join the array into a comma-separated string
          onChange={(e) => {
            const barcodes = e.target.value.split(',').map((item) => ({ name: item.trim() })); // Split and trim

            // console.log(barcodes);
            setFormData((prevFormData) =>
              prevFormData ? { ...prevFormData, barcode: barcodes } : null
            );
          }}
          error={Boolean(errors.barcode)}
          helperText={errors.barcode}
        />
        <TextField
          fullWidth
          margin="dense"
          type="file"
          InputLabelProps={{ shrink: true }}
          onChange={handleImageChange}
        />
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
