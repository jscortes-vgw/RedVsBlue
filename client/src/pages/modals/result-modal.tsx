import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

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

export const ResultModal = ({
  open,
  handleClose,
  currentTeam,
}: ResultModalProps) => {
  const [playerSpendingDetails, setPlayerSpendingDetails] = useState<
    { name: string; spending: number }[]
  >([]);

  const [teamPercentage, setTeamPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchPlayersSpendingDataResult = async (currentTeam: string) => {
      const data = mockPlayersSpendingData
        .filter((data) => data.team === currentTeam)
        .sort((a, b) => b.spending - a.spending);

      setPlayerSpendingDetails(data);

      let totalSpending = 0;
      let teamSpending = 0;
      mockPlayersSpendingData.forEach((player) => {
        totalSpending += player.spending;

        if (player.team === currentTeam) {
          console.log("???");
          teamSpending += player.spending;
        }
      });

      setTeamPercentage((teamSpending / totalSpending) * 100);
    };

    fetchPlayersSpendingDataResult(currentTeam);
  }, [currentTeam]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={boxStyle}>
        <Typography variant='h6' component='h2'>
          Red VS Blue
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
                <span>{details.name}</span> - <span>{details.spending}</span>
              </Typography>
            </li>
          ))}
        </ol>
      </Box>
    </Modal>
  );
};

const mockPlayersSpendingData = [
  {
    name: "A",
    team: "Red",
    spending: 150,
  },
  {
    name: "B",
    team: "Red",
    spending: 100,
  },
  {
    name: "C",
    team: "Red",
    spending: 80,
  },
  {
    name: "D",
    team: "Red",
    spending: 50,
  },
  {
    name: "E",
    team: "Red",
    spending: 10,
  },
  {
    name: "A2",
    team: "Blue",
    spending: 150,
  },
  {
    name: "B2",
    team: "Blue",
    spending: 200,
  },
  {
    name: "C2",
    team: "Blue",
    spending: 80,
  },
  {
    name: "D2",
    team: "Blue",
    spending: 50,
  },
  {
    name: "E2",
    team: "Blue",
    spending: 10,
  },
];
