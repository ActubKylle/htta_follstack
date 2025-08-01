<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use App\Models\Learner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentScholarshipController extends Controller
{
    /**
     * Display a listing of scholarships for students.
     */
    public function index()
    {
        $scholarships = Scholarship::where('status', 'Open')
            ->where('application_deadline', '>', now())
            ->orderBy('application_deadline', 'asc')
            ->get();

        // Ensure we always return an array, even if empty
        return Inertia::render('Student/Scholarships/Index', [
            'scholarships' => $scholarships->toArray(),
            
        ]);
    }

    /**
     * Show the application form for a specific scholarship.
     */
    public function showApplicationForm(Scholarship $scholarship)
    {
        // Check if scholarship is still open and deadline hasn't passed
        if ($scholarship->status !== 'Open' || $scholarship->application_deadline <= now()) {
            return redirect()->route('student.scholarships.index')
                ->with('error', 'This scholarship is no longer accepting applications.');
        }

        // Check if user has already applied
        $learner = auth()->user()->learner;
        if ($learner && $scholarship->learners()->where('learners.learner_id', $learner->learner_id)->exists()) {
            return redirect()->route('student.scholarships.index')
                ->with('error', 'You have already applied for this scholarship.');
        }

        return Inertia::render('Student/Scholarships/Apply', [
            'scholarship' => $scholarship,
                 'learner' => $learner, 
                'user' => auth()->user(),

        ]);
    }

    /**
     * Store a scholarship application.
     */
    public function storeApplication(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'birth_certificate' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'transcript_of_records' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'formal_photo' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'parent_id' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'marriage_contract' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $learner = auth()->user()->learner;
        
        if (!$learner) {
            return redirect()->back()->with('error', 'Learner profile not found.');
        }

        // Check if already applied
        if ($scholarship->learners()->where('learners.learner_id', $learner->learner_id)->exists()) {
            return redirect()->back()->with('error', 'You have already applied for this scholarship.');
        }

        // Store uploaded files
        $documents = [];
        $fileFields = ['birth_certificate', 'transcript_of_records', 'formal_photo', 'parent_id', 'marriage_contract'];
        
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $filename = time() . '_' . $field . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('scholarship_documents', $filename, 'public');
                $documents[$field] = $path;
            }
        }

        // Create the application
        $scholarship->learners()->attach($learner->learner_id, [
            'application_date' => now(),
            'status' => 'Pending',
            'documents' => json_encode($documents),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('student.scholarships.index')
            ->with('success', 'Your scholarship application has been submitted successfully!');
    }
}