import React from "react";
import { Bell } from "lucide-react";

interface Props {
  name?: string;
  id?: string;
  showWelcome?: boolean;
  avatar?: string;
}

const Header: React.FC<Props> = ({ name = "Ashwitha", id, showWelcome = false, avatar }) => {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-black px-6 py-6 rounded-b-3xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
              alt="Profile"
            />
          ) : (
            <img
              src="https://i.pravatar.cc/100"
              className="w-12 h-12 rounded-full border-2 border-white/20"
              alt="Profile"
            />
          )}
          <div>
            {showWelcome && <p className="text-white/70 text-sm">Welcome back,</p>}
            <p className="text-white text-lg font-semibold">{name}</p>
            {id && <p className="text-white/50 text-xs mt-1">ID: {id}</p>}
          </div>
        </div>
        <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
          <Bell className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Header;
