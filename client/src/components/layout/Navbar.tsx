import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { FaFutbol, FaBell, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Discover", path: "/discover" },
    { name: "Trials", path: "/trials" },
    { name: "Messages", path: "/messages" },
    { name: "Analytics", path: "/analytics" }
  ];

  const getInitials = () => {
    if (!user?.firstName || !user?.lastName) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FaFutbol className="text-primary text-xl mr-2" />
              <span className="font-bold text-xl text-gray-800">Scout<span className="text-primary">Pro</span></span>
            </div>
            {isAuthenticated && (
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location === item.path
                          ? "text-white bg-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="relative mr-4">
                <Button variant="ghost" size="icon" className="relative">
                  <FaBell className="h-5 w-5 text-gray-500" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white">3</Badge>
                </Button>
              </div>

              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <FaUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center cursor-pointer">
                        <FaCog className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="md:hidden ml-2">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                            <AvatarFallback>{getInitials()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-4 flex-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium mb-1 ${
                              location === item.path
                                ? "text-white bg-primary"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      <div className="p-4 border-t">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-500" 
                          onClick={() => logout()}
                        >
                          <FaSignOutAlt className="mr-2 h-4 w-4" /> Sign out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
