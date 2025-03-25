<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);

        Permission::create(['name' => 'view groupe']);
        Permission::create(['name' => 'create groupe']);
        Permission::create(['name' => 'edit groupe']);
        Permission::create(['name' => 'delete groupe']);

        Permission::create(['name' => 'view fees']);
        Permission::create(['name' => 'create fees']);
        Permission::create(['name' => 'edit fees']);
        Permission::create(['name' => 'delete fees']);

        Permission::create(['name' => 'view students']);
        Permission::create(['name' => 'create students']);
        Permission::create(['name' => 'edit students']);
        Permission::create(['name' => 'delete students']);*/
    

        $permissions = [

            [
                "name" => "view_users",
                "description" => "Voir les utilisateurs"
            ],

            [
                "name" => "create_users",
                "description" => "Création d'utilisateurs"
            ],

            [
                "name" => "delete_users",
                "description" => "Suppression d'utilisateurs"
            ],

            [
                "name" => "update_users",
                "description" => "Suppression d'utilisateurs"
            ],

            [
                "name" => "school_space",
                "description" => "Espace Ecole"
            ],

            [
                "name" => "manage_account",
                "description" => "Géstion des transactions"
            ],

        ];
        
        foreach ($permissions as $permission) {
            $_permission = Permission::updateOrCreate(['name'=>$permission['name'], 'description'=>$permission['description']]);
        }
    }
}
