'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Filter } from 'lucide-react';
import { appointmentsApi } from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { AppointmentCard } from '@/components/patient/AppointmentCard';
import { Button } from '@/components/ui/Button';

export default function PatientAppointments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['patient-appointments', page, status],
    queryFn: () => appointmentsApi.getPatientAppointments({
      page,
      status: status || undefined,
    }).then(res => res.data),
  });

  const clearFilters = () => {
    setStatus('');
    setPage(1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600">Manage your scheduled appointments</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filter Appointments</h2>
            {status && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => setStatus('')}
              className={`p-3 rounded-lg border-2 transition-all ${
                status === '' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium">All</div>
              </div>
            </button>
            
            <button
              onClick={() => setStatus('PENDING')}
              className={`p-3 rounded-lg border-2 transition-all ${
                status === 'PENDING' 
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium">Pending</div>
              </div>
            </button>
            
            <button
              onClick={() => setStatus('COMPLETED')}
              className={`p-3 rounded-lg border-2 transition-all ${
                status === 'COMPLETED' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium">Completed</div>
              </div>
            </button>
            
            <button
              onClick={() => setStatus('CANCELLED')}
              className={`p-3 rounded-lg border-2 transition-all ${
                status === 'CANCELLED' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium">Cancelled</div>
              </div>
            </button>
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {appointmentsData?.data.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {appointmentsData?.data.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500">
                  {status ? 'Try adjusting your filters' : 'You have no appointments yet'}
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
    </Layout>
  );
}