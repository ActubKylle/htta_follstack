<?php
// app/Http/Controllers/Staff/ScholarshipController.php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use App\Models\Learner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ScholarshipController extends Controller
{
    /**
     * Display a listing of the scholarships.
     */
    public function index(Request $request)
    {
        $scholarships = Scholarship::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('scholarship_name', 'like', "%{$search}%")
                      ->orWhere('provider', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Staff/Scholarships/Index', [
            'scholarships' => $scholarships,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new scholarship.
     */
    public function create()
    {
        return Inertia::render('Staff/Scholarships/Create');
    }

    /**
     * Store a newly created scholarship in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'scholarship_name' => 'required|string|max:255|unique:scholarships',
            'provider' => 'required|string|max:255',
            'description' => 'nullable|string',
            'eligibility_criteria' => 'required|string',
            'available_slots' => 'required|integer|min:1',
            'application_deadline' => 'required|date|after:today',
            'status' => ['required', Rule::in(['Open', 'Closed', 'Ongoing'])],
        ]);

        Scholarship::create($validated);

        return redirect()->route('staff.scholarships.index')->with('success', 'Scholarship created successfully.');
    }

    /**
     * Display the specified scholarship.
     */
    public function show(Scholarship $scholarship)
    {
        // Eager load applicants with their user details
        $scholarship->load(['learners.user']);

        return Inertia::render('Staff/Scholarships/Show', [
            'scholarship' => $scholarship,
        ]);
    }

    /**
     * Show the form for editing the specified scholarship.
     */
    public function edit(Scholarship $scholarship)
    {
        return Inertia::render('Staff/Scholarships/Edit', [
            'scholarship' => $scholarship,
        ]);
    }

    /**
     * Update the specified scholarship in storage.
     */
    public function update(Request $request, Scholarship $scholarship)
    {
        $validated = $request->validate([
            'scholarship_name' => ['required', 'string', 'max:255', Rule::unique('scholarships')->ignore($scholarship->scholarship_id, 'scholarship_id')],
            'provider' => 'required|string|max:255',
            'description' => 'nullable|string',
            'eligibility_criteria' => 'required|string',
            'available_slots' => 'required|integer|min:1',
            'application_deadline' => 'required|date',
            'status' => ['required', Rule::in(['Open', 'Closed', 'Ongoing'])],
        ]);

        $scholarship->update($validated);

        return redirect()->route('staff.scholarships.index')->with('success', 'Scholarship updated successfully.');
    }

    /**
     * Remove the specified scholarship from storage.
     */
    public function destroy(Scholarship $scholarship)
    {
        $scholarship->delete();
        return redirect()->route('staff.scholarships.index')->with('success', 'Scholarship deleted successfully.');
    }

    /**
     * Update the status of a student's scholarship application.
     */
    public function updateApplicationStatus(Request $request, Scholarship $scholarship, Learner $learner)
    {
        $request->validate([
            'status' => ['required', Rule::in(['Approved', 'Rejected'])],
            'remarks' => 'nullable|string|max:500',
        ]);

        $scholarship->learners()->updateExistingPivot($learner->learner_id, [
            'status' => $request->status,
            'remarks' => $request->remarks,
            'date_processed' => now(),
        ]);
        
        // You can add an email notification to the student here
        // Mail::to($learner->user->email)->send(new ScholarshipStatusUpdated($scholarship, $learner, $request->status));

        return back()->with('success', "Application status updated to {$request->status}.");
    }
}
