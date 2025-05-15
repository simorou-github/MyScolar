<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolInscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required','email',
            'password' => 'required','string','min:8','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/','regex:/[@$!%*#?&]/',
            'confirmed',
            'social_reason' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'code_verification' => 'required',
            'location' => 'required',
            'country_id' => 'required|string',
            'city_id' => 'required|string',
            'tel' => 'required',
            'phone_code' => 'required',
            'type' => 'required|string',
            'document' => 'string'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'L\'adresse mail est obligatoire.',
            'password.required' => 'Obligatoire.',
            'password.regex' => 'Veuillez utiliser un mot de passe fort (8 Caractères au moins, Chiffres, Majuscules, Minuscules, Caractères spéciaux comme @-!-#).',
            // 'email.required' => 'L’adresse email est obligatoire.',
            // 'email.email' => 'L’adresse email doit être valide.',
            // 'email.unique' => 'Cet email est déjà utilisé.',
            // 'mot_de_passe.required' => 'Le mot de passe est obligatoire.',
            // 'mot_de_passe.min' => 'Le mot de passe doit contenir au moins :min caractères.',
            'paswword.confirmed' => 'Les mots de passe ne correspondent pas.',
        ];
    }
}
