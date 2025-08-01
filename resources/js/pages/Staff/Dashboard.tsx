import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    Award,
    Clock,
    CheckCircle,
    TrendingUp,
    FilePlus,
    ArrowRight
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    // LoadingButton,
    // LoadingOverlay,
    PageLoadingSkeleton, // The component we will use
    // TableLoadingSkeleton,
    // useLoadingStates
} from '@/components/Loading';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
    },
];

// Reusable component for displaying key stats
function MetricCard({ title, value, icon: Icon, color, link, linkText }) {
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-600',
        purple: 'from-purple-500 to-violet-600',
        green: 'from-green-500 to-emerald-600',
        amber: 'from-amber-500 to-orange-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 font-medium">{title}</p>
                    <p className="text-4xl font-bold text-slate-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <Link
                href={link}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
                {linkText} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

// Reusable component for sections like charts and lists
function SectionCard({ title, children, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            </div>
            <div>{children}</div>
        </div>
    );
}

export default function StaffDashboard() {
    // Get dynamic data from the Laravel controller
    const { stats, enrollmentTrends, courseDistribution, recentPendingLearners } = usePage().props;
        const [isLoading, setIsLoading] = useState(true);


        useEffect(() => {
        // This timer simulates a network request to show the skeleton.
        // In a real-world scenario, this might be tied to Inertia's 'start' and 'finish' events.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Increased time to make skeleton more visible

        return () => clearTimeout(timer); // Cleanup timer
    }, []);

    // If loading, show the new PageLoadingSkeleton component
    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                 <Head title="Loading Dashboard..." />
                <PageLoadingSkeleton />
            </AppLayout>
        );
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />

            <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
                {/* Header */}
                <h1 className="text-3xl font-bold text-slate-900">Welcome, Staff!</h1>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Pending Enrollments"
                        value={stats.pendingLearners}
                        icon={Clock}
                        color="amber"
                        link={route('staff.enrollments')}
                        linkText="Review Enrollments"
                    />
                    <MetricCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={Users}
                        color="blue"
                        link={route('staff.students.index')}
                        linkText="View Student List"
                    />
                    <MetricCard
                        title="Active Programs"
                        value={stats.activePrograms}
                        icon={BookOpen}
                        color="purple"
                        link={route('staff.programs.manage_index')}
                        linkText="Manage Programs"
                    />
                    <MetricCard
                        title="Pending Scholarships"
                        value={stats.pendingScholarships}
                        icon={Award}
                        color="green"
                        link={route('staff.scholarships.index')}
                        linkText="Manage Scholarships"
                    />
                </div>

                {/* Main Content Grid for Charts and Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrollment Trends Chart */}
                    <div className="lg:col-span-2">
                        <SectionCard title="Enrollment Trends (Last 6 Months)" icon={TrendingUp}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={enrollmentTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="students" stroke="#3B82F6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </SectionCard>
                    </div>

                    {/* Pending Enrollment Requests List */}
                    <div>
                        <SectionCard title="Pending Enrollment Requests" icon={FilePlus}>
                            <div className="space-y-3">
                                {recentPendingLearners.length > 0 ? (
                                    recentPendingLearners.map((learner) => (
                                        <Link
                                            key={learner.learner_id}
                                            href={route('staff.enrollment.show', learner.learner_id)}
                                            className="block p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <div className="font-semibold text-slate-800">{learner.name}</div>
                                            <div className="text-sm text-slate-600">
                                                Applied for <span className="font-medium">{learner.program}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{learner.date}</div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                                        <p>No pending enrollments. Great job!</p>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}