import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import RegistrationForm from '@/Components/RegistrationForm'; // Corrected casing
import PublicLayout from '@/Layouts/PublicLayout'; // Corrected casing
import { PageProps } from '@/types';


const Home: React.FC = () => {
    const { flash = {}, errors } = usePage<PageProps>().props;
    const [showEnrollmentForm, setShowEnrollmentForm] = useState<boolean>(false);

    return (
        <PublicLayout>
            <Head title="Highlands Technical Training Academy, Inc. - Home" />

            {/* Flash Messages */}
            {flash.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 shadow-md" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline ml-2">{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 shadow-md" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{flash.error}</span>
                </div>
            )}
            {/* Display validation errors from Inertia */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 shadow-md" role="alert">
                    <strong className="font-bold">Whoops!</strong>
                    <span className="block sm:inline ml-2">There were some problems with your submission.</span>
                    <ul className="mt-2 list-disc list-inside">
                        {Object.values(errors).map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {!showEnrollmentForm ? (
                /* Hero Section - Initial Public Page Content */
                <section className="bg-htta-white p-10 md:p-16 rounded-xl shadow-2xl text-center border-b-8 border-htta-light-green animate-fade-in">
                    <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 text-htta-blue leading-tight tracking-tight">
                        Empowering Minds, Transforming Futures
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Highlands Technical Training Academy, Inc. (HTTA, Inc.) is your gateway to a successful culinary career. We offer TESDA-accredited programs designed to equip you with practical skills and knowledge for the global industry.
                    </p>
                    <img
                        src="https://placehold.co/1200x500/E0F2F7/2D3A84?text=Culinary+Training+at+HTTA"
                        alt="Culinary Training at HTTA"
                        className="w-full max-h-[500px] object-cover rounded-lg shadow-xl mb-10 border-4 border-htta-green transition-all duration-500 ease-in-out hover:scale-[1.01]"
                    />
                    <button
                        onClick={() => setShowEnrollmentForm(true)}
                        className="bg-htta-blue text-htta-white font-bold py-3 px-10 rounded-full text-2xl hover:bg-htta-dark-blue transform hover:scale-105 transition duration-300 ease-in-out shadow-lg flex items-center justify-center mx-auto"
                    >
                        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Get Started - Enroll Now!
                    </button>

                    {/* Added value proposition section */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 bg-white rounded-lg shadow-xl border border-htta-light-green transition-transform duration-300 hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-htta-blue mb-4">TESDA Accredited</h3>
                            <p className="text-gray-700">Our programs are officially recognized, ensuring high-quality education and industry-standard skills.</p>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-xl border border-htta-light-green transition-transform duration-300 hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-htta-blue mb-4">Practical Skills</h3>
                            <p className="text-gray-700">Learn by doing! Our hands-on approach prepares you for real-world culinary challenges.</p>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-xl border border-htta-light-green transition-transform duration-300 hover:scale-[1.02]">
                            <h3 className="text-2xl font-bold text-htta-blue mb-4">Global Opportunities</h3>
                            <p className="text-gray-700">Unlock a world of possibilities with skills recognized locally and internationally.</p>
                        </div>
                    </div>
                </section>
            ) : (
                /* Enrollment Form Section */
                <section className="bg-htta-white p-10 md:p-16 rounded-xl shadow-2xl border-b-8 border-htta-light-green animate-fade-in">
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 text-htta-blue border-b-4 border-htta-gold pb-4 text-center">
                        TESDA Learner Registration Form
                    </h2>
                    <RegistrationForm />
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowEnrollmentForm(false)}
                            className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-600 transition duration-300 shadow-md"
                        >
                            Back to Home
                        </button>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
};

export default Home;