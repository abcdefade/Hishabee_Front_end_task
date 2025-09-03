import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Filter, User, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointmentsApi } from '@/lib/api';
import { Appointment } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const AppointmentManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const queryClient = useQueryClient();

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['doctor-appointments', page, status, date],
    queryFn: () => appointmentsApi.getDoctorAppointments({
      page,
      status: status || undefined,
      date: date || undefined,
    }).then(res => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ appointmentId, newStatus }: { appointmentId: string; newStatus: 'COMPLETED' | 'CANCELLED' }) =>
      appointmentsApi.updateStatus({
        appointment_id: appointmentId,
        status: newStatus,
      }),
    onSuccess: () => {
      toast.success('Appointment status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update appointment status');
    },
  });

  const handleStatusUpdate = (appointmentId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    const action = newStatus === 'COMPLETED' ? 'mark as completed' : 'cancel';
    if (window.confirm(`Are you sure you want to ${action} this appointment?`)) {
      updateStatusMutation.mutate({ appointmentId, newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setStatus('');
    setDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            {(status || date) && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {appointmentsData?.data.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {appointment.patient?.photo_url ? (
                          <img
                            src={appointment.patient.photo_url}
                            alt={appointment.patient.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patient?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {appointment.patient?.email}
                        </p>
                        
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(appointment.date)}</span>
                        </div>
                        
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    {appointment.status === 'PENDING' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                          loading={updateStatusMutation.isPending}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                          loading={updateStatusMutation.isPending}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {appointmentsData?.data.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {status || date ? 'Try adjusting your filters' : 'You have no appointments yet'}
              </p>
            </div>
          )}

          {appointmentsData && appointmentsData.pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Page {page} of {appointmentsData.pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === appointmentsData.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};