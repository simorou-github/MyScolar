export interface School {
    id: string,
    ifu?: string,
    social_reason: string,
    email: string,
    location: string,
    owner: string,
    owner_lastname: string,
    owner_firstname: string,
    tel: string,
    status: string,
    country_id: number,
    city_id: number,
    document?: string,
    reject_reason?: string
}
