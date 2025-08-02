<?php

namespace Database\Seeders;

use App\Models\Classe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClasseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $data = [
            ['label' => 'Maternelle 1', 'rank' => 1,'code' => 'M1'],
            ['label' => 'Maternelle 2', 'rank' => 2,'code' => 'M2'],
            ['label' => 'Cours d\'Initiation', 'rank' => 3,'code' => 'CI'],
            ['label' => 'Cours Préparatoire', 'rank' => 4,'code' => 'CP'],
            ['label' => 'Cours Elementaire 1', 'rank' => 5,'code' => 'CE1'],
            ['label' => 'Cours Elementaire 2', 'rank' => 6,'code' => 'CE2'],
            ['label' => 'Cours Moyen 1', 'rank' => 7,'code' => 'CM1'],            
            ['label' => 'Cours Moyen 2', 'rank' => 8,'code' => 'CM2'],            
            ['label' => 'Classe de Sixième', 'rank' => 9,'code' => '6e'],            
            ['label' => 'Classe de Cinquième', 'rank' => 10,'code' => '5e'],            
            ['label' => 'Classe de Quatrième', 'rank' => 11,'code' => '4e'],            
            ['label' => 'Classe de Troisième', 'rank' => 12,'code' => '3e'],            
            ['label' => 'Classe de Seconde', 'rank' => 13,'code' => '2nde'],            
            ['label' => 'Classe de Première', 'rank' => 14,'code' => '1ère'],            
            ['label' => 'Classe de Terminale', 'rank' => 15,'code' => 'Tle']           
        ];

        foreach($data as $value){
            $id = generateDBTableId(5, "App\Models\Classe");
            if(! Classe::where('code', $value['code'])->first() && ! Classe::where('label', $value['label'])->first())
                Classe::create(array_merge($value, ['id' => $id]));
        }
    
    }
}
