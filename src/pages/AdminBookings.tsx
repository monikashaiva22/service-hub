import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings, getServices, getVehicles, getUsers, updateBooking } from '@/lib/store';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Clock } from 'lucide-react';
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

const AdminBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(getBookings);
  const services = getServices();
  const vehicles = getVehicles();
  const users = getUsers();
  const [filter, setFilter] = useState('all');

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const changeStatus = (id: string, status: string) => {
    const b = bookings.find(x => x.id === id);
    if (!b) return;
    const updated = { ...b, status: status as any };
    updateBooking(updated);
    setBookings(getBookings());
    toast.success(`Booking ${status.replace('_', ' ')}`);
  };

  const getName = (id: string) => services.find(s => s.id === id)?.serviceName || 'Unknown';
  const getVehicle = (id: string) => { const v = vehicles.find(v => v.id === id); return v ? `${v.vehicleName} (${v.vehicleNumber})` : 'Unknown'; };
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">All Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage customer bookings</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent><p className="text-muted-foreground">No bookings found</p></CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
              <Card key={b.id} className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-bold text-lg">{getName(b.serviceId)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${statusColors[b.status]}`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {getUserName(b.userId)}</p>
                      <p className="text-sm text-muted-foreground">Vehicle: {getVehicle(b.vehicleId)}</p>
                      <p className="text-sm text-muted-foreground">Date: {b.date} | Time: {b.time}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {b.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => changeStatus(b.id, 'approved')}>
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => changeStatus(b.id, 'rejected')}>
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {b.status === 'approved' && (
                        <Button size="sm" variant="secondary" onClick={() => changeStatus(b.id, 'in_progress')}>
                          <Clock className="w-4 h-4 mr-1" /> Start Work
                        </Button>
                      )}
                      {b.status === 'in_progress' && (
                        <Button size="sm" onClick={() => changeStatus(b.id, 'completed')}>
                          <Check className="w-4 h-4 mr-1" /> Complete
                        </Button>
                      )}
                    </div>
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

export default AdminBookings;
