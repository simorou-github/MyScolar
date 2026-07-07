<?php

namespace App\Services;

use App\Exceptions\ScolarException;
use App\Jobs\EmailScolarTemplateJob;
use App\Models\ParentStudentLink;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentStudentLinkService
{
    /**
     * Recherche d'un apprenant via le triplet : code scolaire + année de naissance + école.
     */
    public function searchStudent(Request $request): Student
    {
        $request->validate([
            'code_scolar' => 'required|string',
            'birth_day'   => 'required|date_format:Y-m-d',
            'school_id'   => 'required|string',
        ]);

        $student = Student::with('school')
            ->where('code_scolar', $request->code_scolar)
            ->where('school_id', $request->school_id)
            ->whereDate('birthday', $request->birth_day)
            ->first();

        if (!$student) {
            throw new ScolarException("Aucun apprenant ne correspond aux informations saisies (code scolaire, date de naissance, école).");
        }

        return $student;
    }

    public function searchSchools(Request $request)
    {
        $params = [];
        if ($request->social_reason) {
            $params[] = ['social_reason', 'LIKE', '%' . $request->social_reason . '%'];
        }
        return School::whereIn('status', ['VALIDE', 'ACTIF'])->where($params)
            ->select('id', 'social_reason', 'location', 'country_id')
            ->orderBy('social_reason')->limit(20)->get();
    }

    public function requestLink(Request $request, string $parentId): ParentStudentLink
    {
        $student = $this->searchStudent($request);

        if (ParentStudentLink::where('parent_id', $parentId)->where('student_id', $student->id)->exists()) {
            throw new ScolarException("Une demande d'association existe déjà pour cet apprenant.");
        }

        $link = ParentStudentLink::create([
            'id' => generateDBTableId(30, ParentStudentLink::class),
            'parent_id' => $parentId,
            'student_id' => $student->id,
            'school_id' => $student->school_id,
            'status' => 'PENDING',
        ]);

        $school = School::find($student->school_id);
        EmailScolarTemplateJob::dispatch(
            [$school->email],
            [
                'student' => $student->last_name . ' ' . $student->first_name,
                'code_scolar' => $student->code_scolar,
                'school' => $school->social_reason,
                'link_id' => $link->id,
            ],
            'emails.parentLinkRequestNotice',
            'Nouvelle demande d\'association Parent-Apprenant',
            env('APP_NAME'),
            'Un parent demande à être associé à un apprenant de votre établissement. Merci de valider ou rejeter cette demande depuis votre espace école.'
        );

        return $link->load('student', 'school');
    }

    public function listLinksForParent(string $parentId)
    {
        return ParentStudentLink::with('student', 'school')
            ->where('parent_id', $parentId)
            ->orderBy('created_at', 'DESC')
            ->get();
    }

    public function listPendingLinksForSchool(?string $schoolId)
    {
        $query = ParentStudentLink::with('student', 'parent_user', 'school')
            ->where('status', 'PENDING')
            ->orderBy('created_at', 'DESC');

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        return $query->get();
    }

    public function listActiveLinksForSchool(?string $schoolId)
    {
        $query = ParentStudentLink::with('student', 'parent_user', 'school')
            ->where('status', 'VALIDE')
            ->orderBy('validated_at', 'DESC');

        if ($schoolId) {
            $query->where('school_id', $schoolId);
        }

        return $query->get();
    }

    public function validateLink(Request $request): ParentStudentLink
    {
        $request->validate(['id' => 'required', 'status' => 'required|in:VALIDE,REJETE']);

        $link = ParentStudentLink::with('student', 'parent_user')->find($request->id);
        if (!$link) {
            throw new ScolarException("Cette demande d'association n'existe plus.");
        }

        $link->update([
            'status' => $request->status,
            'reject_reason' => $request->reject_reason,
            'validated_by' => Auth::guard('api')->id(),
            'validated_at' => now(),
        ]);

        EmailScolarTemplateJob::dispatch(
            $link->parent_user->email,
            [
                'first_name' => $link->parent_user->first_name,
                'student' => $link->student->last_name . ' ' . $link->student->first_name,
                'status' => $request->status,
                'reason' => $request->reject_reason,
            ],
            'emails.parentLinkValidated',
            $request->status === 'VALIDE' ? 'Association apprenant validée' : 'Association apprenant rejetée',
            env('APP_NAME'),
            $request->status === 'VALIDE'
                ? "L'apprenant est désormais visible dans votre Espace Parent."
                : "Votre demande d'association à cet apprenant a été rejetée."
        );

        return $link;
    }
}
