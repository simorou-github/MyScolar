export interface Classe {
  id: number;
  code: string;
  label: string;
  school_fees: number;
  status: boolean;
}

// Search Data
export interface SearchResult {
  classes: Classe[];
  total: number;
}
