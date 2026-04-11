export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
}

export interface Vehicle {
  id: string;
  userId: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: 'car' | 'bike' | 'truck' | 'suv';
}

export interface Service {
  id: string;
  serviceName: string;
  price: number;
  description: string;
  duration: string;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  createdAt: string;
}
