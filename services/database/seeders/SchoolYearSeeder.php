<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['academic_year' => '2023-2024', 'status' => 1],      
        ];

        foreach($data as $value){
            AcademicYear::create($value);
        }
    }
}
