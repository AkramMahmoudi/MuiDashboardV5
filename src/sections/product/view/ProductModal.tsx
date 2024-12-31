// import axios from 'axios';
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

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>
  // ) => {
  //   const { name, value } = e.target as { name: string; value: unknown };

  //   setFormData((prevFormData) => {
  //     if (!prevFormData) return null;

  //     return {
  //       ...prevFormData,
  //       [name]:
  //         name === 'category_id' || name === 'price' || name === 'sell_price' || name === 'quantity'
  //           ? Number(value)
  //           : value, // Convert numeric fields
  //     };
  //   });
  // };
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData((prevFormData) => {
  //       if (!prevFormData) return null;
  //       return { ...prevFormData, image: file };
  //     });
  //   }
  // };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] !== undefined ? e.target.files?.[0] : null;
    // console.log(file);
    setFormData((prevFormData) => (prevFormData ? { ...prevFormData, image: file } : null));
  };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>
  // ) => {
  //   const { name, value } = e.target as { name: string; value: unknown };

  //   if (name === 'image') {
  //     const file = (e.target as HTMLInputElement).files?.[0] || null; // Handle file input
  //     setFormData((prevFormData) => (prevFormData ? { ...prevFormData, image: file } : null));
  //   } else {
  //     setFormData((prevFormData) =>
  //       prevFormData
  //         ? {
  //             ...prevFormData,
  //             [name]:
  //               name === 'category_id' ||
  //               name === 'price' ||
  //               name === 'sell_price' ||
  //               name === 'quantity'
  //                 ? Number(value)
  //                 : value,
  //           }
  //         : null
  //     );
  //   }
  // };

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

      // const payload = {
      //   name: formData.name,
      //   price: formData.price,
      //   sell_price: formData.sell_price,
      //   quantity: formData.quantity,
      //   category_id: formData.category_id,
      // };

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
        response = await createEntity('product', payload);
        setSnackbarMessage('Product added successfully!');
      } else {
        response = await updateEntity('product', formData.id, payload);
        setSnackbarMessage('Product updated successfully!');
      }
      // console.log(payload);
      // const response = await axios({
      //   method,
      //   url,
      //   data: payload,
      // });
      // console.log(response);
      // setSnackbarMessage(
      //   formData.id ? 'Product updated successfully!' : 'Product added successfully!'
      // );
      setSnackbarSeverity('success');
      fetchUsers(); // Refresh the product list
      onClose();
    } catch (error: any) {
      console.log(error.response.data.message);
      const errorArr = error.response?.data || [];
      // const errorArr = error.response.data;
      setSnackbarSeverity('error');

      if (error.response?.data?.message) {
        setSnackbarMessage(error.response?.data?.message);
      } else {
        // errorArr.map((err: string) => setSnackbarMessage(err));
        errorArr.forEach((err: string) => setSnackbarMessage(err));
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
        <TextField
          fullWidth
          margin="dense"
          label="Barcode"
          name="barcode"
          value={formData?.barcode?.map((barcodeObj) => barcodeObj.name).join(', ') || ''} // Join the array into a comma-separated string
          onChange={(e) => {
            const barcodes = e.target.value.split(',').map((item) => ({ name: item.trim() })); // Split and trim

            console.log(barcodes);
            setFormData((prevFormData) =>
              prevFormData ? { ...prevFormData, barcode: barcodes } : null
            );
          }}
          // onChange={(e) => {
          //   const barcodes = e.target.value.split(',').map((item) => ({ name: item.trim() })); // Create array of objects with "name" keys

          //   setFormData((prevFormData) =>
          //     prevFormData ? { ...prevFormData, barcode: barcodes } : null
          //   );
          // }}
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
