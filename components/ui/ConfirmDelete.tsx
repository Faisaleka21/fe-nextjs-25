import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { serviceDestroy } from '@/services/services';

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  hrefDelete: string;
  id: string | number;
  name: string;
  refresh?: () => void;
}

export default function ConfirmDelete({
  isOpen,
  onClose,
  hrefDelete,
  id,
  name,
  refresh,
}: ConfirmDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await serviceDestroy(hrefDelete!, id);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.data.message);
        if (refresh) {
          await refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are you sure you want to delete `}{' '}
        <span className="text-red-500">{name}</span>?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This change cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={handleDelete}
          loading={isLoading}
          autoFocus
          color="error"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
