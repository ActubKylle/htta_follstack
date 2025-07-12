import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head } from '@inertiajs/react';

// Define types for Learner and its relationships for the details page
interface DetailedLearnerData {
    learner_id: number;
    entry_date: string;
    last_name: string;
    first_name: string;
    middle_name?: string;
    extension_name?: string;
    gender: string;
    civil_status: string;
    birth_date?: string;
    age?: number;
    birthplace_city_municipality?: string;
    birthplace_province?: string;
    birthplace_region?: string;
    nationality?: string;
    employment_status?: string;
    employment_type?: string;
    parent_guardian_name?: string;
    parent_guardian_mailing_address?: string;
    t2mis_auto_generated: boolean;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    address: {
        address_id: number;
        number_street?: string;
        city_municipality?: string;
        barangay?: string;
        district?: string;
        province?: string;
        region?: string;
        email_address?: string;
        facebook_account?: string;
        contact_no?: string;
    };
    educational_attainment: {
        education_id: number;
        no_grade_completed: boolean;
        elementary_undergraduate: boolean;
        elementary_graduate: boolean;
        junior_high_k12: boolean;
        senior_high_k12: boolean;
        high_school_undergraduate: boolean;
        high_school_graduate: boolean;
        post_secondary_non_tertiary_technical_vocational_undergraduate: boolean;
        post_secondary_non_tertiary_technical_vocational_course_graduate: boolean;
        college_undergraduate: boolean;
        college_graduate: boolean;
        masteral: boolean;
        doctorate: boolean;
    };
    classifications: Array<{
        id: number;
        type: string;
        pivot: {
            learner_id: number;
            classification_id: number;
            other_classification_details?: string;
        };
    }>;
    disabilities: Array<{
        disability_id: number;
        cause_of_disability?: string;
        disability_type: { // Make sure this relationship name matches your Disability model
            id: number;
            name: string;
        };
    }>;
    course_enrollments: Array<{
        enrollment_id: number;
        course_qualification: string;
        scholarship_package?: string;
    }>;
    privacy_consent: {
        consent_id: number;
        consent_given: boolean;
        date_agreed: string;
    };
    registration_signature: {
        signature_id: number;
        applicant_signature_printed_name?: string;
        date_accomplished?: string;
        registrar_signature_printed_name?: string;
        date_received?: string;
        thumbmark_image_path?: string;
        picture_image_path?: string;
    };
}

interface EnrollmentDetailsProps extends PageProps {
    learner: DetailedLearnerData;
}

export default function EnrollmentDetails({ learner }: EnrollmentDetailsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Enrollments',
            href: route('admin.enrollments'),
        },
        {
            title: `${learner.first_name} ${learner.last_name}`,
            href: route('admin.enrollment.show', learner.learner_id),
        },
    ];

    // Helper to render boolean educational attainments
    const renderEducationalAttainment = (edu: DetailedLearnerData['educational_attainment']) => {
        const attainmentLevels = [];
        for (const key in edu) {
            if (key !== 'education_id' && key !== 'learner_id' && typeof edu[key as keyof typeof edu] === 'boolean' && edu[key as keyof typeof edu]) {
                // Format the key to be more readable (e.g., 'elementary_graduate' -> 'Elementary Graduate')
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
                attainmentLevels.push(formattedKey);
            }
        }
        return attainmentLevels.length > 0 ? attainmentLevels.join(', ') : 'No educational attainment specified.';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Enrollment: ${learner.first_name} ${learner.last_name}`} />

            <div className="bg-dark p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-htta-blue mb-6 border-b-2 border-htta-gold pb-3">
                    Enrollment Details for {learner.first_name} {learner.last_name}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Personal Information</h3>
                        <p><strong>Full Name:</strong> {learner.first_name} {learner.middle_name} {learner.last_name} {learner.extension_name}</p>
                        <p><strong>Gender:</strong> {learner.gender}</p>
                        <p><strong>Civil Status:</strong> {learner.civil_status}</p>
                        <p><strong>Birth Date:</strong> {learner.birth_date ? new Date(learner.birth_date).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Age:</strong> {learner.age}</p>
                        <p><strong>Birthplace:</strong> {learner.birthplace_city_municipality}, {learner.birthplace_province}, {learner.birthplace_region}</p>
                        <p><strong>Nationality:</strong> {learner.nationality}</p>
                        <p><strong>Employment Status:</strong> {learner.employment_status} {learner.employment_type ? `(${learner.employment_type})` : ''}</p>
                        <p><strong>Parent/Guardian:</strong> {learner.parent_guardian_name}</p>
                        <p><strong>Parent/Guardian Address:</strong> {learner.parent_guardian_mailing_address}</p>
                    </div>

                    {/* Contact & Address Information */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Contact & Address</h3>
                        <p><strong>Email:</strong> {learner.user?.email}</p>
                        <p><strong>Contact No:</strong> {learner.address?.contact_no}</p>
                        <p><strong>Facebook:</strong> {learner.address?.facebook_account}</p>
                        <p><strong>Address:</strong> {learner.address?.number_street}, {learner.address?.barangay}, {learner.address?.city_municipality}, {learner.address?.district}, {learner.address?.province}, {learner.address?.region}</p>
                    </div>

                    {/* Educational Attainment */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Educational Attainment</h3>
                        {learner.educational_attainment ? (
                            <p>{renderEducationalAttainment(learner.educational_attainment)}</p>
                        ) : (
                            <p>No educational attainment provided.</p>
                        )}
                    </div>

                    {/* Classifications */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Classifications</h3>
                        {learner.classifications && learner.classifications.length > 0 ? (
                            <ul>
                                {learner.classifications.map((cls, index) => (
                                    <li key={index}>
                                        {cls.type}
                                        {cls.pivot?.other_classification_details && ` (${cls.pivot.other_classification_details})`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No classifications specified.</p>
                        )}
                    </div>

                    {/* Disabilities */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Disabilities</h3>
                        {learner.disabilities && learner.disabilities.length > 0 ? (
                            <ul>
                                {learner.disabilities.map((dis, index) => (
                                    <li key={index}>
                                        {dis.disability_type?.name} {dis.cause_of_disability ? `(${dis.cause_of_disability})` : ''}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No disabilities reported.</p>
                        )}
                    </div>

                    {/* Course Enrollment */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Course Enrollment</h3>
                        {learner.course_enrollments && learner.course_enrollments.length > 0 ? (
                            <p><strong>Course:</strong> {learner.course_enrollments[0].course_qualification} {learner.course_enrollments[0].scholarship_package ? `(${learner.course_enrollments[0].scholarship_package})` : ''}</p>
                        ) : (
                            <p>No course enrollment found.</p>
                        )}
                    </div>

                    {/* Privacy Consent & Signatures */}
                    <div>
                        <h3 className="text-xl font-bold text-htta-blue mb-4">Consent & Signatures</h3>
                        <p><strong>Privacy Consent Given:</strong> {learner.privacy_consent?.consent_given ? 'Yes' : 'No'}</p>
                        <p><strong>Consent Date:</strong> {learner.privacy_consent?.date_agreed ? new Date(learner.privacy_consent.date_agreed).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Applicant Name:</strong> {learner.registration_signature?.applicant_signature_printed_name}</p>
                        <p><strong>Date Accomplished:</strong> {learner.registration_signature?.date_accomplished ? new Date(learner.registration_signature.date_accomplished).toLocaleDateString() : 'N/A'}</p>
                        {learner.registration_signature?.thumbmark_image_path && (
                            <p><strong>Thumbmark:</strong> <img src={`/${learner.registration_signature.thumbmark_image_path}`} alt="Thumbmark" className="w-24 h-24 object-contain mt-2" /></p>
                        )}
                        {learner.registration_signature?.picture_image_path && (
                            <p><strong>Picture:</strong> <img src={`/${learner.registration_signature.picture_image_path}`} alt="Picture" className="w-24 h-24 object-contain mt-2" /></p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}