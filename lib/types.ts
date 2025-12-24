export interface University {
    id: string;
    name: string;
    name_local?: string;
    website_url?: string;
    logo_url?: string;
    country?: string;
    city?: string;
    region?: string;
    ranking_qs?: number;
    ranking_times?: number;
    ranking_national?: number;
    type?: string;
    primary_language?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Program {
    id: string;
    university_id: string;
    name: string;
    degree_type?: string;
    degree_name?: string;
    major_categories?: string[];
    duration_months?: number;
    delivery_mode?: string;
    language?: string;
    scholarship_available: boolean;
    scholarship_notes?: string;
    application_fee_usd?: number;
    admissions_url?: string;
    description?: string;
    program_url?: string;
    university?: University;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}
