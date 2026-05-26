import React, { useContext } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { UserContext } from "../../contexts/UserContext";
import { useMediatorState } from "../../hooks/useMediatorState";

export const SettingsButton: React.FC = () => {
  const userContext = useContext(UserContext);
  const [, setIsOpen] = useMediatorState(userContext.isSettingsModalOpen);

  return (
    <button
      className="header-button header-action-button language-toggle"
      onClick={() => setIsOpen(true)}
      title="Settings"
      aria-label="Open settings"
    >
      <SettingsIcon size={20} className="icon" />
    </button>
  );
};
