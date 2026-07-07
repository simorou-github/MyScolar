export interface PhoneCountry {
  code: string;
  name: string;
  dialCode: string;
  mask: string; // '#' = chiffre obligatoire
}

export function getFlagEmoji(countryCode: string): string {
  return countryCode.toUpperCase().replace(/./g, (char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}

export function applyPhoneMask(digits: string, mask: string): string {
  let result = '';
  let di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    if (mask[i] === '#') { result += digits[di++]; }
    else { result += mask[i]; }
  }
  return result;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  // Afrique de l'Ouest
  { code: 'BJ', name: 'Bénin',             dialCode: '+229', mask: '## ## ## ## ##' },
  { code: 'BF', name: 'Burkina Faso',       dialCode: '+226', mask: '## ## ## ##' },
  { code: 'CI', name: "Côte d'Ivoire",      dialCode: '+225', mask: '## ## ## ## ##' },
  { code: 'GH', name: 'Ghana',              dialCode: '+233', mask: '## ### ####' },
  { code: 'GM', name: 'Gambie',             dialCode: '+220', mask: '### ####' },
  { code: 'GN', name: 'Guinée',             dialCode: '+224', mask: '### ## ## ##' },
  { code: 'GW', name: 'Guinée-Bissau',      dialCode: '+245', mask: '### ####' },
  { code: 'LR', name: 'Libéria',            dialCode: '+231', mask: '## ### ####' },
  { code: 'ML', name: 'Mali',               dialCode: '+223', mask: '## ## ## ##' },
  { code: 'MR', name: 'Mauritanie',         dialCode: '+222', mask: '## ## ## ##' },
  { code: 'NE', name: 'Niger',              dialCode: '+227', mask: '## ## ## ##' },
  { code: 'NG', name: 'Nigéria',            dialCode: '+234', mask: '### ### ####' },
  { code: 'SL', name: 'Sierra Leone',       dialCode: '+232', mask: '## ######' },
  { code: 'SN', name: 'Sénégal',            dialCode: '+221', mask: '## ### ## ##' },
  { code: 'TG', name: 'Togo',               dialCode: '+228', mask: '## ## ## ##' },
  // Afrique centrale
  { code: 'CM', name: 'Cameroun',           dialCode: '+237', mask: '## ## ## ##' },
  { code: 'CD', name: 'Congo-Kinshasa',     dialCode: '+243', mask: '### ### ###' },
  { code: 'CG', name: 'Congo-Brazzaville',  dialCode: '+242', mask: '## ### ####' },
  { code: 'GA', name: 'Gabon',              dialCode: '+241', mask: '## ## ## ##' },
  { code: 'TD', name: 'Tchad',              dialCode: '+235', mask: '## ## ## ##' },
  { code: 'CF', name: 'Centrafrique',       dialCode: '+236', mask: '## ## ## ##' },
  { code: 'GQ', name: 'Guinée équatoriale', dialCode: '+240', mask: '### ### ###' },
  // Afrique de l'Est
  { code: 'ET', name: 'Éthiopie',           dialCode: '+251', mask: '## ### ####' },
  { code: 'KE', name: 'Kenya',              dialCode: '+254', mask: '### ### ###' },
  { code: 'RW', name: 'Rwanda',             dialCode: '+250', mask: '### ### ###' },
  { code: 'TZ', name: 'Tanzanie',           dialCode: '+255', mask: '### ### ###' },
  { code: 'UG', name: 'Ouganda',            dialCode: '+256', mask: '### ### ###' },
  { code: 'MZ', name: 'Mozambique',         dialCode: '+258', mask: '## ### ####' },
  // Afrique du Nord
  { code: 'DZ', name: 'Algérie',            dialCode: '+213', mask: '### ## ## ##' },
  { code: 'EG', name: 'Égypte',             dialCode: '+20',  mask: '### ### ####' },
  { code: 'MA', name: 'Maroc',              dialCode: '+212', mask: '## ## ## ## ##' },
  { code: 'TN', name: 'Tunisie',            dialCode: '+216', mask: '## ### ###' },
  { code: 'LY', name: 'Libye',              dialCode: '+218', mask: '### ## ####' },
  // Afrique australe
  { code: 'ZA', name: 'Afrique du Sud',     dialCode: '+27',  mask: '## ### ####' },
  { code: 'AO', name: 'Angola',             dialCode: '+244', mask: '### ### ###' },
  { code: 'MG', name: 'Madagascar',         dialCode: '+261', mask: '## ## ### ##' },
  { code: 'MU', name: 'Maurice',            dialCode: '+230', mask: '#### ####' },
  { code: 'SC', name: 'Seychelles',         dialCode: '+248', mask: '# ### ###' },
  // Europe
  { code: 'FR', name: 'France',             dialCode: '+33',  mask: '# ## ## ## ##' },
  { code: 'BE', name: 'Belgique',           dialCode: '+32',  mask: '### ## ## ##' },
  { code: 'DE', name: 'Allemagne',          dialCode: '+49',  mask: '### ## ## ####' },
  { code: 'GB', name: 'Royaume-Uni',        dialCode: '+44',  mask: '#### ### ###' },
  { code: 'IT', name: 'Italie',             dialCode: '+39',  mask: '### ### ####' },
  { code: 'PT', name: 'Portugal',           dialCode: '+351', mask: '### ### ###' },
  { code: 'ES', name: 'Espagne',            dialCode: '+34',  mask: '### ### ###' },
  { code: 'CH', name: 'Suisse',             dialCode: '+41',  mask: '## ### ## ##' },
  // Amériques
  { code: 'US', name: 'États-Unis',         dialCode: '+1',   mask: '### ### ####' },
  { code: 'CA', name: 'Canada',             dialCode: '+1',   mask: '### ### ####' },
  { code: 'BR', name: 'Brésil',             dialCode: '+55',  mask: '## ##### ####' },
  // Asie / Moyen-Orient
  { code: 'CN', name: 'Chine',              dialCode: '+86',  mask: '### #### ####' },
  { code: 'IN', name: 'Inde',               dialCode: '+91',  mask: '##### #####' },
  { code: 'TR', name: 'Turquie',            dialCode: '+90',  mask: '### ### ####' },
  { code: 'AE', name: 'Émirats arabes unis',dialCode: '+971', mask: '## ### ####' },
  { code: 'SA', name: 'Arabie saoudite',    dialCode: '+966', mask: '## ### ####' },
];
