This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database (Postgres) and Prisma

This project uses Prisma to store visitor submissions. To run locally with PostgreSQL:

1. Install dependencies:

```bash
npm install prisma @prisma/client --save-dev=false
```

2. Create a Postgres database locally (for example using Docker), and set `DATABASE_URL` in a `.env` file. See `.env.example` for the expected format.

3. Generate Prisma client and apply schema:

```bash
npx prisma generate
npx prisma db push
# or for migrations:
npx prisma migrate dev --name init
```

4. Start the dev server:

```bash
npm run dev
```

The visitors API is at `/api/visitors` and the admin list page is at `/visitors` (this page is not protected — consider adding auth before deploying).

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the GitHub repo and select the `main` branch.
3. Add environment variables in Vercel's dashboard:
	- `DATABASE_URL` — your Postgres connection string.
4. Deploy. Vercel will run the build; migrations can be run in the GitHub Actions workflow or as a post-deploy step.

Notes:
- The workflow in `.github/workflows/deploy.yml` runs `npx prisma migrate deploy` using `DATABASE_URL` from GitHub secrets.
- Protect the `/visitors` admin route before making the site public.

## Admin basic auth (visitors page)

This repo includes a simple Edge middleware that enforces HTTP Basic Auth for `/visitors`.

Set the following environment variables in Vercel/GitHub secrets before deploying:

- `ADMIN_USER` — admin username
- `ADMIN_PASS` — admin password

Example (in `.env` for local testing):

```
ADMIN_USER="admin"
ADMIN_PASS="password"
```

Note: Basic auth credentials are a simple protective measure — consider integrating a proper auth provider for stronger security in production.


