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
                "label" => "Super Administrateur"
            ],

            [
                "name" => "admin",
                "label" => "Administrateur"
            ],

            [
                "name" => "school_admin",
                "label" => "Administrateur Ecole"
            ],

            [
                "name" => "accountant",
                "label" => "Comptable"
            ],

            [
                "name" => "treasurer",
                "label" => "Trésorier"
            ],

        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['name'=>$role['name'],'label'=>$role['label'], 'guard_name'=> 'api']);
        }
    }
}
