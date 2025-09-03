import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Doctor } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {doctor.photo_url ? (
              <img
                src={doctor.photo_url}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-blue-600 font-medium mb-3">
              {doctor.specialization}
            </p>
            
            <Button
              onClick={() => onBookAppointment(doctor)}
              className="w-full sm:w-auto"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};