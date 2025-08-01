import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Award, Users, Calendar, Check, X, Clock, Mail, User, Inbox, MessageSquare } from 'lucide-react';
import { MyModal } from '@/components/Enrollments/MyModal'; // Reusing your existing modal

// --- Interfaces ---
interface Applicant extends PageProps {
    learner_id: number;
    first_name: string;
    last_name: string;
    user: {
        email: string;
    };
    pivot: {
        status: 'Pending' | 'Approved' | 'Rejected';
        application_date: string;
        remarks: string | null;
    };
}

interface ScholarshipDetails {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
    status: 'Open' | 'Closed' | 'Ongoing';
    available_slots: number;
    description: string;
    eligibility_criteria: string;
    application_deadline: string;
    learners: Applicant[]; // This is the list of applicants
}

interface ScholarshipShowProps extends PageProps {
    scholarship: ScholarshipDetails;
}

export default function ScholarshipShow({ scholarship }: ScholarshipShowProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [actionType, setActionType] = useState<'Approved' | 'Rejected' | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        status: '',
        remarks: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('staff.dashboard') },
        { title: 'Scholarships', href: route('staff.scholarships.index') },
        { title: scholarship.scholarship_name, href: '#' }
    ];

    const openModal = (applicant: Applicant, type: 'Approved' | 'Rejected') => {
        setSelectedApplicant(applicant);
        setActionType(type);
        setData({ status: type, remarks: '' }); // Reset form
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedApplicant(null);
        setActionType(null);
        reset(); // Clear form state and errors
    };

    const handleSubmitStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplicant || !actionType) return;

        post(route('staff.scholarships.applicants.update_status', {
            scholarship: scholarship.scholarship_id,
            learner: selectedApplicant.learner_id
        }), {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        });
    };

    const approvedCount = scholarship.learners.filter(l => l.pivot.status === 'Approved').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Applicants for ${scholarship.scholarship_name}`} />
            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Scholarship Details Header */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{scholarship.scholarship_name}</h1>
                                <p className="text-lg text-gray-600 mt-1">Provided by: {scholarship.provider}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                scholarship.status === 'Open' ? 'bg-green-100 text-green-800' :
                                scholarship.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {scholarship.status}
                            </span>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-htta-blue" />
                                <span>Slots: <span className="font-semibold">{approvedCount} / {scholarship.available_slots}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-htta-blue" />
                                <span>Deadline: <span className="font-semibold">{new Date(scholarship.application_deadline).toLocaleDateString()}</span></span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-800">Eligibility Criteria:</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{scholarship.eligibility_criteria}</p>
                        </div>
                    </div>

                    {/* Applicants Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                         <h2 className="text-xl font-semibold text-gray-800 p-6 border-b border-gray-200 flex items-center gap-2">
                            <Users className="w-6 h-6 text-htta-blue" />
                            Applicant List
                        </h2>
                        {scholarship.learners.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {scholarship.learners.map((applicant) => (
                                            <tr key={applicant.learner_id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <User className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{applicant.first_name} {applicant.last_name}</div>
                                                            <div className="text-sm text-gray-500">{applicant.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(applicant.pivot.application_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        applicant.pivot.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        applicant.pivot.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {applicant.pivot.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {applicant.pivot.status === 'Pending' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => openModal(applicant, 'Approved')} className="inline-flex items-center gap-1 px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                                                <Check className="w-4 h-4" /> Approve
                                                            </button>
                                                            <button onClick={() => openModal(applicant, 'Rejected')} className="inline-flex items-center gap-1 px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                                                                <X className="w-4 h-4" /> Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 italic">Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Applicants Yet</h3>
                                <p className="mt-1 text-sm text-gray-500">There are currently no student applications for this scholarship.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* --- Status Update Modal --- */}
            {isModalOpen && selectedApplicant && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmitStatus}>
                            <div className="p-6">
                                <h3 className={`text-lg font-bold flex items-center gap-2 ${actionType === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                                    {actionType === 'Approved' ? <Check /> : <X />}
                                    Confirm {actionType}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Are you sure you want to <span className="font-semibold">{actionType?.toLowerCase()}</span> the application for <span className="font-semibold">{selectedApplicant.first_name} {selectedApplicant.last_name}</span>?
                                </p>
                                <div className="mt-4">
                                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                                        Remarks (Optional)
                                    </label>
                                    <textarea
                                        id="remarks"
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        rows={3}
                                        className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-htta-blue focus:border-htta-blue"
                                        placeholder="Add any notes for this decision..."
                                    />
                                    {errors.remarks && <p className="text-sm text-red-500 mt-1">{errors.remarks}</p>}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white disabled:opacity-50 ${
                                        actionType === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {processing ? 'Processing...' : `Confirm ${actionType}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
