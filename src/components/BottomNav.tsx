import { Home, Folder, Briefcase, Clock, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-400" : "text-gray-500";

  return (
    <div className="bottom-nav">
      
      <button onClick={() => navigate("/")} className={`flex flex-col items-center ${isActive("/")}`}>
        <Home size={20} />
        <span className="text-xs">Dashboard</span>
      </button>

      <button onClick={() => navigate("/vault")} className={`flex flex-col items-center ${isActive("/vault")}`}>
        <Folder size={20} />
        <span className="text-xs">Vault</span>
      </button>

      <button onClick={() => navigate("/portfolio")} className={`flex flex-col items-center ${isActive("/portfolio")}`}>
        <Briefcase size={20} />
        <span className="text-xs">Portfolio</span>
      </button>

      <button onClick={() => navigate("/activity")} className={`flex flex-col items-center ${isActive("/activity")}`}>
        <Clock size={20} />
        <span className="text-xs">Activity</span>
      </button>

      <button onClick={() => navigate("/profile")} className={`flex flex-col items-center ${isActive("/profile")}`}>
        <User size={20} />
        <span className="text-xs">Profile</span>
      </button>

    </div>
  );
};

export default BottomNav;