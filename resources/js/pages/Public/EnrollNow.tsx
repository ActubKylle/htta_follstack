import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout'; // Adjust path if your PublicLayout is elsewhere
import RegistrationForm from './RegistrationForms'; // Import the RegistrationForm component

const EnrollNow: React.FC = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-htta-blue text-center mb-8">Enroll Now!</h1>
                <p className="text-lg text-gray-700 text-center mb-10">
                    Fill out the form below to register for our programs.
                </p>
                <RegistrationForm />
            </div>
        </PublicLayout>
    );
};

export default EnrollNow;
