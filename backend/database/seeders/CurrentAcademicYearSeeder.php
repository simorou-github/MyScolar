<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AcademicYear;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class CurrentAcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        if($user = User::first())
        {
            $data = [
                'academic_year' => date('Y').'-'.date('Y')+1,
                'create_id' => $user->id,
                'status' => true    
            ];

            if(!$ac= AcademicYear::where("academic_year", $data["academic_year"])->first())
                AcademicYear::create($data);
        }
    
    }
}