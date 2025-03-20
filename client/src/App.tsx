import React, { useState } from "react";
import FloatingButtonWithMenu from "./pages/floating";

import { MyTeamModal } from "./pages/modals/my-team-modal";
import { SelectTeamModal } from "./pages/modals/select-team-modal";
import { Battleground } from "./pages/modals/bg-types";

export const App: React.FC = () => {
  const [playerTeam, setPlayerTeam] = useState("Red");
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isTeamSelectionModalOpen, setIsTeamSelectionModalOpen] = useState<boolean>(false);
  const [isBgOpen, setIsBgOpen] = useState<boolean>(true);
  const [battlegroundsData, setBattlegroundsData] = useState<Battleground[]>([])

  return (
    <div>
      <FloatingButtonWithMenu 
        setIsResultModalOpen={isBgOpen ? setIsTeamSelectionModalOpen : setIsResultModalOpen}
        isBgOpen={isBgOpen}
        />
      <MyTeamModal
        open={isResultModalOpen}
        handleClose={() => setIsResultModalOpen(false)}
        currentTeam={playerTeam}
      />
      <SelectTeamModal 
        open={isTeamSelectionModalOpen}
        isBgOpen={isBgOpen}
        setIsBgOpen={setIsBgOpen}
        handleClose={() => setIsTeamSelectionModalOpen(false)}
      />
    </div>
  );
};
