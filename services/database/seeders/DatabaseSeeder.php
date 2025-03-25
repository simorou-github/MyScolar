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
        $this->call([
            ParameterSeeder::class,
            CountrySeeder::class,
            CitySeeder::class,
            SchoolYearSeeder::class,
            TypeFeesSeeder::class,
            TypePaymentSeeder::class,
            ClasseSeeder::class,
            PermissionSeeder::class,
            //RoleSeeder::class,
        ]);
    }
}
