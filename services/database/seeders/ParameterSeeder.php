<?php

namespace Database\Seeders;

use App\Models\Parameter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academic_year = [    
            'label' => 'scolar_rate',
            'value' => 0.012,
            'status' => 1
        ];
        Parameter::create($academic_year);
    }
}
