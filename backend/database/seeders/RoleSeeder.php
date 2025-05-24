<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [

            [
                "name" => "super_admin",
                "description" => "Super Administrateur"
            ],

            [
                "name" => "admin",
                "description" => "Administrateur"
            ],

            [
                "name" => "school_admin",
                "description" => "Administrateur Ecole"
            ],

            [
                "name" => "accountant",
                "description" => "Comptable"
            ],

            [
                "name" => "treasurer",
                "description" => "Trésorier"
            ],

        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['name'=>$role['name'], 'guard_name'=> 'api']);
        }
    }
}
