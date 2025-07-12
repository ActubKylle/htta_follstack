import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react'; // Import 'router' for Inertia post requests
import { useState } from 'react'; // Import useState for modal state

// Define a type for a Learner with relevant fields and a status
interface LearnerData {
    learner_id: number;
    first_name: string;
    last_name: string;
    email: string; // From the User relationship
    contact_no: string; // From the Address relationship
    course_qualification: string; // From CourseEnrollment
    created_at: string;
    enrollment_status: 'pending' | 'accepted' | 'rejected'; // Added enrollment status
    address?: {
        city_municipality: string;
        province: string;
    };
    user?: { // User relationship for email
        email: string;
    };
}

// Extend PageProps to include the data passed from the controller
interface AdminEnrollmentsProps extends PageProps {
    recentLearners: LearnerData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/admin/enrollments',
    },
];

export default function Enrollments() {
    const { recentLearners } = usePage<AdminEnrollmentsProps>().props;
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState<LearnerData | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
    console.log('Recent Learners Data:', recentLearners);

    // This function now just sets up the modal for confirmation
    const handleAction = (learner: LearnerData, action: 'accept' | 'reject') => {
        setSelectedLearner(learner);
        setActionType(action);
        setShowConfirmation(true);
    };

    const confirmAction = () => {
        if (selectedLearner && actionType) {
            const routeName = actionType === 'accept' ? 'admin.enrollment.accept' : 'admin.enrollment.reject';

            // Corrected router.post call: removed preserveScroll as it's not a valid option here
            router.post(route(routeName, selectedLearner.learner_id), {}, {
                onSuccess: () => {
                    setShowConfirmation(false);
                    setSelectedLearner(null);
                    setActionType(null);
                    // Inertia automatically updates the page props after a successful post.
                    // If the backend redirects or returns updated props, the table will re-render.
                    // If you *must* force a full Inertia reload (less common after a post):
                    router.reload(); // No options needed here
                },
                onError: (errors) => {
                    console.error("Error performing action:", errors);
                    // Use a custom modal or toast for error messages instead of alert()
                    // For now, keeping alert for demonstration, but it should be replaced.
                    alert(`Failed to ${actionType} enrollment.`);
                    setShowConfirmation(false);
                    setSelectedLearner(null);
                    setActionType(null);
                },
            });
        }
    };

    const cancelAction = () => {
        setShowConfirmation(false);
        setSelectedLearner(null);
        setActionType(null);
    };

    // Ensure 'status' parameter can accept null/undefined and defaults to 'pending'
    const getStatusClasses = (status: 'pending' | 'accepted' | 'rejected' | null | undefined) => {
        // Use nullish coalescing to ensure 'status' is always a string for the switch
        const actualStatus = status ?? 'pending';
        switch (actualStatus) {
            case 'accepted':
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
            case 'rejected':
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
            case 'pending':
            default:
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollments" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto bg-white shadow-lg">
                <h2 className="text-3xl font-extrabold text-htta-blue mb-6 border-b-2 border-htta-gold pb-3">Recent Enrollments</h2>

                {recentLearners.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentLearners.map((learner) => (
                                    <tr key={learner.learner_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {learner.first_name} {learner.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {learner.user?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {learner.contact_no || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {learner.course_qualification || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {learner.address ? `${learner.address.city_municipality}, ${learner.address.province}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(learner.created_at).toLocaleDateString()}
                                        </td>
                                        {/* --- THIS IS THE CRITICAL FIX FOR LINE 152 --- */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={getStatusClasses(learner.enrollment_status)}>
                                                { /* Ensure enrollment_status is a string before calling charAt/slice */ }
                                                { (learner.enrollment_status ?? 'pending').charAt(0).toUpperCase() + (learner.enrollment_status ?? 'pending').slice(1) }
                                            </span>
                                        </td>
                                        {/* --- END CRITICAL FIX --- */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                            <Link href={route('admin.enrollment.show', learner.learner_id)} className="text-htta-blue hover:text-htta-green-dark">
                                                View
                                            </Link>
                                            {learner.enrollment_status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(learner, 'accept')}
                                                        className="text-green-600 hover:text-green-900 ml-4"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(learner, 'reject')}
                                                        className="text-red-600 hover:text-red-900 ml-4"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 py-8">No recent enrollments found.</p>
                )}

                {/* Confirmation Modal */}
                {showConfirmation && selectedLearner && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                            <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
                            <p className="mb-6">
                                Are you sure you want to **{actionType}** the enrollment for{' '}
                                <span className="font-semibold">{selectedLearner.first_name} {selectedLearner.last_name}</span>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelAction}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className={`px-4 py-2 rounded-md text-white ${actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {actionType === 'accept' ? 'Accept' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholder for other admin dashboard widgets */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-8">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
                        Analytics Widget
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
                        Program Overview
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
                        Quick Actions
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
