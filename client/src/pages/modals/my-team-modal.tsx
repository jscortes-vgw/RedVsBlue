import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Battleground, UsersEntity } from "./bg-types";
import { getBattlegrounds, playRound } from "../../services";
import logo from './../../assets/logo.png'

interface ResultModalProps {
  open: boolean;
  currentTeam: string;
  handleClose: () => void;
  setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSnackText: React.Dispatch<React.SetStateAction<string>>
}

const boxStyle = {
  textAlign: "center",
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
  justifyContent: 'center',
  alignItems: 'center',
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

export const MyTeamModal = ({
  open,
  handleClose,
  setSnackOpen,
  setSnackText
}: ResultModalProps) => {
  const [playerSpendingDetails, setPlayerSpendingDetails] = useState<
    { id: number; spend: number }[]
  >([]);

  const [teamPercentage, setTeamPercentage] = useState<number>(0);
  const [battlegroundsData, setBattlegroundsData] = useState<Battleground[]>([])
  const [redTeam, setRedTeam] = useState<UsersEntity[]>([])
  const [currentGoal, setCurrentGoal] = useState<number>(0)
  const [teamHasWin, setTeamHasWin] = useState<boolean>(false)
  const totalSpending = 100000

  useEffect(()=>{
      if(teamHasWin == true){
        setSnackText("Event has finished..")
        setSnackOpen(true)
      }
    }, [teamHasWin])

  useEffect(() => {
    (async () => {
        try {
          const data = await getBattlegrounds()
          setBattlegroundsData(data)
          if (data.length > 0){
              let currentBg: Battleground
              data.forEach((bg: Battleground) => {
                  if(bg.latest == true) currentBg = bg
              })
              const {red} = currentBg!
              setRedTeam(red.users!.length > 0 ? red.users! : [])

              //Red team stats
              let teamSpending = 0;
              red.users?.forEach((user) => {
                teamSpending += user.spend;
              })
              setTeamPercentage((teamSpending / totalSpending) * 100);
              setPlayerSpendingDetails(red.users!);
              setCurrentGoal(teamSpending)
          }
        } catch (err) {
            console.log(err)
        }
    })();

    
  }, [battlegroundsData]);
// }, []);


  
  const playRoundForPlayer = async (userId: number, index: number) => {
    const data = await getBattlegrounds()
    setBattlegroundsData(data)
    if(data.length > 0){
      let currentBg: Battleground
      data.forEach((bg: Battleground) => {
        if(bg.latest == true) currentBg = bg  
      })
      const spend = Math.floor(Math.random() * 100) + currentBg!.red.users![index].spend
      const res = await playRound(userId, spend)
      setBattlegroundsData(res)

      //Red team stats
      const {red} = res
      let teamSpending = 0
      red.users?.forEach((user: { spend: number; }) => {
        teamSpending += user.spend;
      })
      setTeamPercentage((teamSpending / totalSpending) * 100);
      setPlayerSpendingDetails(red.users!);
      setCurrentGoal(teamSpending)
      if(teamSpending > totalSpending){
        setTeamHasWin(true)
        setCurrentGoal(totalSpending)
      }
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={boxStyle} className='main-container'>
        {teamHasWin == false ?
        <>
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
          <Typography variant='h6' component='h2' className="coins-spend">
            100.000 GC
          </Typography>
          <BorderLinearProgress
            color="info"
            sx={{ margin: 1, backgroundColor: '#7d6c4e' }}
            variant='determinate'
            value={teamPercentage}
          />
          <ol>
            {playerSpendingDetails.map((details, index) => (
              <li key={index} className="my-team-list-item">
                <Typography sx={{ mt: 2 }}>
                  <span className="user-spend">{`User # ${details.id}`}</span> - <span className="coins-spend">{details.spend}</span>&nbsp;&nbsp;
                  <Button disabled={teamHasWin} variant="contained" color="success" onClick={() => playRoundForPlayer(details.id, index)}>Play round</Button>
                </Typography>
              </li>
            ))}
          </ol>
        </>
         : <Typography variant='h6' component='h2'>
         <span style={{color: 'red'}}>Red</span> team Wins! 5000 <span style={{color: '#17ee17'}}>SC</span> reward
       </Typography>}
        
        
        

      </Box>
    </Modal>
  );
};
