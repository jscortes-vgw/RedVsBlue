import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './styles.css'

interface SnackProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  text: string
}

export const SnackbarMain = ({open, setOpen, text}: SnackProps) => {

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center',}}
        className='snackbar'
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={text}
        action={action}
      />
    </div>
  );
}
