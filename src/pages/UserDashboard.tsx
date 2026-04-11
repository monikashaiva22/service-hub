import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserVehicles, getUserBookings, getServices } from '@/lib/store';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, CalendarCheck, Clock, Wrench } from 'lucide-react';
import Navbar from '@/components/Navbar';

const UserDashboard = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'user') return <Navigate to="/login" />;

  const vehicles = getUserVehicles(user.id);
  const bookings = getUserBookings(user.id);
  const services = getServices();
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const activeBookings = bookings.filter(b => b.status === 'in_progress').length;

  const stats = [
    { icon: Car, label: 'My Vehicles', value: vehicles.length, color: 'text-primary' },
    { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'text-success' },
    { icon: Clock, label: 'Pending', value: pendingBookings, color: 'text-warning' },
    { icon: Wrench, label: 'In Progress', value: activeBookings, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground mt-1">Manage your vehicles and service bookings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <Card key={s.label} className="glass-card">
              <CardContent className="pt-6 text-center">
                <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-bold font-heading">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/book"><Button className="w-full">Book a Service</Button></Link>
              <Link to="/vehicles"><Button variant="outline" className="w-full">Manage Vehicles</Button></Link>
              <Link to="/bookings"><Button variant="secondary" className="w-full">View Booking History</Button></Link>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading">Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.slice(0, 4).map(s => (
                  <div key={s.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{s.serviceName}</span>
                    <span className="text-sm font-bold text-primary">${s.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
