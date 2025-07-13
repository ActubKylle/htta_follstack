<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner; // Import your Learner model
use App\Models\User; // Import User model for updating credentials
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // For hashing passwords
use Illuminate\Support\Str; // For generating random strings (passwords)
use Illuminate\Support\Facades\Mail; // For sending emails
use App\Mail\EnrollmentAccepted; // Assuming you've created this Mailable

class EnrollmentController extends Controller
{
    /**
     * Display the admin enrollment list with recent learner registrations.
     */
    public function index(Request $request)
    {
        // Get filter and search parameters from the request
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Learner::with(['address', 'user', 'courseEnrollments']);

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('email', 'like', '%' . $search . '%');
                  });
            });
        }

        // Apply status filter
        if ($status && in_array($status, ['pending', 'accepted', 'rejected'])) {
            $query->where('enrollment_status', $status);
        }

        $recentLearners = $query->orderBy('created_at', 'desc')
                                ->paginate(10) // Paginate with 10 items per page
                                ->through(function ($learner) {
                                    $courseQualification = $learner->courseEnrollments->first() ? $learner->courseEnrollments->first()->course_qualification : 'N/A';

                                    return [
                                        'learner_id' => $learner->learner_id,
                                        'first_name' => $learner->first_name,
                                        'last_name' => $learner->last_name,
                                        'email' => $learner->user->email ?? 'N/A',
                                        'contact_no' => $learner->address->contact_no ?? 'N/A',
                                        'course_qualification' => $courseQualification,
                                        'created_at' => $learner->created_at,
                                        'enrollment_status' => $learner->enrollment_status,
                                        'address' => $learner->address,
                                        'user' => $learner->user,
                                    ];
                                });

        return Inertia::render('Admin/Enrollments', [
            'recentLearners' => $recentLearners,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Display the specified learner enrollment.
     */
    public function show(Learner $learner) // Using Route Model Binding for Learner
    {
        // Load all necessary relationships for detailed view
        $learner->load([
            'user',
            'address',
            'educationalAttainment',
            'classifications', // If you have a relationship to get classification type names
            'disabilities.disabilityType',
            'courseEnrollments',
            'privacyConsent',
            'registrationSignature'
        ]);

        return Inertia::render('Admin/EnrollmentDetails', [
            'learner' => $learner,
        ]);
    }

    /**
     * Accept a learner's enrollment.
     */
    public function accept(Learner $learner)
    {
        // Prevent re-processing if already accepted or rejected
        if ($learner->enrollment_status !== 'pending') {
            return redirect()->back()->with('error', 'Enrollment has already been processed.');
        }

        // Ensure the learner has an associated user
        if (!$learner->user) {
            return redirect()->back()->with('error', 'No associated user found for this learner.');
        }

        // Generate a random password for the user
        $randomPassword = Str::random(10); // Generates a 10-character random string

        // Update the user's password and role
        $user = $learner->user;
        $user->password = Hash::make($randomPassword);
        $user->role = 'learner'; // Assign the 'learner' role
        $user->save();

        // Update the learner's enrollment status
        $learner->update(['enrollment_status' => 'accepted']);

        // Send email to the student with their new credentials
        try {
            Mail::to($user->email)->send(new EnrollmentAccepted(
                $learner->first_name,
                $learner->last_name,
                $user->email, // Using email as username
                $randomPassword
            ));
            return redirect()->route('admin.enrollments')->with('success', 'Learner accepted and email sent with credentials.');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Failed to send enrollment acceptance email: ' . $e->getMessage());
            return redirect()->route('admin.enrollments')->with('warning', 'Learner accepted, but email sending failed. Please check mail configuration.');
        }
    }

    /**
     * Reject a learner's enrollment.
     */
    public function reject(Learner $learner)
    {
        // Prevent re-processing if already accepted or rejected
        if ($learner->enrollment_status !== 'pending') {
            return redirect()->back()->with('error', 'Enrollment has already been processed.');
        }

        // Update the learner's enrollment status
        $learner->update(['enrollment_status' => 'rejected']);

        // Optionally, you could send a rejection email here if desired.
        // For example: Mail::to($learner->user->email)->send(new EnrollmentRejected($learner->first_name, $learner->last_name));

        return redirect()->route('admin.enrollments')->with('success', 'Learner enrollment rejected.');
    }
}