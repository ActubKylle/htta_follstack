import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

const Contact: React.FC = () => {
    return (
        <PublicLayout>
            <Head title="Contact Us" />
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-htta-blue mb-4">Contact Us Page</h2>
                <p className="text-gray-700">How to reach us: contact information and form.</p>
            </div>
        </PublicLayout>
    );
};

export default Contact;