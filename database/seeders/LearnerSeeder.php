<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Learner;
use App\Models\Classification;
use App\Models\DisabilityType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LearnerSeeder extends Seeder
{
    public function run(): void
    {
        $learners = [
            // 1. Original John Doe
            [
                'user' => [
                    'email' => 'john.doe@example.com',
                    'name' => 'John Doe',
                    'password' => 'password',
                ],
                'learner' => [
                    'entry_date' => '2024-01-15',
                    'last_name' => 'Doe',
                    'first_name' => 'John',
                    'middle_name' => 'M.',
                    'extension_name' => null,
                    'gender' => 'Male',
                    'civil_status' => 'Single',
                    'birth_date' => '2000-05-20',
                    'age' => 24,
                    'birthplace_city_municipality' => 'Cagayan de Oro',
                    'birthplace_province' => 'Misamis Oriental',
                    'birthplace_region' => 'Northern Mindanao',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Unemployed',
                    'parent_guardian_name' => 'Jane Doe',
                    'parent_guardian_mailing_address' => '123 Main St, Cagayan de Oro City',
                ],
                'course' => 'Shielded Metal Arc Welding NC II',
                'scholarship' => 'TWSP',
                'classifications' => [
                    ['type' => '4Ps Beneficiary'],
                    ['type' => 'Others', 'details' => 'Indigenous Person']
                ],
                'disabilities' => [
                    ['name' => 'Visual Disability', 'cause' => 'Congenital'],
                    ['name' => 'Hearing Disability', 'cause' => 'Illness']
                ]
            ],

            // 2. Kylle Nichole
            [
                'user' => [
                    'email' => 'kyllenichole123@gmail.com',
                    'name' => 'Kylle Nichole Reyes',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-02-20',
                    'last_name' => 'Reyes',
                    'first_name' => 'Kylle Nichole',
                    'middle_name' => 'B.',
                    'extension_name' => null,
                    'gender' => 'Female',
                    'civil_status' => 'Single',
                    'birth_date' => '2002-11-15',
                    'age' => 21,
                    'birthplace_city_municipality' => 'Manila',
                    'birthplace_province' => 'Metro Manila',
                    'birthplace_region' => 'NCR',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Part-time',
                    'parent_guardian_name' => 'Maria Reyes',
                    'parent_guardian_mailing_address' => '456 Pine St, Quezon City',
                ],
                'course' => 'Bread and Pastry Production NC II',
                'scholarship' => 'TESDA Women\'s Center',
                'classifications' => [
                    ['type' => 'PWD']
                ],
                'disabilities' => []
            ],

            // 3. Miguel Santos - OFW returnee
            [
                'user' => [
                    'email' => 'miguel.santos@example.com',
                    'name' => 'Miguel Santos',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-03-10',
                    'last_name' => 'Santos',
                    'first_name' => 'Miguel',
                    'middle_name' => 'C.',
                    'extension_name' => 'Jr.',
                    'gender' => 'Male',
                    'civil_status' => 'Married',
                    'birth_date' => '1985-08-12',
                    'age' => 38,
                    'birthplace_city_municipality' => 'Davao City',
                    'birthplace_province' => 'Davao del Sur',
                    'birthplace_region' => 'Davao Region',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Unemployed',
                    'parent_guardian_name' => 'Lourdes Santos',
                    'parent_guardian_mailing_address' => '789 Palm St, Davao City',
                ],
                'course' => 'Housekeeping NC II',
                'scholarship' => 'OFW Reintegration Program',
                'classifications' => [
                    ['type' => 'OFW Returnee'],
                    ['type' => 'Others', 'details' => 'Displaced Worker']
                ],
                'disabilities' => []
            ],

            // 4. Aisha Mohammad - Muslim learner
            [
                'user' => [
                    'email' => 'aisha.mohammad@example.com',
                    'name' => 'Aisha Mohammad',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-01-05',
                    'last_name' => 'Mohammad',
                    'first_name' => 'Aisha',
                    'middle_name' => 'D.',
                    'extension_name' => null,
                    'gender' => 'Female',
                    'civil_status' => 'Single',
                    'birth_date' => '1998-04-25',
                    'age' => 26,
                    'birthplace_city_municipality' => 'Marawi City',
                    'birthplace_province' => 'Lanao del Sur',
                    'birthplace_region' => 'Bangsamoro',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Unemployed',
                    'parent_guardian_name' => 'Fatima Mohammad',
                    'parent_guardian_mailing_address' => '321 Cedar St, Marawi City',
                ],
                'course' => 'Dressmaking NC II',
                'scholarship' => 'Special Program for Muslim Filipinos',
                'classifications' => [
                    ['type' => 'Indigenous People'],
                    ['type' => 'Others', 'details' => 'From Conflict Area']
                ],
                'disabilities' => []
            ],

            // 5. Carlos Lim - Senior citizen
            [
                'user' => [
                    'email' => 'carlos.lim@example.com',
                    'name' => 'Carlos Lim',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-02-28',
                    'last_name' => 'Lim',
                    'first_name' => 'Carlos',
                    'middle_name' => 'T.',
                    'extension_name' => null,
                    'gender' => 'Male',
                    'civil_status' => 'Widowed',
                    'birth_date' => '1960-07-30',
                    'age' => 63,
                    'birthplace_city_municipality' => 'Cebu City',
                    'birthplace_province' => 'Cebu',
                    'birthplace_region' => 'Central Visayas',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Retired',
                    'parent_guardian_name' => 'N/A',
                    'parent_guardian_mailing_address' => '1010 Acacia St, Cebu City',
                ],
                'course' => 'Massage Therapy NC II',
                'scholarship' => 'Senior Citizen Program',
                'classifications' => [
                    ['type' => 'Senior Citizen']
                ],
                'disabilities' => [
                    ['name' => 'Orthopedic Disability', 'cause' => 'Age-related']
                ]
            ],

            // 6. Sofia Dela Cruz - Solo parent
            [
                'user' => [
                    'email' => 'sofia.delacruz@example.com',
                    'name' => 'Sofia Dela Cruz',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-03-15',
                    'last_name' => 'Dela Cruz',
                    'first_name' => 'Sofia',
                    'middle_name' => 'G.',
                    'extension_name' => null,
                    'gender' => 'Female',
                    'civil_status' => 'Single',
                    'birth_date' => '1992-09-18',
                    'age' => 31,
                    'birthplace_city_municipality' => 'Iloilo City',
                    'birthplace_province' => 'Iloilo',
                    'birthplace_region' => 'Western Visayas',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Self-employed',
                    'parent_guardian_name' => 'N/A',
                    'parent_guardian_mailing_address' => '555 Narra St, Iloilo City',
                ],
                'course' => 'Food Processing NC II',
                'scholarship' => 'Solo Parent Program',
                'classifications' => [
                    ['type' => 'Solo Parent']
                ],
                'disabilities' => []
            ],

            // 7. Juan Tamad - Youth with special case
            [
                'user' => [
                    'email' => 'juan.tamad@example.com',
                    'name' => 'Juan Tamad',
                    'password' => 'password123',
                ],
                'learner' => [
                    'entry_date' => '2024-01-30',
                    'last_name' => 'Tamad',
                    'first_name' => 'Juan',
                    'middle_name' => 'L.',
                    'extension_name' => null,
                    'gender' => 'Male',
                    'civil_status' => 'Single',
                    'birth_date' => '2006-12-05',
                    'age' => 17,
                    'birthplace_city_municipality' => 'Tondo',
                    'birthplace_province' => 'Manila',
                    'birthplace_region' => 'NCR',
                    'nationality' => 'Filipino',
                    'employment_status' => 'Unemployed',
                    'parent_guardian_name' => 'Maria Tamad',
                    'parent_guardian_mailing_address' => '777 Mahogany St, Tondo, Manila',
                ],
                'course' => 'Computer Systems Servicing NC II',
                'scholarship' => 'Youth Program',
                'classifications' => [
                    ['type' => 'Out-of-School Youth'],
                    ['type' => 'Others', 'details' => 'At-risk Youth']
                ],
                'disabilities' => [
                    ['name' => 'Learning Disability', 'cause' => 'Developmental']
                ]
            ]
        ];

        foreach ($learners as $learnerData) {
            $user = User::firstOrCreate(
                ['email' => $learnerData['user']['email']],
                [
                    'name' => $learnerData['user']['name'],
                    'password' => Hash::make($learnerData['user']['password']),
                    'role' => 'learner',
                    'email_verified_at' => now(),
                ]
            );

            $learner = Learner::firstOrCreate(
                ['user_id' => $user->id],
                array_merge($learnerData['learner'], [
                    't2mis_auto_generated' => true,
                ])
            );

            // Create LearnerAddress
            $learner->address()->updateOrCreate(
                ['learner_id' => $learner->learner_id],
                [
                    'number_street' => $this->generateAddress($learnerData['learner']['last_name']),
                    'city_municipality' => $learnerData['learner']['birthplace_city_municipality'],
                    'barangay' => $this->generateBarangay(),
                    'district' => $this->generateDistrict(),
                    'province' => $learnerData['learner']['birthplace_province'],
                    'region' => $learnerData['learner']['birthplace_region'],
                    'email_address' => $learnerData['user']['email'],
                    'facebook_account' => 'https://facebook.com/'.Str::slug($learnerData['user']['name']),
                    'contact_no' => '09'.mt_rand(100000000, 999999999),
                ]
            );

            // Create EducationalAttainment
            $this->createEducationalAttainment($learner, $learnerData['learner']);

            // Create Classifications
            $learner->classifications()->detach();
            foreach ($learnerData['classifications'] as $classification) {
                $classificationModel = Classification::firstOrCreate(['type' => $classification['type']]);
                DB::table('learner_classifications')->insert([
                    'learner_id' => $learner->learner_id,
                    'classification_id' => $classificationModel->id,
                    'other_classification_details' => $classification['details'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Create Disabilities
            $learner->disabilities()->delete();
            foreach ($learnerData['disabilities'] as $disability) {
                $disabilityType = DisabilityType::firstOrCreate(['name' => $disability['name']]);
                $learner->disabilities()->create([
                    'disability_type_id' => $disabilityType->id,
                    'cause_of_disability' => $disability['cause'],
                ]);
            }

            // Create CourseEnrollment
            $learner->courseEnrollments()->updateOrCreate(
                ['learner_id' => $learner->learner_id],
                [
                    'course_qualification' => $learnerData['course'],
                    'scholarship_package' => $learnerData['scholarship'],
                ]
            );

            // Create PrivacyConsent
            $learner->privacyConsent()->updateOrCreate(
                ['learner_id' => $learner->learner_id],
                [
                    'consent_given' => true,
                    'date_agreed' => now()->toDateString(),
                ]
            );

            // Create RegistrationSignature
            $learner->registrationSignature()->updateOrCreate(
                ['learner_id' => $learner->learner_id],
                [
                    'applicant_signature_printed_name' => $learnerData['user']['name'],
                    'date_accomplished' => now()->toDateString(),
                    'thumbmark_image_path' => 'storage/thumbmarks/dummy_thumbmark.png',
                    'picture_image_path' => 'storage/pictures/dummy_picture.jpg',
                ]
            );
        }

        $this->command->info('Successfully created '.count($learners).' dummy learners!');
    }

    protected function generateAddress($lastName): string
    {
        $streets = ['Oak', 'Pine', 'Maple', 'Acacia', 'Narra', 'Mahogany', 'Palm'];
        $numbers = ['123', '456', '789', '1010', '555', '777', '888'];
        $types = ['St', 'Ave', 'Rd', 'Blvd'];
        
        return $numbers[array_rand($numbers)].' '.$streets[array_rand($streets)].' '.$types[array_rand($types)];
    }

    protected function generateBarangay(): string
    {
        $barangays = [
            'Kauswagan', 'Kamuning', 'Poblacion', 'San Roque', 'Sta. Cruz', 
            'San Isidro', 'San Antonio', 'Sta. Maria', 'San Jose', 'San Miguel'
        ];
        return $barangays[array_rand($barangays)];
    }

    protected function generateDistrict(): string
    {
        $districts = ['1st District', '2nd District', '3rd District', '4th District', '5th District'];
        return $districts[array_rand($districts)];
    }

    protected function createEducationalAttainment($learner, $learnerData): void
    {
        $isYouth = isset($learnerData['age']) && $learnerData['age'] < 25;
        $isSenior = isset($learnerData['age']) && $learnerData['age'] > 60;

        $learner->educationalAttainment()->updateOrCreate(
            ['learner_id' => $learner->learner_id],
            [
                'no_grade_completed' => false,
                'elementary_undergraduate' => false,
                'elementary_graduate' => true,
                'junior_high_k12' => $isYouth,
                'senior_high_k12' => $isYouth,
                'high_school_undergraduate' => false,
                'high_school_graduate' => !$isYouth,
                'post_secondary_non_tertiary_technical_vocational_undergraduate' => false,
                'post_secondary_non_tertiary_technical_vocational_course_graduate' => !$isYouth && !$isSenior,
                'college_undergraduate' => !$isYouth && !$isSenior,
                'college_graduate' => false,
                'masteral' => false,
                'doctorate' => false,
            ]
        );
    }
}