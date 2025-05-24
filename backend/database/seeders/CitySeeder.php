<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['name' => 'Cotonou', 'country_id' => 1],
            ['name' => 'Porto', 'country_id' => 1],
            ['name' => 'Djougou', 'country_id' => 1],
            ['name' => 'Abomey', 'country_id' => 1],
            ['name' => 'Ouidah', 'country_id' => 1],
            ['name' => 'Lomé', 'country_id' => 2],
            ['name' => 'Kara', 'country_id' => 2],
            ['name' => 'Aného', 'country_id' => 2],
        ];

        foreach($cities as $city){
            City::create($city);
        }
    }
}
