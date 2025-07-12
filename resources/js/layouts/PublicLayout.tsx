import React from 'react';
import { Link } from '@inertiajs/react';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100"> {/* No 'dark' class here */}
            {/* Public Header */}
            <header className="bg-htta-blue text-htta-white shadow py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/">
                            <img src="/images/htta_logo.png" alt="HTTA Logo" className="h-16 w-auto mr-3" /> {/* Use your actual logo path */}
                        </Link>
                        <span className="text-3xl font-extrabold text-htta-white">HTTA, Inc.</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="/" className="hover:text-htta-gold transition duration-300 text-lg font-semibold">Home</Link></li>
                            <li><Link href="/about" className="hover:text-htta-gold transition duration-300 text-lg font-semibold">About Us</Link></li>
                            <li><Link href="/programs" className="hover:text-htta-gold transition duration-300 text-lg font-semibold">Programs</Link></li>
                            <li><Link href="/contact" className="hover:text-htta-gold transition duration-300 text-lg font-semibold">Contact Us</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl"> {/* Adjust max-width as needed */}
                    {children}
                </div>
            </main>

            {/* Public Footer */}
            <footer className="bg-htta-dark-blue text-htta-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    &copy; {new Date().getFullYear()} Highlands Technical Training Academy, Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;