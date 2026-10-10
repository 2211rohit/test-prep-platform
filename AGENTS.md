# Project instructions

## Product context

Implement the approved Test-Prep Platform PRD. Do not change product scope, access terms, launch tests, scoring behavior, or payment rules without an explicit product decision. Keep learner-facing product screens out of the foundation until their components are requested.

## Architecture

- Next.js App Router, React, strict TypeScript, Payload CMS, and PostgreSQL form one application.
- The Payload CMS owns its collection schemas and migrations through its official Postgres/Drizzle adapter. Do not add Prisma for the same CMS tables.
- Keep Payload admin and API routes in the (payload) route group and public routes in (frontend).
- Put each Payload collection in its own file under src/collections; share access logic in src/access, fields in src/fields, and CMS page blocks in src/blocks.
- Put feature-specific application code under src/features/<domain>. Keep route modules as composition points. Use Server Components by default and add Client Components only for real browser interaction.
- Use shared presentational UI under src/components only when components are genuinely reused. Avoid speculative abstractions.
- Do not edit src/payload-types.ts or generated Payload import maps by hand. Regenerate them with the package scripts.

## Security and content

- Enforce access rules in Payload on the server. A hidden button or a client-side check is not authorization.
- Public content must be both approved and published. Questions and quiz configurations containing answer keys are staff-only.
- Public quiz delivery must use a sanitized DTO that omits answer keys and private explanations until the server has accepted and scored a submission.
- Use Payload APIs rather than raw SQL for collection data. When Local API calls must enforce a user's permissions, pass the user and set overrideAccess: false.
- Validate imported content at the boundary, preserve question versions, and keep stable slugs once they are used publicly.
- Never add real credentials to tracked files. Update .env.example when new environment variables are introduced.

## Frontend quality

- Keep design values in semantic CSS custom properties. Do not scatter raw colors or spacing values across components.
- Build mobile-first layouts. Preserve keyboard operation, visible focus, readable contrast, reduced-motion preferences, and meaningful labels.
- Use semantic HTML and descriptive accessible names. Do not communicate state by color alone.
- Keep page metadata and structured public content server-renderable for SEO.

## Change workflow

- Follow the project-local frontend, CMS, and design-system skills when they apply.
- Read the relevant PRD requirement before changing a product behavior.
- Keep changes scoped to the requested feature and report commands that were or were not run.
