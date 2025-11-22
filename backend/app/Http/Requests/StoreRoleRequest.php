<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => 'required|string|max:255',
            'guard_name' => 'nullable|string|max:10',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name', 
        ];
    }

    public function messages(): array
    {
        return [
            'label.required' => 'Le rôle est obligatoire.',
            'label.max' => 'La désignation doit contenir au plus 255 caractères.',
            'label.max' => 'La désignation doit être une chaine caractères.',
        ];
    }


}
