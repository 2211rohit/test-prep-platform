# ADR 0001: Payload owns CMS data in PostgreSQL

- Status: Accepted
- Date: 2026-10-07

## Context

The PRD lists PostgreSQL with Prisma and allows either an in-repo Payload CMS or a hosted CMS. The product owner chose Payload in the initial Next.js repository. Payload provides an official PostgreSQL adapter backed by Drizzle and generates TypeScript types from its collection definitions.

Using Prisma and Payload to manage the same CMS tables would create two schema definitions and two migration paths. That would make editorial content and access rules harder to keep consistent.

## Decision

Use Payload's official PostgreSQL adapter as the schema and migration owner for CMS collections. Use Payload APIs for collection reads and writes. Do not add Prisma to manage those same tables.

During local development, Payload schema push is enabled for quick iteration. Production runs with schema push disabled and applies reviewed, committed Payload migrations.

## Consequences

- Collection types are generated from Payload schemas with `npm run payload:types`.
- Database migrations are generated and applied with the Payload CLI scripts in `package.json`.
- CMS data access follows Payload access rules; user-context Local API operations must pass the user and set `overrideAccess: false`.
- If a separate data-access layer is proposed for high-volume attempt processing, document its table ownership, transaction boundaries, and migration strategy in a new ADR before adding it.
