import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
// Import Dropdown Menu components
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// Importing icons from 'lucide-react'
import { Search, Filter, Users, CheckCircle, XCircle, Clock, Eye, User, Mail, Phone, MapPin, Calendar, BookOpen, ChevronLeft, ChevronRight, MoreHorizontal, MoreVertical } from 'lucide-react';

// Toast notification interface
interface ToastNotification {
    id: string;
    type: 'success' | 'error';
    title: string;
    message: string;
    duration?: number;
}

// Define a type for a Learner with relevant fields and a status
interface LearnerData {
    learner_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    course_qualification: string;
    created_at: string;
    enrollment_status: 'pending' | 'accepted' | 'rejected';
    address?: {
        city_municipality: string;
        province: string;
    };
    user?: {
        email: string;
    };
}

// Extend PageProps to include the data passed from the controller
interface AdminEnrollmentsProps extends PageProps {
    recentLearners: {
        data: LearnerData[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        per_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollments',
        href: '/admin/enrollments',
    },
];

export default function Enrollments() {
    const { recentLearners, filters } = usePage<AdminEnrollmentsProps>().props;

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState<LearnerData | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false); // New state for mobile filter toggle

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [currentPage, setCurrentPage] = useState(recentLearners.current_page);

    // Effect to update internal state when Inertia reloads with new props
    useEffect(() => {
        setSearch(filters.search || '');
        setStatusFilter(filters.status || '');
        setCurrentPage(recentLearners.current_page);
    }, [filters.search, filters.status, recentLearners.current_page]);

    // Function to apply filters and search
    const applyFilters = (page: number = 1) => {
        router.get(
            route('admin.enrollments'),
            { search, status: statusFilter, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Handle search input change with debounce
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Use useEffect to apply filters when search or statusFilter changes (with debounce for search)
    useEffect(() => {
        const handler = setTimeout(() => {
            applyFilters(1); // Reset to page 1 on search/filter change
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [search, statusFilter]);

    // Toast notification functions
    const addToast = (toast: Omit<ToastNotification, 'id'>) => {
        const id = Date.now().toString();
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 5000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Handle action confirmation
    const handleAction = (learner: LearnerData, action: 'accept' | 'reject') => {
        setSelectedLearner(learner);
        setActionType(action);
        setShowConfirmation(true);
    };

    const confirmAction = async () => {
        if (selectedLearner && actionType) {
            setIsLoading(true);
            const routeName = actionType === 'accept' ? 'admin.enrollment.accept' : 'admin.enrollment.reject';

            router.post(route(routeName, selectedLearner.learner_id), {}, {
                onSuccess: () => {
                    setIsLoading(false);
                    setShowConfirmation(false);

                    // Add success toast
                    addToast({
                        type: 'success',
                        title: actionType === 'accept' ? 'Enrollment Accepted!' : 'Enrollment Rejected!',
                        message: `${selectedLearner.first_name} ${selectedLearner.last_name}'s enrollment has been ${actionType}ed successfully.`,
                        duration: 5000
                    });

                    setSelectedLearner(null);
                    setActionType(null);
                    router.reload({ preserveState: true, preserveScroll: true }); // Reload to show updated status
                },
                onError: (errors) => {
                    console.error("Error performing action:", errors);
                    setIsLoading(false);
                    setShowConfirmation(false);

                    // Add error toast
                    addToast({
                        type: 'error',
                        title: 'Action Failed',
                        message: `Failed to ${actionType} the enrollment. Please try again.`,
                        duration: 6000
                    });

                    setSelectedLearner(null);
                    setActionType(null);
                },
            });
        }
    };

    const cancelAction = () => {
        if (!isLoading) {
            setShowConfirmation(false);
            setSelectedLearner(null);
            setActionType(null);
        }
    };

    // Get status styling
    const getStatusBadge = (status: 'pending' | 'accepted' | 'rejected' | null | undefined) => {
        const actualStatus = status ?? 'pending';
        const statusConfig = {
            accepted: {
                icon: CheckCircle,
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                iconColor: 'text-green-500'
            },
            rejected: {
                icon: XCircle,
                bgColor: 'bg-red-50',
                textColor: 'text-red-700',
                iconColor: 'text-red-500'
            },
            pending: {
                icon: Clock,
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                iconColor: 'text-yellow-500'
            }
        };

        const config = statusConfig[actualStatus];
        const StatusIcon = config.icon; // Lucide icon component

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
            </span>
        );
    };

    // Get enrollment stats (simplified for current page's data for demonstration)
    const getEnrollmentStats = () => {
        const stats = {
            total: recentLearners.total, // Use total from paginator
            pending: 0,
            accepted: 0,
            rejected: 0
        };

        // Calculate counts based on current page data
        recentLearners.data.forEach(learner => {
            const status = learner.enrollment_status ?? 'pending';
            if (status === 'pending') stats.pending++;
            else if (status === 'accepted') stats.accepted++;
            else if (status === 'rejected') stats.rejected++;
        });

        return stats;
    };

    const stats = getEnrollmentStats();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollments" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
                                <p className="text-gray-600 mt-2">Review and manage student enrollment applications</p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full lg:w-auto">
                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                        <p className="text-sm text-gray-500">Pending</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                                        <p className="text-sm text-gray-500">Accepted</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                                        <p className="text-sm text-gray-500">Rejected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                {/* Status Filter */}
                              <div className="w-full lg:w-64">
    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        // Changed text-gray-700 to text-gray-900 for darker text
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
    >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
    </select>
</div>
                                {/* Clear Filters Button */}
                                <button
                                    onClick={() => { setSearch(''); setStatusFilter(''); applyFilters(1); }}
                                    className="w-full lg:w-auto px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Filter className="w-5 h-5" /> Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enrollments Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        {recentLearners.data.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Student</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Course</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentLearners.data.map((learner) => (
                                                <tr key={learner.learner_id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-dark font-semibold text-sm">
                                                                {learner.first_name.charAt(0)}{learner.last_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{learner.first_name} {learner.last_name}</p>
                                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                                    {learner.user?.email || 'N/A'}
                                                                </p>
                                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                                    {learner.contact_no || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{learner.course_qualification || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">
                                                                {learner.address ? `${learner.address.city_municipality}, ${learner.address.province}` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-900">{new Date(learner.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {getStatusBadge(learner.enrollment_status)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {/* Desktop Dropdown Menu for Actions */}
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger asChild>
                                                                <button
                                                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                                                    aria-label="More actions"
                                                                >
                                                                    <MoreVertical className="w-5 h-5" />
                                                                </button>
                                                            </DropdownMenu.Trigger>

                                                            <DropdownMenu.Portal>
                                                                <DropdownMenu.Content
                                                                    className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[150px]
                                                                        data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade
                                                                        data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                                                    sideOffset={5}
                                                                >
                                                                    <DropdownMenu.Item asChild>
                                                                        <Link
                                                                            href={route('admin.enrollment.show', learner.learner_id)}
                                                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[highlighted]:outline-none transition-colors cursor-pointer"
                                                                        >
                                                                            <Eye className="w-4 h-4" /> View Details
                                                                        </Link>
                                                                    </DropdownMenu.Item>

                                                                    {(learner.enrollment_status ?? 'pending').toLowerCase().trim() === 'pending' && (
                                                                        <>
                                                                            <DropdownMenu.Separator className="h-[1px] bg-gray-200 my-1" />
                                                                            <DropdownMenu.Item asChild>
                                                                                <button
                                                                                    onClick={() => handleAction(learner, 'accept')}
                                                                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 data-[highlighted]:bg-green-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                                >
                                                                                    <CheckCircle className="w-4 h-4" /> Accept
                                                                                </button>
                                                                            </DropdownMenu.Item>
                                                                            <DropdownMenu.Item asChild>
                                                                                <button
                                                                                    onClick={() => handleAction(learner, 'reject')}
                                                                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                                >
                                                                                    <XCircle className="w-4 h-4" /> Reject
                                                                                </button>
                                                                            </DropdownMenu.Item>
                                                                        </>
                                                                    )}
                                                                </DropdownMenu.Content>
                                                            </DropdownMenu.Portal>
                                                        </DropdownMenu.Root>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards (Visible on smaller screens) */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {recentLearners.data.map((learner) => (
                                        <div key={learner.learner_id} className="p-6 border-b last:border-b-0">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-dark font-semibold">
                                                        {learner.first_name.charAt(0)}{learner.last_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{learner.first_name} {learner.last_name}</p>
                                                        <p className="text-sm text-gray-500">{new Date(learner.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(learner.enrollment_status)}
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                                    {learner.user?.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                                    {learner.contact_no || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                                                    {learner.course_qualification || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    {learner.address ? `${learner.address.city_municipality}, ${learner.address.province}` : 'N/A'}
                                                </div>
                                            </div>

                                            {/* Mobile Dropdown Menu for Actions */}
                                            <div className="flex justify-end">
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild>
                                                        <button
                                                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                                            aria-label="More actions"
                                                        >
                                                            <MoreHorizontal className="w-5 h-5" />
                                                        </button>
                                                    </DropdownMenu.Trigger>

                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            className="bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-50 min-w-[150px]
                                                                data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade
                                                                data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                                            sideOffset={5}
                                                        >
                                                            <DropdownMenu.Item asChild>
                                                                <Link
                                                                    href={route('admin.enrollment.show', learner.learner_id)}
                                                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[highlighted]:outline-none transition-colors cursor-pointer"
                                                                >
                                                                    <Eye className="w-4 h-4" /> View Details
                                                                </Link>
                                                            </DropdownMenu.Item>

                                                            {(learner.enrollment_status ?? 'pending').toLowerCase().trim() === 'pending' && (
                                                                <>
                                                                    <DropdownMenu.Separator className="h-[1px] bg-gray-200 my-1" />
                                                                    <DropdownMenu.Item asChild>
                                                                        <button
                                                                            onClick={() => handleAction(learner, 'accept')}
                                                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:bg-green-50 data-[highlighted]:bg-green-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" /> Accept
                                                                        </button>
                                                                    </DropdownMenu.Item>
                                                                    <DropdownMenu.Item asChild>
                                                                        <button
                                                                            onClick={() => handleAction(learner, 'reject')}
                                                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:outline-none transition-colors cursor-pointer w-full text-left"
                                                                        >
                                                                            <XCircle className="w-4 h-4" /> Reject
                                                                        </button>
                                                                    </DropdownMenu.Item>
                                                                </>
                                                            )}
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Enhanced Pagination */}
                                {recentLearners.links.length > 3 && ( // Only show pagination if there's more than "previous", "1", "next"
                                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{recentLearners.from}</span> to <span className="font-medium">{recentLearners.to}</span> of{' '}
                                                <span className="font-medium">{recentLearners.total}</span> results
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {recentLearners.links.map((link, index) => {
                                                    const isNumeric = /^\d+$/.test(link.label);
                                                    const isPrevious = link.label.includes('Previous');
                                                    const isNext = link.label.includes('Next');

                                                    // Determine the content of the button based on its label
                                                    let buttonContent;
                                                    if (isPrevious) {
                                                        buttonContent = <><ChevronLeft className="w-4 h-4" /> Previous</>;
                                                    } else if (isNext) {
                                                        buttonContent = <>Next <ChevronRight className="w-4 h-4" /></>;
                                                    } else {
                                                        buttonContent = link.label;
                                                    }

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => link.url && applyFilters(Number(new URL(link.url).searchParams.get('page')) || 1)}
                                                            disabled={!link.url || link.active}
                                                            className={`
                                                                inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                                                                ${link.active
                                                                    ? 'bg-blue-600 text-dark shadow-sm'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                }
                                                                ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                                            `}
                                                        >
                                                            {buttonContent}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg mb-2">No enrollments found</p>
                                <p className="text-gray-400">Try adjusting your search criteria or checking back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Confirmation Modal */}
            <Dialog.Root open={showConfirmation} onOpenChange={setShowConfirmation}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                        <Dialog.Content className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:duration-300 data-[state=open]:duration-500">
                            <div className={`h-2 ${actionType === 'accept' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${actionType === 'accept' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {actionType === 'accept' ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <Dialog.Title className="text-xl font-bold text-gray-900">
                                            {actionType === 'accept' ? 'Accept Enrollment' : 'Reject Enrollment'}
                                        </Dialog.Title>
                                        <p className="text-gray-500 text-sm">This action cannot be undone</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-dark font-semibold text-sm">
                                            {selectedLearner?.first_name?.charAt(0)}{selectedLearner?.last_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {selectedLearner?.first_name} {selectedLearner?.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {selectedLearner?.course_qualification}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={cancelAction}
                                    disabled={isLoading}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    disabled={isLoading}
                                    className={`px-5 py-2.5 rounded-lg text-dark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                        ${actionType === 'accept'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        actionType === 'accept' ? 'Accept' : 'Reject'
                                    )}
                                </button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Toast Notifications Container */}
            <div className="fixed top-4 right-4 z-[60] space-y-3 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`relative p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-out translate-x-0 opacity-100 ${
                            toast.type === 'success'
                                ? 'bg-green-600'
                                : 'bg-red-600'
                        } text-dark flex items-start gap-3 pointer-events-auto`}
                        // Optional: Add exit animation classes if you have them (e.g., animate-out fade-out-0 slide-out-to-right-full)
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                <XCircle className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-lg">{toast.title}</p>
                            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                            aria-label="Close toast"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                            <div
                                className="h-full bg-white animate-shrink rounded-full"
                                style={{ animationDuration: `${toast.duration || 5000}ms` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS for Radix UI animations (Add this to your main CSS file or a style block) */}
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                @keyframes slideDownAndFade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUpAndFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideRightAndFade {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideLeftAndFade {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                /* Specific styles for Dropdown Menu Content */
                [data-radix-popper-content-wrapper] {
                    z-index: 60; /* Ensure dropdown is above other elements but below modal/toasts */
                }
                .data-[side=top]:animate-slideDownAndFade { animation: slideDownAndFade 0.2s ease-out forwards; }
                .data-[side=bottom]:animate-slideUpAndFade { animation: slideUpAndFade 0.2s ease-out forwards; }
                .data-[side=left]:animate-slideRightAndFade { animation: slideRightAndFade 0.2s ease-out forwards; }
                .data-[side=right]:animate-slideLeftAndFade { animation: slideLeftAndFade 0.2s ease-out forwards; }

                /* Common animations for Dialog Overlay/Content (already present, just for completeness) */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }
                @keyframes zoomOut { from { transform: scale(1); } to { transform: scale(0.95); } }
                @keyframes slideInFromLeft { from { transform: translateX(-50%) translateY(-48%); } to { transform: translateX(0) translateY(0); } }
                @keyframes slideOutToLeft { from { transform: translateX(0) translateY(0); } to { transform: translateX(-50%) translateY(-48%); } }
                @keyframes slideInFromTop { from { transform: translateY(-48%); } to { transform: translateY(0); } }
                @keyframes slideOutToTop { from { transform: translateY(0); } to { transform: translateY(-48%); } }

                .data-[state=open]:animate-in {
                    animation-name: fadeIn, zoomIn; /* For content, consider slide too */
                    animation-duration: 0.5s;
                    animation-timing-function: ease-out;
                    animation-fill-mode: forwards;
                }
                .data-[state=closed]:animate-out {
                    animation-name: fadeOut, zoomOut; /* For content, consider slide too */
                    animation-duration: 0.3s;
                    animation-timing-function: ease-in;
                    animation-fill-mode: forwards;
                }
                /* These are for the dialog content specifically. Overlay uses fade-in/out */
                .data-[state=open][data-side=bottom]:slide-in-from-bottom { animation-name: slideInFromTop; }
                .data-[state=closed][data-side=bottom]:slide-out-to-bottom { animation-name: slideOutToTop; }
                .data-[state=open][data-side=left]:slide-in-from-left { animation-name: slideInFromLeft; }
                .data-[state=closed][data-side=left]:slide-out-to-left { animation-name: slideOutToLeft; }


                /* Custom animations for toast notifications */
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-in.slide-in-from-right-full {
                    animation: slideInFromRight 0.5s ease-out forwards;
                }
            `}</style>
        </AppLayout>
    );
}