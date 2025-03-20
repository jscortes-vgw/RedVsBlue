import React from "react";
import FloatingButtonWithMenu from "./pages/floating";

import { Button } from "@mui/material";
import { ResultModal } from "./pages/modals/result-modal";

export const App: React.FC = () => {
  const [playerTeam, setPlayerTeam] = useState("Blue");
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  return (
    <div>
      <FloatingButtonWithMenu />
      <Button onClick={handleOpenResultModal}>Icon</Button>
      <ResultModal
        open={isResultModalOpen}
        handleClose={handleCloseResultModal}
        currentTeam={playerTeam}
      />
    </div>
  );

  function handleOpenResultModal() {
    setIsResultModalOpen(true);
  }

  function handleCloseResultModal() {
    setIsResultModalOpen(false);
  }
};
