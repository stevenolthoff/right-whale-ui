
const rw_backend_base_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL
    : 'http://localhost:44208'
)!;

const rw_wordpress_base_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_WORDPRESS_BASE_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_WORDPRESS_BASE_URL
    : 'https://right-whale.sites.axds.co'
)!;

const calving_data_csv_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_CALVING_DATA_CSV_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_CALVING_DATA_CSV_URL
    : 'https://docs.google.com/spreadsheets/d/1sE6phYmbohrKgVNUcYop0iaKQmQSuP0i/export?format=csv&id=1sE6phYmbohrKgVNUcYop0iaKQmQSuP0i&gid=1645236033'
)!;

const injury_data_csv_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_INJURY_DATA_CSV_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_INJURY_DATA_CSV_URL
    : 'https://docs.google.com/spreadsheets/d/125C1nTkZx8Jyug0k0oeLpXYPEfRNAdVc/export?format=csv&id=125C1nTkZx8Jyug0k0oeLpXYPEfRNAdVc&gid=548338316'
)!;

const mortality_data_csv_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_MORTALITY_DATA_CSV_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_MORTALITY_DATA_CSV_URL
    : 'https://docs.google.com/spreadsheets/d/1woycECMnrGEivOZUuC_9Ab1OzYI6S04l/export?format=csv&id=1woycECMnrGEivOZUuC_9Ab1OzYI6S04l&gid=2036674639'
)!;

const population_data_csv_url: string = (
    process.env.NEXT_PUBLIC_RWANTHRO_POULATION_DATA_CSV_URL
    ?  process.env.NEXT_PUBLIC_RWANTHRO_POULATION_DATA_CSV_URL
    : 'https://docs.google.com/spreadsheets/d/1YixxdFnB_mr4rUBmIyK_M5wMzqT2RJ8S/export?format=csv&id=1YixxdFnB_mr4rUBmIyK_M5wMzqT2RJ8S&gid=486004420'
)!;


console.log( `RW Backend base URL: ${rw_backend_base_url}`)
console.log( `RW Wordpress base URL: ${rw_wordpress_base_url}`)

export function url_join( base_url: string, path: string ): string {
    return new URL(
        path,
        base_url
    ).href;
}

const uj = url_join;

////////////////////////////////////////////////////////////////////////////////
// Backend/API configs
////////////////////////////////////////////////////////////////////////////////
export interface RWBackendUrlConfigInterface {
    // Base URL (that can be reused elsewhere in app for more dynamic GETs)
    BASE_URL: string,
    // Drying up the unlikely-to-change URLs (won't require parameters)
    ADMIN_URL: string,
    COGNITO_REDIRECT_URL: string,
    ME_URL: string,
};


export const RW_BACKEND_URL_CONFIG: RWBackendUrlConfigInterface = {
    // Base URL
    BASE_URL: rw_backend_base_url,
    // Admin URL
    ADMIN_URL: uj( rw_backend_base_url, '/admin' ),
    // Amazon Cognito Redirect
    COGNITO_REDIRECT_URL: uj( rw_backend_base_url, '/u/accounts/amazon-cognito/login/?process=' ),
    // The 'me' URL
    ME_URL: uj( rw_backend_base_url, '/u/api/v1/me/' ),
};

////////////////////////////////////////////////////////////////////////////////
// External Google sheets / CSV configs
////////////////////////////////////////////////////////////////////////////////
export interface CSVUrlInterface {
    CALVING_DATA_CSV_URL: string,
    INJURY_DATA_CSV_URL: string,
    MORTALITY_DATA_CSV_URL: string,
    POPULATION_DATA_CSV_URL: string,
};

export const RW_CSV_URL_CONFIG: CSVUrlInterface = {
    CALVING_DATA_CSV_URL: calving_data_csv_url,
    INJURY_DATA_CSV_URL: injury_data_csv_url,
    MORTALITY_DATA_CSV_URL: mortality_data_csv_url,
    POPULATION_DATA_CSV_URL: population_data_csv_url,
};

////////////////////////////////////////////////////////////////////////////////
// External Right Whale Wordpress configs
////////////////////////////////////////////////////////////////////////////////
export interface RWWordpressUrlInterface {
    RW_WORDPRESS_BASE_URL: string,
};

export const RW_WORDPRESS_URL_CONFIG: RWWordpressUrlInterface = {
    RW_WORDPRESS_BASE_URL: rw_wordpress_base_url,
};
