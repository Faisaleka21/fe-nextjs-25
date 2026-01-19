'use client';

import Layout from '@/components/ui/Layout';
import { service } from '@/services/services';
import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import RefreshIcon from '@mui/icons-material/Refresh'; // jalan / install terlebih dahulu: npm install @mui/icons-material
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDelete from '@/components/ui/ConfirmDelete';
import Link from 'next/link';
import { ProductType } from '@/services/data-types/product';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<ProductType[]>([]);
  const apiEndpoint = 'product';

  // State for deletion
  const [open, setOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState({
    id: '',
    name: '',
  });

  const handleClickOpen = (id: string, name: string) => {
    setSelectedDelete({ id, name });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDelete({ id: '', name: '' });
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await service(apiEndpoint);
      if (!response.error) {
        setRows(response.data);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Product Name', width: 200 },
      { field: 'description', headerName: 'Description', width: 300 },
      { field: 'product_category_id', headerName: 'ID Category Product', width: 300 },
      {
        field: 'action',
        headerName: 'Action',
        renderCell: (params) => (
          <>
            <Link href={`/product/edit/${params.row.id}`}>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Link>
            <IconButton
              size="small"
              onClick={() => handleClickOpen(params.row.id, params.row.name)}
            >
              <DeleteOutlineIcon fontSize="small" color="error" />
            </IconButton>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="text-black text-2xl font-bold">Product</h1>
        <Link href="/product/create">
          <Button variant="contained">Add New</Button>
        </Link>
      </div>

      <div style={{ minHeight: 400, width: '100%' }}>
        <div className="flex justify-end mb-2">
          <IconButton
            onClick={getData}
            disabled={isLoading}
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </div>

      <ConfirmDelete
        isOpen={open}
        onClose={handleClose}
        hrefDelete={apiEndpoint}
        id={selectedDelete.id}
        name={selectedDelete.name}
        refresh={getData}
      />
    </Layout>
  );
}
