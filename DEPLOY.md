Steps to deploy this project to Vercel with Postgres

1. Push this repository to GitHub.

2. Create a managed Postgres database (Amazon RDS, Heroku Postgres, Supabase, or any provider).

3. In GitHub, add a repository secret named `DATABASE_URL` with the Postgres connection string, e.g.:

   postgres://user:pass@host:5432/dbname?schema=public

4. In Vercel, import the GitHub repository and set the same `DATABASE_URL` environment variable in the Vercel project settings.

5. Optionally, enable the provided GitHub Actions workflow to run migrations on pushes to `main`.

6. Deploy the app. The visitors API will write to the Postgres DB configured by `DATABASE_URL`.

Security note: Protect the `/visitors` route (basic auth, IP restriction, or OAuth) before making the site publicly discoverable.
