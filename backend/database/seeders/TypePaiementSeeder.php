<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\TypePayment;
use App\Models\User;
use Illuminate\Database\Seeder;

class TypePaiementSeeder extends Seeder
{
    public function run(): void
    {
        if($user = User::first())
        {
            $data = [
                ['label' => 'Mensuel', 
                'description' => 'Paiement Mensuel', 
                'due_date_number' => 9, //Echéance
                'status' => true],   
                ['label' => 'Tirmestre', 
                'description' => 'Paiement Trimestriel' , 
                'due_date_number' => 4, //Echéance
                'status' => true], 
                ['label' => 'Unique', 
                'description' => 'Paiement Unique', 
                'due_date_number' => 1, //Echéance
                'status' => true], 
                ['label' => 'Semestre', 
                'description' => 'Paiement Semestriel', 
                'due_date_number' => 2, //Echéance
                'status' => true]    
            ];
            foreach($data as $value){
                if(!TypePayment::where("label", $value["label"])->first())
                    TypePayment::create($value);
            }
        }
    
    }
}