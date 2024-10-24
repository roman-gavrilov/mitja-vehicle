'use client';
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/contexts/UserContext";

const ListsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'brand', direction: 'asc' });
  const router = useRouter();
  const {user} = useUser();


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/dashboard/savelists');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(Array.isArray(data.salelists) ? data.salelists : []);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to load cars. Please try again later.');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSortChange = (event) => {
    const [key, direction] = event.target.value.split('-');
    setSortConfig({ key, direction });
  };

  const sortedCars = [...cars].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleCreateNew = () => {
    router.push('/dashboard/direct-sale/save');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5" component="h1">
          Vehicle Listings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          disabled={user?.role === 'private' && user?.vehicles?.length == 1}
        >
          Create New
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="brand-asc">Brand (A-Z)</MenuItem>
            <MenuItem value="brand-desc">Brand (Z-A)</MenuItem>
            <MenuItem value="year-desc">Year (Newest)</MenuItem>
            <MenuItem value="year-asc">Year (Oldest)</MenuItem>
            <MenuItem value="price-asc">Price (Low to High)</MenuItem>
            <MenuItem value="price-desc">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {cars.length === 0 ? (
        <Typography variant="body1">No cars available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('brand')} sx={{ cursor: 'pointer' }}>
                  Brand {sortConfig.key === 'brand' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell onClick={() => handleSort('model')} sx={{ cursor: 'pointer' }}>
                  Model {sortConfig.key === 'model' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell onClick={() => handleSort('year')} sx={{ cursor: 'pointer' }}>
                  Year {sortConfig.key === 'year' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell onClick={() => handleSort('price')} sx={{ cursor: 'pointer' }}>
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCars.map((car) => (
                <TableRow 
                  key={car._id}
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>${car.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push(`/dashboard/direct-sale/update/${car._id}`)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ListsPage;