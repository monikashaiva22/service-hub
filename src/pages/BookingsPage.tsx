import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, getServices, getVehicles, cancelBooking } from '@/lib/store';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  approved: 'bg-primary/20 text-primary border-primary/30',
  in_progress: 'bg-accent/20 text-accent-foreground border-accent/30',
  completed: 'bg-success/20 text-success border-success/30',
  rejected: 'bg-destructive/20 text-destructive border-destructive/30',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(() => user ? getUserBookings(user.id) : []);
  const services = getServices();
  const vehicles = getVehicles();

  if (!user || user.role !== 'user') return <Navigate to="/login" />;

  const handleCancel = (id: string) => {
    cancelBooking(id);
    setBookings(getUserBookings(user.id));
    toast.success('Booking cancelled');
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.serviceName || 'Unknown';
  const getVehicleName = (id: string) => {
    const v = vehicles.find(v => v.id === id);
    return v ? `${v.vehicleName} (${v.vehicleNumber})` : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage your service bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <CalendarCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bookings yet. Book your first service!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
              <Card key={b.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-bold text-lg">{getServiceName(b.serviceId)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${statusColors[b.status]}`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Vehicle: {getVehicleName(b.vehicleId)}</p>
                      <p className="text-sm text-muted-foreground">Date: {b.date} | Time: {b.time}</p>
                    </div>
                    {(b.status === 'pending' || b.status === 'approved') && (
                      <Button variant="destructive" size="sm" onClick={() => handleCancel(b.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
