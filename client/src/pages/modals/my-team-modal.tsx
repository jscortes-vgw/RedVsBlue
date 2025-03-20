import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Battleground, UsersEntity } from "./bg-types";
import { getBattlegrounds, playRound } from "../../services";

interface ResultModalProps {
  open: boolean;
  currentTeam: string;
  handleClose: () => void;
}

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
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
  currentTeam,
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

    
  // }, [battlegroundsData]);
}, [battlegroundsData]);


  
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
      <Box sx={boxStyle}>
        {teamHasWin == false ?
        <>
          <Typography variant='h6' component='h2'>
            Red VS Blue
          </Typography>
          <Typography variant='h6' component='h2'>
            100.000 Goal!
          </Typography>
          <BorderLinearProgress
            sx={{ margin: 1 }}
            variant='determinate'
            value={teamPercentage}
          />
          <ol>
            {playerSpendingDetails.map((details, index) => (
              <li key={index}>
                <Typography sx={{ mt: 2 }}>
                  <span>{`User # ${details.id}`}</span> - <span>{details.spend}</span>&nbsp;&nbsp;
                  <Button disabled={teamHasWin} variant="contained" color="success" onClick={() => playRoundForPlayer(details.id, index)}>Play round</Button>
                </Typography>
              </li>
              
            ))}
          </ol>
        </>
         : <Typography variant='h6' component='h2'>
         Red team Wins! 5000 SC divided in # of members
       </Typography>}
        
        
        

      </Box>
    </Modal>
  );
};
