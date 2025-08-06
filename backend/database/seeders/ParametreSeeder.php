<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Parameter;
use App\Models\User;
use Illuminate\Database\Seeder;

class ParametreSeeder extends Seeder
{
    public function run(): void
    {
        if($user = User::first())
        {
            $data = [
                [
                    'id' => generateDBTableId(10, "App\Models\Classe"),
                    'label' => 'TAUX_SCOLAR',
                    'value' => 0.03,
                    'description' => 'TAUX COMMISSION SCOLAR',
                    'status' =>true,
                ]
            ];
            foreach($data as $value){
                if(!Parameter::where("label", $value["label"])->first())
                Parameter::create($value);
            }
        }
    
    }
}