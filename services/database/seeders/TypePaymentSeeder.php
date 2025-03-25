<?php

namespace Database\Seeders;

use App\Models\TypePayment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypePaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['label' => 'Unique', 'description' => '', 'due_date_number' => 1],
            ['label' => 'Mois', 'description' => '', 'due_date_number' => 9],
            ['label' => 'Trimestre', 'description' => '', 'due_date_number' => 3],
            ['label' => 'Tranche', 'description' => '', 'due_date_number' => 3]            
        ];

        foreach($data as $value){
            TypePayment::create($value);
        }
    }
}
