<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Scholarship extends Model
{
    //
    protected $primaryKey = 'scholarship_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'scholarship_name',
        'provider',
        'description',
        'eligibility_criteria',
        'available_slots',
        'application_deadline',
        'status',
    ];

     public function learners(): BelongsToMany
    {
        return $this->belongsToMany(Learner::class, 'student_scholarships', 'scholarship_id', 'learner_id')
                    ->withPivot('status', 'application_date', 'date_processed', 'remarks')
                    ->withTimestamps();
    }
}
