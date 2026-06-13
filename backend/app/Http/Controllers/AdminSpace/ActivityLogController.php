<?php

namespace App\Http\Controllers\AdminSpace;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('causer')
            ->orderBy('created_at', 'desc');

        if ($request->filled('log_name')) {
            $query->where('log_name', $request->log_name);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->limit(500)->get();

        // Filtre utilisateur (post-query pour simplifier le morph)
        if ($request->filled('causer_name')) {
            $needle = strtolower($request->causer_name);
            $logs = $logs->filter(function ($log) use ($needle) {
                if (!$log->causer) return false;
                $full = strtolower(
                    ($log->causer->last_name ?? '') . ' ' .
                    ($log->causer->first_name ?? '')
                );
                $email = strtolower($log->causer->email ?? '');
                return str_contains($full, $needle) || str_contains($email, $needle);
            })->values();
        }

        return response()->json([
            'status'  => 200,
            'data'    => $logs,
            'message' => 'Journal d\'activité',
        ]);
    }

    public function logNames()
    {
        $names = Activity::distinct()
            ->whereNotNull('log_name')
            ->orderBy('log_name')
            ->pluck('log_name')
            ->values();

        return response()->json([
            'status' => 200,
            'data'   => $names,
        ]);
    }
}
