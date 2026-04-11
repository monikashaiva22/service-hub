import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Car, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Car className="w-6 h-6" />
          AutoCare Pro
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button>Register</Button></Link>
            </>
          )}
          {user && user.role === 'user' && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/vehicles" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Vehicles</Link>
              <Link to="/book" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Book Service</Link>
              <Link to="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Bookings</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/admin/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Bookings</Link>
              <Link to="/admin/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {!user && (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-sm">Register</Link>
            </>
          )}
          {user && user.role === 'user' && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block py-2 text-sm">Dashboard</Link>
              <Link to="/vehicles" onClick={() => setOpen(false)} className="block py-2 text-sm">Vehicles</Link>
              <Link to="/book" onClick={() => setOpen(false)} className="block py-2 text-sm">Book Service</Link>
              <Link to="/bookings" onClick={() => setOpen(false)} className="block py-2 text-sm">My Bookings</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm">Dashboard</Link>
              <Link to="/admin/bookings" onClick={() => setOpen(false)} className="block py-2 text-sm">Bookings</Link>
              <Link to="/admin/services" onClick={() => setOpen(false)} className="block py-2 text-sm">Services</Link>
            </>
          )}
          {user && (
            <button onClick={() => { handleLogout(); setOpen(false); }} className="block py-2 text-sm text-destructive">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
