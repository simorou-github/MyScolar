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
            ['label' => 'Cours d\'Initiation', 'rank' => 1,'code' => 'CI'],
            ['label' => 'Cours Préparatoire', 'rank' => 2,'code' => 'CP'],
            ['label' => 'Cours Elementaire 1', 'rank' => 3,'code' => 'CE1'],
            ['label' => 'Cours Elementaire 2', 'rank' => 4,'code' => 'CE2'],
            ['label' => 'Cours Moyen 1', 'rank' => 5,'code' => 'CM1'],            
            ['label' => 'Cours Moyen 2', 'rank' => 6,'code' => 'CM2'],            
            ['label' => 'Classe de Sixième', 'rank' => 7,'code' => '6e'],            
            ['label' => 'Classe de Cinquième', 'rank' => 8,'code' => '5e'],            
            ['label' => 'Classe de Quatrième', 'rank' => 9,'code' => '4e'],            
            ['label' => 'Classe de Troisième', 'rank' => 10,'code' => '3e'],            
            ['label' => 'Classe de Seconde', 'rank' => 11,'code' => '2nde'],            
            ['label' => 'Classe de Première', 'rank' => 12,'code' => '1ère'],            
            ['label' => 'Classe de Terminale', 'rank' => 13,'code' => 'Tle']           
        ];

        foreach($data as $value){
            $id = generateDBTableId(5, "App\Models\Classe");
            Classe::create(array_merge($value, ['id' => $id]));
        }
    
    }
}
