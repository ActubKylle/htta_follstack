import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import RegistrationForm from '@/Components/RegistrationForm';
import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';

const Home: React.FC = () => {
    const { flash = {}, errors } = usePage<PageProps>().props;
    const [showEnrollmentForm, setShowEnrollmentForm] = useState<boolean>(false);

    return (
        <PublicLayout>
            <Head title="Highlands Technical Training Academy, Inc. - Free TESDA Training" />

            {/* Flash Messages */}
            {flash.success && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-6 py-4 rounded-r-lg relative mb-6 shadow-md animate-pulse" role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <strong className="font-bold">Success!</strong>
                        <span className="ml-2">{flash.success}</span>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <strong className="font-bold">Error!</strong>
                        <span className="ml-2">{flash.error}</span>
                    </div>
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg relative mb-6 shadow-md" role="alert">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <strong className="font-bold">Validation Errors:</strong>
                            <ul className="mt-2 list-disc list-inside">
                                {Object.values(errors).map((error: string, index: number) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!showEnrollmentForm ? (
                <>
                    {/* Hero Section */}
                    <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50 p-10 md:p-16 rounded-2xl shadow-2xl border-b-8 border-emerald-500 animate-fade-in overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 translate-x-24 translate-y-24"></div>
                        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-30"></div>

                        <div className="relative z-10 text-center">
                            {/* FREE Badge */}
                            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg mb-6 animate-bounce">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                                100% FREE TESDA Training
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-700 bg-clip-text text-transparent leading-tight tracking-tight">
                                Empowering Minds,<br />
                                <span className="text-yellow-600">Transforming Futures</span>
                            </h1>

                            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
                                Highlands Technical Training Academy, Inc. (HTTA, Inc.) offers <strong className="text-emerald-600">completely FREE</strong> TESDA-accredited culinary programs. 
                                Build your career in the culinary arts with professional training that costs you nothing but your dedication.
                            </p>

                            {/* Call to Action */}
                            <button
                                onClick={() => setShowEnrollmentForm(true)}
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 ease-in-out shadow-xl flex items-center justify-center mx-auto group"
                            >
                                <svg className="w-8 h-8 mr-3 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Enroll Now - It's FREE!
                            </button>

                            {/* Trust Indicators */}
                            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-gray-600">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    No Hidden Fees
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    TESDA Certified
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Job Ready Skills
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Programs Section */}
                    <section className="mt-16 bg-white p-10 md:p-16 rounded-2xl shadow-2xl border-t-8 border-emerald-500">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
                                Our <span className="text-emerald-600">FREE</span> Programs
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Choose from our TESDA-accredited culinary programs - all completely free of charge
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Commercial Cooking */}
                            <div className="group relative bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl shadow-xl border-2 border-orange-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    FREE
                                </div>
                                <div className="text-6xl mb-6 text-orange-500">🍳</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Commercial Cooking NC II</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Master the art of professional cooking with hands-on training in commercial kitchens. 
                                    Learn food preparation, cooking techniques, and kitchen management.
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        TESDA NC II Certificate
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Hands-on Kitchen Training
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Industry-Standard Equipment
                                    </li>
                                </ul>
                            </div>

                            {/* Bread & Pastry */}
                            <div className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    FREE
                                </div>
                                <div className="text-6xl mb-6 text-yellow-500">🥖</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Bread & Pastry Production NC II</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Learn the art of baking and pastry creation. From artisan breads to elegant desserts, 
                                    master the skills needed for professional baking careers.
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        TESDA NC II Certificate
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Professional Baking Techniques
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Pastry Arts & Decoration
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Value Proposition */}
                    <section className="mt-16 bg-gradient-to-r from-emerald-500 to-blue-600 p-10 md:p-16 rounded-2xl shadow-2xl text-white">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
                                Why Choose HTTA?
                            </h2>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                We're committed to making quality culinary education accessible to everyone
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                                <div className="text-5xl mb-4">🏆</div>
                                <h3 className="text-2xl font-bold mb-4">TESDA Accredited</h3>
                                <p className="opacity-90">Government-recognized certification that employers trust and value nationwide.</p>
                            </div>
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                                <div className="text-5xl mb-4">👨‍🍳</div>
                                <h3 className="text-2xl font-bold mb-4">Expert Instructors</h3>
                                <p className="opacity-90">Learn from industry professionals with years of commercial kitchen experience.</p>
                            </div>
                            <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                                <div className="text-5xl mb-4">🌍</div>
                                <h3 className="text-2xl font-bold mb-4">Global Opportunities</h3>
                                <p className="opacity-90">Open doors to local and international career opportunities in the culinary industry.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="mt-16 text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-10 md:p-16 rounded-2xl shadow-2xl border-2 border-yellow-200">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6">
                            Ready to Start Your <span className="text-emerald-600">FREE</span> Culinary Journey?
                        </h2>
                        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Don't let cost be a barrier to your dreams. Our programs are completely free - 
                            you just need to bring your passion for cooking!
                        </p>
                        <button
                            onClick={() => setShowEnrollmentForm(true)}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition duration-300 ease-in-out shadow-xl"
                        >
                            Begin Your Free Training Today!
                        </button>
                    </section>
                </>
            ) : (
                /* Enrollment Form Section */
                <section className="bg-gradient-to-br from-emerald-50 to-blue-50 p-10 md:p-16 rounded-2xl shadow-2xl border-b-8 border-emerald-500 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            FREE Registration
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
                            TESDA Learner Registration Form
                        </h2>
                        <p className="text-xl text-gray-600">
                            Complete your registration for our FREE culinary training programs
                        </p>
                    </div>
                    
                    <RegistrationForm />
                    
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowEnrollmentForm(false)}
                            className="bg-gray-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-600 transition duration-300 shadow-md flex items-center justify-center mx-auto"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Home
                        </button>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
};

export default Home;