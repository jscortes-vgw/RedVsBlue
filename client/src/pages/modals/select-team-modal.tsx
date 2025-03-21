import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { addBattleground, addNewPlayer, getBattlegrounds } from '../../services';
import { Battleground, UsersEntity } from './bg-types';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import './styles.css'
import logo from './../../assets/logo.png'

interface ResultModalProps {
    open: boolean;
    isBgOpen: boolean
    handleClose: () => void;
    setIsBgOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSnackText: React.Dispatch<React.SetStateAction<string>>
  }

export const SelectTeamModal = ({
    open,
    handleClose,
    isBgOpen,
    setIsBgOpen,
    setSnackOpen,
    setSnackText
  }: ResultModalProps) => {

  const [battlegroundsData, setBattlegroundsData] = useState<Battleground[]>([])
  const [redTeam, setRedTeam] = useState<UsersEntity[]>([])
  const [blueTeam, setBlueTeam] = useState<UsersEntity[]>([])

  useEffect(()=>{
    if(isBgOpen == false){
        setSnackOpen(true)
        setSnackText("Team selection is finished! You are RED team")
    }
  }, [isBgOpen])

  useEffect(() => {
      (async () => {
          try {
            const data = await getBattlegrounds()
            setBattlegroundsData(data)
            if (data.length > 0){
                // const currentBg: Battleground = data[0]
                let currentBg: Battleground
                data.forEach((bg: Battleground) => {
                    if(bg.latest == true) currentBg = bg
                })
                const {id, red, blue, isOpen} = currentBg!
                setRedTeam(red.users!.length > 0 ? red.users! : [])
                setBlueTeam(blue.users!.length > 0 ? blue.users! : [])
                setIsBgOpen(isOpen)
            }else{
                const data = await addBattleground()
                setBattlegroundsData(data)
                setIsBgOpen(true)
            }
          } catch (err) {
              console.log(err)
          }
      })();
    }, [battlegroundsData])
// }, [])

  const mapRed = () => {
    if (redTeam.length > 0){
        let i = 0
        let ele = []
        while(i < 5){
            if(redTeam[i]){
                ele.push(`${i+1}. User # ${redTeam[i].id}`)
            }else{
                ele.push(`${i+1}. Vacant`)
            }
            i++
        }
        return ele.map((value) =>
            <ListItem>
                <ListItemText sx={value.includes('Vacant') ? {color:'gray'} : {color:'white'}}
                primary={`${value}`}
                />
            </ListItem>
        );
    }else{
        return [0, 1, 2, 4, 5].map((value, i) =>
            <ListItem >
                <ListItemText sx={{color:'gray'}}
                primary={`${i+1} Vacant`}
                />
            </ListItem>
          );
    } 
  }


  const mapBlue = () => {
    if (blueTeam.length > 0){
        let i = 0
        let ele = []
        while(i < 5){
            if(blueTeam[i]){
                ele.push(`${i+1}. User # ${blueTeam[i].id}`)
            }else{
                ele.push(`${i+1}. Vacant`)
            }
            i++
        }
        return ele.map((value) =>
            <ListItem>
                <ListItemText sx={value.includes('Vacant') ? {color:'gray'} : {color:'white'}}
                primary={`${value}`}
                />
            </ListItem>
        );
    }else{
        return [0, 1, 2, 4, 5].map((value, i) =>
            <ListItem >
                <ListItemText sx={{color:'gray'}}
                primary={`${i+1}. Vacant`}
                />
            </ListItem>
          );
    } 
  }
  
  const joinRedTeam = async () => {
    try {
        const data: Battleground[] = await getBattlegrounds()
        setBattlegroundsData(data)
        if (data.length > 0){
            let currentBg: Battleground
            data.forEach((bg) => {
                if(bg.latest == true) currentBg = bg
            })
            // const currentBg: Battleground = data[0]
            const {red} = currentBg!
            if(red){
                const id = Math.floor(Math.random() * 10000)
                const bg = await addNewPlayer('red', id)
                setBattlegroundsData(bg)
            }
        }
      } catch (err) {
          console.log(err)
      }
  }
  
  const joinBlueTeam = async () => {
    try {
        const data = await getBattlegrounds()
        setBattlegroundsData(data)
        if (data.length > 0){
            let currentBg: Battleground
            data.forEach((bg: Battleground) => {
                if(bg.latest == true) currentBg = bg
            })
            // const currentBg: Battleground = data[0]
            const {blue} = currentBg!
            if(blue){
                const id = Math.floor(Math.random() * 10000)
                const bg = await addNewPlayer('blue', id)
                setBattlegroundsData(bg)
            }
        }
      } catch (err) {
          console.log(err)
      }
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Grid container spacing={2} className='main-container' sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: '#3A393C',
            color: 'white',
            borderRadius: 2,
            boxShadow: 24,
            padding: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <Grid size={10} sx={{textAlign: 'center'}}>
            <img src={logo} className='logo'/>
        </Grid>
        <Grid size={10} className={'redvsblue-container'}>
            <Stack direction="row" spacing={1}>
                <Typography variant='h6' component='h2' className='red-text'> Red</Typography>
                <Typography variant='h6' component='h2' className='vs-text'> VS</Typography>
                <Typography variant='h6' component='h2' className='blue-text'color='info'> Blue</Typography>
            </Stack>
        </Grid>
        <Grid size={10} sx={{justifyItems: 'center'}}>
            <Stack direction="row" spacing={2}>
                <Typography variant='h6' component='h2' className='battleground-text'> Battlegrounds</Typography>
            </Stack>
            <Typography variant='body1'>Choose your side</Typography>
        </Grid>
        <Grid size={10}><Divider orientation='horizontal' sx={{backgroundColor: 'white'}}/></Grid>
        <Grid size={5}>
            <Typography variant='h6' component='h2' className='red-text'> Red Team</Typography>
        </Grid>
        <Grid size={5}>
            <Typography variant='h6' component='h2' className='blue-text'> Blue Team</Typography>
        </Grid>
        <Grid size={5} className='list-container'>
            <div className='back-list-container'>
                <List dense={false} >
                    {mapRed()}
                </List>
            </div>
        </Grid>
        <Grid size={5} className='list-container'>
            <List dense={false}>
                {mapBlue()}
            </List>
        </Grid>
        <Grid size={5} sx={{textAlign: 'center'}}>
            <Button disabled={!isBgOpen} variant="contained" onClick={() => joinRedTeam()}>Join Team</Button>
        </Grid>
        <Grid size={5} sx={{textAlign: 'center'}}>
            <Button disabled={!isBgOpen} variant="contained" onClick={() => joinBlueTeam()}>Join Team</Button>
        </Grid>
    </Grid>
        
       
      </Modal>
    </div>
  );
};

