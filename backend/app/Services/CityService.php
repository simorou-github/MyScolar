<?php

namespace App\Services;

use App\Models\City;
use App\Models\Country;

class CityService
{

    public function listCountries()
    {
        $data = Country::orderBy('name', 'asc')->get();
        return $data;
    }

    public function listCities()
    {
        $data = City::orderBy('name', 'asc')->get();
        return $data;
    }

    public function listCitiesByCountry($country_id)
    {
        $data['cities'] = City::where('country_id', $country_id)->orderBy('name', 'asc')->get();
        $data['country_infos'] = Country::where('id', $country_id)->first(['phone_code', 'masking']);
        return $data;
    }
}
