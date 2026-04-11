import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserVehicles, getServices, addBooking } from '@/lib/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarCheck, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookServicePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  if (!user || user.role !== 'user') return <Navigate to="/login" />;

  const vehicles = getUserVehicles(user.id);
  const services = getServices();
  const selectedService = services.find(s => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !serviceId || !date || !time) { toast.error('Please fill all fields'); return; }
    const today = new Date().toISOString().split('T')[0];
    if (date < today) { toast.error('Cannot book for a past date'); return; }

    addBooking({
      id: 'b_' + Date.now(),
      userId: user.id,
      vehicleId,
      serviceId,
      date,
      time,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    toast.success('Booking submitted! Waiting for admin approval.');
    navigate('/bookings');
  };

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">No Vehicles Found</h2>
          <p className="text-muted-foreground mb-4">Please add a vehicle before booking a service.</p>
          <Button onClick={() => navigate('/vehicles')}>Add Vehicle</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold">Book a Service</h1>
          <p className="text-muted-foreground mt-1">Schedule your vehicle for maintenance</p>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Select Vehicle</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
                  <SelectTrigger><SelectValue placeholder="Choose your vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.vehicleName} ({v.vehicleNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Service</Label>
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger><SelectValue placeholder="Choose a service" /></SelectTrigger>
                  <SelectContent>
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.serviceName} - ${s.price}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <Card className="bg-muted">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Duration: {selectedService.duration}</span>
                      <span className="font-bold text-primary">${selectedService.price}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <CalendarCheck className="w-4 h-4 mr-2" /> Confirm Booking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookServicePage;
