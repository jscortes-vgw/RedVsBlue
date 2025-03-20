import React, { useState } from 'react';
import { Fab, Menu, MenuItem, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { green } from '@mui/material/colors';

const FloatingButtonWithMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Open menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClick}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        sx={{'&:hover': {
            bgcolor: green,
        },}}
      >
        <AddIcon />
      </Fab>

      {/* Expanding Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Button variant="contained" color="primary">Join live event</Button>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FloatingButtonWithMenu;
