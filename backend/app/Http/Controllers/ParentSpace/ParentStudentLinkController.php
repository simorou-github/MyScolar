<?php

namespace App\Http\Controllers\ParentSpace;

use App\Http\Controllers\Controller;
use App\Services\ParentStudentLinkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentStudentLinkController extends Controller
{
    public function __construct(protected ParentStudentLinkService $service)
    {
    }

    // Recherche publique d'écoles pour le formulaire d'association (autocomplete)
    public function searchSchools(Request $request)
    {
        return response()->json(['data' => $this->service->searchSchools($request), 'status' => 200]);
    }

    // Espace Parent : recherche d'un apprenant par triplet code/année naissance/école
    public function searchStudent(Request $request)
    {
        $student = $this->service->searchStudent($request);
        return response()->json(['data' => $student, 'status' => 200]);
    }

    // Espace Parent : demande d'association
    public function requestLink(Request $request)
    {
        $parentId = Auth::guard('parent-api')->id();
        $link = $this->service->requestLink($request, $parentId);
        return response()->json([
            'data' => $link,
            'message' => "Votre demande d'association a été envoyée à l'école. Vous serez notifié une fois la demande traitée.",
            'status' => 201,
        ], 201);
    }

    // Espace Parent : liste des associations (en attente, validées, rejetées)
    public function listMyLinks()
    {
        $parentId = Auth::guard('parent-api')->id();
        return response()->json(['data' => $this->service->listLinksForParent($parentId), 'status' => 200]);
    }

    // Espace École : liste des demandes en attente pour son établissement
    public function listPendingForSchool(Request $request)
    {
        $schoolId = $request->school_id ?? Auth::guard('api')->user()?->school_id;
        return response()->json(['data' => $this->service->listPendingLinksForSchool($schoolId), 'status' => 200]);
    }

    // Espace École / Admin : liste des liaisons validées
    public function listActiveForSchool(Request $request)
    {
        $schoolId = $request->school_id ?? Auth::guard('api')->user()?->school_id;
        return response()->json(['data' => $this->service->listActiveLinksForSchool($schoolId), 'status' => 200]);
    }

    // Espace École : validation / rejet d'une demande d'association
    public function validateLink(Request $request)
    {
        $link = $this->service->validateLink($request);
        return response()->json(['data' => $link, 'message' => 'Demande traitée avec succès.', 'status' => 200]);
    }
}
