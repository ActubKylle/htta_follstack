import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { type PageProps, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Info, Loader2, ArrowLeft } from 'lucide-react';

// --- Interfaces ---
interface Scholarship {
    scholarship_id: number;
    scholarship_name: string;
    provider: string;
}

// Learner profile data
interface Learner {
    first_name: string;
    last_name: string;
    email: string;
}

interface ApplyPageProps extends PageProps {
    scholarship: Scholarship;
    learner: Learner;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scholarships', href: route('student.scholarships.index') },
    { title: 'Apply', href: '#' }
];

// --- CORRECTED COMPONENT ---
// Destructure the 'auth' prop to get the user's email.
export default function Apply({ scholarship, learner, auth }: ApplyPageProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        // Use the learner prop for name details
        first_name: learner.first_name || '',
        last_name: learner.last_name || '',
        // Use the global 'auth' prop for the user's email
        email: auth.user.email || '',
        // File upload fields
        birth_certificate: null,
        transcript_of_records: null,
        formal_photo: null,
        marriage_contract: null,
        parent_id: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.scholarships.store', scholarship.scholarship_id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Apply for ${scholarship.scholarship_name}`} />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link href={route('student.scholarships.index')} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Scholarships
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-htta-blue">{scholarship.scholarship_name}</CardTitle>
                            <CardDescription>Offered by {scholarship.provider}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentlySuccessful ? (
                                <Alert variant="success">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Application Submitted!</AlertTitle>
                                    <AlertDescription>
                                        Your application has been received. We will notify you of any updates.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="first_name">First Name</Label>
                                                <Input id="first_name" value={data.first_name} disabled className="bg-gray-100" />
                                            </div>
                                            <div>
                                                <Label htmlFor="last_name">Last Name</Label>
                                                <Input id="last_name" value={data.last_name} disabled className="bg-gray-100" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" value={data.email} disabled className="bg-gray-100" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Upload Section */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>
                                        <div className="space-y-4">
                                            {/* PSA/NSO Birth Certificate */}
                                            <div>
                                                <Label htmlFor="birth_certificate">PSA/NSO Birth Certificate</Label>
                                                <Input
                                                    id="birth_certificate"
                                                    type="file"
                                                    onChange={(e) => setData('birth_certificate', e.target.files ? e.target.files[0] : null)}
                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-white hover:file:bg-htta-dark-blue"
                                                />
                                                {errors.birth_certificate && <p className="text-sm text-red-600 mt-1">{errors.birth_certificate}</p>}
                                            </div>
                                            {/* Transcript of Records */}
                                            <div>
                                                <Label htmlFor="transcript_of_records">Transcript of Records (TOR) or Form 137</Label>
                                                <Input
                                                    id="transcript_of_records"
                                                    type="file"
                                                    onChange={(e) => setData('transcript_of_records', e.target.files ? e.target.files[0] : null)}
                                                     className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-white hover:file:bg-htta-dark-blue"
                                                />
                                                {errors.transcript_of_records && <p className="text-sm text-red-600 mt-1">{errors.transcript_of_records}</p>}
                                            </div>
                                            {/* Formal Photo */}
                                            <div>
                                                <Label htmlFor="formal_photo">Formal Photo (e.g., Passport or 1x1)</Label>
                                                <Input
                                                    id="formal_photo"
                                                    type="file"
                                                    onChange={(e) => setData('formal_photo', e.target.files ? e.target.files[0] : null)}
                                                     className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-white hover:file:bg-htta-dark-blue"
                                                />
                                                {errors.formal_photo && <p className="text-sm text-red-600 mt-1">{errors.formal_photo}</p>}
                                            </div>
                                            {/* Parent ID */}
                                            <div>
                                                <Label htmlFor="parent_id">Parent/Applicant/Solo Parent ID</Label>
                                                <Input
                                                    id="parent_id"
                                                    type="file"
                                                    onChange={(e) => setData('parent_id', e.target.files ? e.target.files[0] : null)}
                                                     className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-white hover:file:bg-htta-dark-blue"
                                                />
                                                {errors.parent_id && <p className="text-sm text-red-600 mt-1">{errors.parent_id}</p>}
                                            </div>
                                            {/* Marriage Contract (Optional) */}
                                            <div>
                                                <Label htmlFor="marriage_contract">Marriage Contract (if applicable)</Label>
                                                <Input
                                                    id="marriage_contract"
                                                    type="file"
                                                    onChange={(e) => setData('marriage_contract', e.target.files ? e.target.files[0] : null)}
                                                     className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-htta-blue file:text-white hover:file:bg-htta-dark-blue"
                                                />
                                                {errors.marriage_contract && <p className="text-sm text-red-600 mt-1">{errors.marriage_contract}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
