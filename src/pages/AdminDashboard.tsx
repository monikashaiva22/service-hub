import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings, getUsers, getServices } from '@/lib/store';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Users, Wrench, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const bookings = getBookings();
  const users = getUsers().filter(u => u.role === 'user');
  const services = getServices();
  const revenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      const svc = services.find(s => s.id === b.serviceId);
      return sum + (svc?.price || 0);
    }, 0);

  const stats = [
    { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'text-primary' },
    { icon: Users, label: 'Registered Users', value: users.length, color: 'text-success' },
    { icon: Wrench, label: 'Services', value: services.length, color: 'text-accent-foreground' },
    { icon: DollarSign, label: 'Revenue', value: `$${revenue.toFixed(2)}`, color: 'text-warning' },
  ];

  const statusCounts = {
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your service center</p>
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

        <Card className="glass-card">
          <CardHeader><CardTitle className="font-heading">Booking Status Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
