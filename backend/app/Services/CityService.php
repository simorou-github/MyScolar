<?php

namespace App\Services;

use App\Models\City;
use App\Models\Country;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CityService
{

    public function listCountries()
    {
        if($data = Cache::get('countries')){
            return $data;
        }else{
            $data = Country::orderBy('name', 'asc')->get();
            Cache::put('countries', $data, 1296000);
        }
    }

    public function listCities()
    {
        if($data = Cache::get('cities')){
            return $data;
        }else{
            $data = City::orderBy('name', 'asc')->get();
            Cache::put('cities', $data, 1296000);
        }
    }

    public function listCitiesByCountry($country_id)
    {
        $data['cities'] = City::where('country_id', $country_id)->orderBy('name', 'asc')->get();
        $data['country_infos'] = Country::where('id', $country_id)->first(['phone_code', 'masking']);
        return $data;
    }
}
