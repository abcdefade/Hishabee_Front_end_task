import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DOCTOR', 'PATIENT'], {
    required_error: 'Please select a role',
  }),
});

export const patientRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  photo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const doctorRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specialization: z.string().min(1, 'Please select a specialization'),
  photo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Please select a date'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PatientRegisterFormData = z.infer<typeof patientRegisterSchema>;
export type DoctorRegisterFormData = z.infer<typeof doctorRegisterSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;