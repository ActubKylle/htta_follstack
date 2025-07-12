import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

const Programs: React.FC = () => {
    return (
        <PublicLayout>
            <Head title="Our Programs" />
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-htta-blue mb-4">Our Programs Page</h2>
                <p className="text-gray-700">Details about our training programs will go here.</p>
            </div>
        </PublicLayout>
    );
};

export default Programs;