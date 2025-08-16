<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(
            [
                CountrySeeder::class,
                CitySeeder::class,
                ClasseSeeder::class,
                //RoleSeeder::class,
                //ScolarAdminSeeder::class,
                CurrentAcademicYearSeeder::class,
                TypePaiementSeeder::class,
                ParametreSeeder::class,
            ]
        );
    }
}
