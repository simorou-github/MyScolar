<?php

namespace Database\Seeders;

use App\Models\User;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class ScolarAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'id' => generateDBTableId(15, "App\Models\User"),
                'last_name' => 'GANIERO',
                'first_name' => 'Levy',
                'email' => 'florentganiero1@gmail.com',
                'password' => Hash::make("Admin@2025"),
                'email_verified_at' => now(),
                'is_admin' => 1,
                'status' => 1,
                'school_id' => null
            ]);

            $user->assignRole(Role::findByName('school_admin', 'api'));
            $user->assignRole(Role::findByName('admin', 'api'));

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
        }
    }
}
