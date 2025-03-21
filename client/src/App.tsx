import React, { useEffect, useState } from "react";
import FloatingButtonWithMenu from "./pages/floating";

import { MyTeamModal } from "./pages/modals/my-team-modal";
import { SelectTeamModal } from "./pages/modals/select-team-modal";
import { Battleground } from "./pages/modals/bg-types";
import {SnackbarMain} from "./pages/snack";

export const App: React.FC = () => {
  const [playerTeam, setPlayerTeam] = useState("Red");
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isTeamSelectionModalOpen, setIsTeamSelectionModalOpen] = useState<boolean>(false);
  const [isBgOpen, setIsBgOpen] = useState<boolean>(true);
  const [battlegroundsData, setBattlegroundsData] = useState<Battleground[]>([])
  const [openSnack, setOpenSnack] = React.useState(false);
  const [textSnack, setTextSnack] = React.useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextSnack("A battleground event is happening now..")
      setOpenSnack(true)
      clearTimeout(timeout)
    }, 4000)
  }, [])

  return (
    <div>
      <SnackbarMain open={openSnack} setOpen={setOpenSnack} text={textSnack}></SnackbarMain>
      <FloatingButtonWithMenu 
        setIsResultModalOpen={isBgOpen ? setIsTeamSelectionModalOpen : setIsResultModalOpen}
        isBgOpen={isBgOpen}
        />
      <SelectTeamModal 
        open={isTeamSelectionModalOpen}
        isBgOpen={isBgOpen}
        setIsBgOpen={setIsBgOpen}
        handleClose={() => setIsTeamSelectionModalOpen(false)}
        setSnackOpen={setOpenSnack}
        setSnackText={setTextSnack}
      />
      <MyTeamModal
        open={isResultModalOpen}
        handleClose={() => setIsResultModalOpen(false)}
        currentTeam={playerTeam}
        setSnackOpen={setOpenSnack}
        setSnackText={setTextSnack}
      />
    </div>
  );
};
