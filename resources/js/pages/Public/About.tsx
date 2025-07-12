import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

const About: React.FC = () => {
    return (
        <PublicLayout>
            <Head title="About Us" />
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-htta-blue mb-4">About Us Page</h2>
                <p className="text-gray-700">This is the About Us page content.</p>
            </div>
        </PublicLayout>
    );
};

export default About;