<?php

namespace Database\Seeders;

use App\Models\TypeFees;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeFeesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [          
        ];

        foreach($data as $value){
            $id = generateDBTableId(5, "App\Models\TypeFees");
            TypeFees::create(array_merge($value, ['id' => $id]));
        }
    }
}
