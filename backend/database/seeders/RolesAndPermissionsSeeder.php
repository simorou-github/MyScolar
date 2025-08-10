<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Réinitialiser les caches des permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Gestion des utilisateurs
            ['name' => 'create users', 'label' => 'Créer utilisateurs'],
            ['name' => 'edit users', 'label' => 'Modifier utilisateurs'],
            ['name' => 'delete users', 'label' => 'Supprimer utilisateurs'],
            ['name' => 'view users', 'label' => 'Voir utilisateurs'],

            // Gestion des rôles
            ['name' => 'create roles', 'label' => 'Créer rôles'],
            ['name' => 'edit roles', 'label' => 'Modifier rôles'],
            ['name' => 'delete roles', 'label' => 'Supprimer rôles'],
            ['name' => 'view roles', 'label' => 'Voir rôles'],

            // Gestion des permissions
            ['name' => 'edit permissions', 'label' => 'Modifier permissions'],
            ['name' => 'delete permissions', 'label' => 'Supprimer permissions'],
            ['name' => 'view permissions', 'label' => 'Voir permissions'],

            // Gestion des utilisateurs école
            ['name' => 'create school-users', 'label' => 'Créer utilisateurs école'],
            ['name' => 'edit school-users', 'label' => 'Modifier utilisateurs école'],
            ['name' => 'delete school-users', 'label' => 'Supprimer utilisateurs école'],
            ['name' => 'view school-users', 'label' => 'Voir utilisateurs école'],

            // Gestion des groupes
            ['name' => 'create groups', 'label' => 'Créer groupes'],
            ['name' => 'edit groups', 'label' => 'Modifier groupes'],
            ['name' => 'delete groups', 'label' => 'Supprimer groupes'],
            ['name' => 'view groups', 'label' => 'Voir groupes'],

            // Paiement
            ['name' => 'pay', 'label' => 'Effectuer paiements'],

            // Gestion des frais
            ['name' => 'create fees', 'label' => 'Créer frais'],
            ['name' => 'edit fees', 'label' => 'Modifier frais'],
            ['name' => 'delete fees', 'label' => 'Supprimer frais'],
            ['name' => 'view fees', 'label' => 'Voir frais'],

            // Gestion des classes
            ['name' => 'create classes', 'label' => 'Créer classes'],
            ['name' => 'edit classes', 'label' => 'Modifier classes'],
            ['name' => 'delete classes', 'label' => 'Supprimer classes'],
            ['name' => 'view classes', 'label' => 'Voir classes'],

            // Gestion des apprenants
            ['name' => 'create students', 'label' => 'Créer apprenants'],
            ['name' => 'edit students', 'label' => 'Modifier apprenants'],
            ['name' => 'delete students', 'label' => 'Supprimer apprenants'],
            ['name' => 'view students', 'label' => 'Voir apprenants'],

            // Gestion des opérateurs
            ['name' => 'create operators', 'label' => 'Créer opérateurs'],
            ['name' => 'edit operators', 'label' => 'Modifier opérateurs'],
            ['name' => 'delete operators', 'label' => 'Supprimer opérateurs'],
            ['name' => 'view operators', 'label' => 'Voir opérateurs'],


            // Gestion des paramètres système
            ['name' => 'create system-settings', 'label' => 'Créer paramètres système'],
            ['name' => 'view system-settings', 'label' => 'Voir paramètres système'],
            ['name' => 'edit system-settings', 'label' => 'Modifier paramètres système'],

            // Gestion des inscriptions
            ['name' => 'create inscriptions', 'label' => 'Créer inscriptions'],
            ['name' => 'edit inscriptions', 'label' => 'Modifier inscriptions'],
            ['name' => 'delete inscriptions', 'label' => 'Supprimer inscriptions'],
            ['name' => 'treat inscriptions', 'label' => 'Traiter inscriptions'],
            ['name' => 'view inscriptions', 'label' => 'Voir inscriptions'],
        ];

        try {
            DB::beginTransaction();
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission['name'], 'guard_name' => 'api',
            'label' => $permission['label']]);
            }

            // Schoo admin
            $role_school_admin = Role::firstOrCreate(['label' => 'Administrateur Ecole', 'name' => 'school-admin', 'guard_name' => 'api']);
            $role_school_admin->givePermissionTo([
                'create users',
                'edit users',
                'view users',
                'delete users',
                'create groups',
                'edit groups',
                'view groups',
                'delete groups',
                'create fees',
                'edit fees',
                'view fees',
                'delete fees',
                'create students',
                'edit students',
                'view students',
                'delete students',
            ]);


            // Administrateur
            $role_super_admin = Role::firstOrCreate(['label' => 'Super Administrateur', 'name' => 'super-admin', 'guard_name' => 'api']);
            $role_super_admin->syncPermissions(Permission::all());

            Log::info('Rôles et permissions chargées avec succès');
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::info($e);
            Log::error('Erreur lors du chargement des rôles et permissions');
        }
    }
}
