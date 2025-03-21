import React, { useEffect, useState } from 'react';
import { Fab, Menu, MenuItem, Button, createStyles, makeStyles, keyframes } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { getBattlegrounds } from '../../services';
import './styles.css'
import logo from './../../assets/logo.png'

interface Props {
    isBgOpen: boolean
    setIsResultModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FloatingButtonWithMenu: React.FC<Props> = ({setIsResultModalOpen, isBgOpen}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [battlegroundsData, setBattlegroundsData] = useState<Promise<any>[]>([])

  useEffect(() => {
    (async () => {
        try {
            const data = await getBattlegrounds()
            setBattlegroundsData(data)
        } catch (err) {
            console.log(err)
        }
    })();
  }, [])

  // Vibrant pulse animation
  const pulse = keyframes`
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 20px 20px rgba(255, 105, 180, 0.3);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
    }
  `;

  // Open menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleOpenResultModal() {
    setIsResultModalOpen(true);
  }

  function handleCloseResultModal() {
    setIsResultModalOpen(false);
  }

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
          background: 'orange'          
        }}
        sx={{
            animation: `${pulse} 1.5s infinite`, // Apply the pulse animation
            '&:hover': {
            bgcolor: green,
        },}}
      >
        {/* <AddIcon /> */}
        <img style={{width: '30px'}} src={logo} />
      </Fab>

      {/* Expanding Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} sx={{}}>
            <Button variant="contained" color="primary" onClick={handleOpenResultModal}>
                {isBgOpen ? 'Join live event' : 'See Team Progress'}
            </Button>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FloatingButtonWithMenu;
