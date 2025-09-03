import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentsApi } from '@/lib/api';
import { appointmentSchema, AppointmentFormData } from '@/lib/validations';
import { Doctor } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctor,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const bookMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    if (!doctor) return;
    
    bookMutation.mutate({
      doctorId: doctor.id,
      date: data.date,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!doctor) return null;

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Book Appointment"
      className="max-w-lg"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          {doctor.photo_url ? (
            <img
              src={doctor.photo_url}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {doctor.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">Dr. {doctor.name}</h4>
            <p className="text-sm text-blue-600">{doctor.specialization}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="hidden"
            value={doctor.id}
            {...register('doctorId')}
          />

          <Input
            label="Appointment Date"
            type="date"
            min={minDate}
            {...register('date')}
            error={errors.date?.message}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={bookMutation.isPending}
              className="flex-1"
            >
              Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};