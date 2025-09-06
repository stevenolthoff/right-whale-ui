# Right Whale Portal

The Right Whale Portal is a web application designed to centralize and visualize critical data for North Atlantic Right Whale conservation. It provides interactive access to sightings, injury reports, entanglement cases, and population statistics.

## Features

*   **Comprehensive Data Aggregation:** Integrates diverse datasets including population estimates, calving events, injury reports (entanglement, vessel strike, unknown/other), and mortality records into a single platform.
*   **Interactive Visualizations:** Offers dynamic charts and graphs to explore trends in whale health, population dynamics, and anthropogenic impacts over time.
    *   **Public Charts:** Accessible to all users, providing high-level overviews of population, calving, injury totals, and mortality by country and cause of death.
    *   **Monitoring Dashboards (Permissioned):** For authorized field teams and managers, offering near real-time data on active monitoring cases and unusual mortality events (UMEs). Includes features like custom charting and detailed case breakdowns.
    *   **Injury Explorer (Permissioned):** Provides in-depth analysis of entanglement and vessel strike incidents by various factors (e.g., age class, severity, timeframe, gear type, vessel size, forensics).
*   **Detailed Case Information:** Allows drill-down into individual whale injury and monitoring cases, with associated details, comments, and links to necropsy or case study documents and images where available.
*   **Interactive Data Tables:** Features sortable, filterable, and paginated tables accompanying most charts, enabling detailed exploration of underlying data.
*   **Two-Way Filtering:** Charts and tables are synchronized; interactions with chart legends filter the table, and table filters update the charts.
*   **Data Export:** Permissioned users can download filtered datasets as CSV files.
*   **Responsive Design:** Optimized for a seamless experience across desktop and mobile devices.
*   **User Authentication & Authorization:** Secure access control for sensitive monitoring and injury data, managed via Amazon Cognito.

## Technology Stack

*   **Frontend:** Next.js, React, TypeScript
*   **Charting:** Recharts, D3
*   **State Management:** Zustand
*   **Table Components:** TanStack Table
*   **Styling:** Tailwind CSS, DaisyUI
*   **API Integration:** Axios
*   **Data Parsing:** PapaParse (for CSVs)
*   **Deployment:** Docker, Nginx, GitLab CI (for automated build, test, and deployment)

## Getting Started

To run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/right-whale-ui.git
    cd right-whale-ui
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    # or npm install
    # or yarn install
    ```
3.  **Set up environment variables:** Create a `.env.local` file based on `.env.example` (if provided) with necessary API endpoints.
    ```
    NEXT_PUBLIC_RWANTHRO_BACKEND_BASE_URL=http://localhost:44208
    NEXT_PUBLIC_RWANTHRO_WORDPRESS_BASE_URL=https://right-whale.sites.axds.co
    # ... other CSV URLs
    ```
4.  **Run the development server:**
    ```bash
    bun run dev
    # or npm run dev
    # or yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is containerized using Docker and deployed via GitLab CI/CD pipelines to Axiom Data Science infrastructure.

*   `Dockerfile`: Defines the build process for the static Next.js output and Nginx serving.
*   `.gitlab-ci.yml`: Configures CI/CD stages for building, testing, pushing Docker images to a registry, and deploying to staging/production environments.

## Acknowledgments

This project is made possible through collaborations and support from the New England Aquarium, NOAA, NARWC, and the Volgenau Foundation.
