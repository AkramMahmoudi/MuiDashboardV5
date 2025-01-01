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

import { UserValidationSchema } from '../../validation';
import { fetchData, createEntity, updateEntity } from '../../apiService';

export interface ProductFormData {
  id?: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  role: string;
  image: File | null;
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
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }
  }, [open]);

  const handleClose = () => {
    setErrors({});
    onClose(); // Call onClose to close the modal
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] !== undefined ? e.target.files?.[0] : null;
    // console.log(file);
    setFormData((prevFormData) => (prevFormData ? { ...prevFormData, image: file } : null));
  };

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

      // Validate form data with Yup
      await UserValidationSchema.validate(formData, { abortEarly: false });

      // Construct a FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('role', formData.role);
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else {
        formDataToSend.append('image', 'null');
      }

      let response;

      if (!formData.id) {
        const defaultImageResponse = await fetch('/DPI.jpg'); // Adjust path based on your public folder
        const defaultImageBlob = await defaultImageResponse.blob();
        const defaultImageFile = new File([defaultImageBlob], 'DPI.jpg', { type: 'image/jpg' });
        console.log(defaultImageFile);
        formDataToSend.set('image', defaultImageFile); // Replace the existing value
        response = await createEntity('user', formDataToSend);
        setSnackbarMessage('User added successfully!');
      } else {
        // For updating an existing user
        response = await updateEntity('user', formData.id, formDataToSend);
        setSnackbarMessage('User updated successfully!');
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
      <DialogTitle>{formData?.id ? 'Edit User' : 'New User'}</DialogTitle>
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
          label="username"
          name="username"
          value={formData?.username || ''}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          fullWidth
          margin="dense"
          label="password"
          name="password"
          type="password"
          value={formData?.password || ''}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          label="phone"
          name="phone"
          value={formData?.phone || ''}
          onChange={handleChange}
          error={Boolean(errors.phone)}
          helperText={errors.phone}
        />
        <TextField
          fullWidth
          margin="dense"
          label="role"
          name="role"
          value={formData?.role || ''}
          onChange={handleChange}
          error={Boolean(errors.role)}
          helperText={errors.role}
        />
        {/* <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData?.role || ''} onChange={handleChange}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl> */}
        <TextField
          fullWidth
          margin="dense"
          type="file"
          InputLabelProps={{ shrink: true }}
          onChange={handleImageChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
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
