export interface User {
  id: string;
  name: string;
  email: string;
  role: 'DOCTOR' | 'PATIENT';
  photo_url?: string;
  specialization?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  photo_url?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  doctor?: Doctor;
  patient?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'DOCTOR' | 'PATIENT';
}

export interface RegisterPatientRequest {
  name: string;
  email: string;
  password: string;
  photo_url?: string;
}

export interface RegisterDoctorRequest {
  name: string;
  email: string;
  password: string;
  specialization: string;
  photo_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}