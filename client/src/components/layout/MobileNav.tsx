import { Link, useLocation } from "wouter";
import { FaHome, FaSearch, FaVideo, FaCommentAlt, FaUser } from "react-icons/fa";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: FaHome },
    { name: "Discover", path: "/discover", icon: FaSearch },
    { name: "Highlights", path: "/videos", icon: FaVideo },
    { name: "Messages", path: "/messages", icon: FaCommentAlt },
    { name: "Profile", path: "/profile", icon: FaUser },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-10 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center py-2 px-3 ${
              isActive ? "text-primary" : "text-gray-500"
            }`}
          >
            <Icon />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
