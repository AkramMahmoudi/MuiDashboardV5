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
  // handleimage for base64
  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormData((prevFormData) => {
  //         if (!prevFormData) return null;
  //         return { ...prevFormData, image: reader.result as string };
  //       });
  //     };
  //     reader.readAsDataURL(file); // Convert image to Base64
  //   }
  // };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => {
        if (!prevFormData) return null;
        return { ...prevFormData, image: file };
      });
    }
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
      // base 64
      // const payload = {
      //   name: formData.name,
      //   username: formData.username,
      //   password: formData.password,
      //   phone: formData.phone,
      //   role: formData.role,
      //   image: formData.image === '' ? null : formData.image,
      // };
      // Construct a FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('role', formData.role);
      if (formData.image) {
        formDataToSend.append('image', formData.image); // Append only if the image is not null
      } else {
        formDataToSend.append('image', 'null'); // Append an empty string to maintain the key
      }

      let response;
      // base64
      // if (!formData.id) {
      //   response = await createEntity('user', payload);
      //   setSnackbarMessage('User added successfully!');
      // } else {
      //   response = await updateEntity('user', formData.id, payload);
      //   setSnackbarMessage('User updated successfully!');
      // }
      if (!formData.id) {
        // For creating a new user
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
      <DialogTitle>{formData?.id ? 'Edit User' : 'New User'}</DialogTitle>
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
          label="username"
          name="username"
          value={formData?.username || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="password"
          name="password"
          value={formData?.password || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="phone"
          name="phone"
          type="number"
          value={formData?.phone || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="role"
          name="role"
          value={formData?.role || ''}
          onChange={handleChange}
        />
        {/* <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData?.role || ''} onChange={handleChange}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl> */}
        {/* <TextField
          fullWidth
          margin="dense"
          label="image"
          name="image"
          value={formData?.image || ''}
          onChange={handleChange}
        /> */}
        <TextField
          fullWidth
          margin="dense"
          type="file"
          InputLabelProps={{ shrink: true }}
          onChange={handleImageChange}
        />
        {/* <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select name="category_id" value={formData?.category_id || ''} onChange={handleChange}>
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
