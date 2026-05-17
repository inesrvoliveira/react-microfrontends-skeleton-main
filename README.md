# ComplyAdvantage React App Skeleton

React app skeleton using React, Vite, Pnpm and Nx.

## Structure

Main app: `./apps/comply-advantage-app`

Code library for providing shared code between apps/packages: `./packages/shared`

Internal package containing functionality relating to managing cases: `./packages/cases`.

The main app is intended to behave as an orchestrator, pulling in and rendering areas of functionality from packages internal to the repo, such as `cases`.

## Installation

- Use correct node version per `.nvmrc` file
- Globally install pnpm `npm i -g pnpm`
- Install dependencies for all workspaces: `pnpm i` at project root

## Starting dev server

At project root: `npx nx dev comply-advantage-app`

This will also build dependent packages, e.g. `shared` and `cases`.

Note that when making changes to the `shared` package, in order for those change to be received in the `cases` package, you will need to build `shared` via `npx nx build shared`.

## Testing

Test tooling is `vitest` + `@testing-library/react`. Vitest is essentially the same as `jest` and has the same API.

To run tests in watch mode against a single app/package:

`npx nx test:watch [name]`, e.g. `npx nx test:watch comply-advantage-app`

To run tests **without** watch mode against a single app/package:

`npx nx test [name]`, e.g. `npx nx test comply-advantage-app`

To run tests across all apps/packages in parallel:

`npx nx run-many --target=test`

## Linting

The project uses `eslint` integrated with `prettier`. Lint errors should appear in your IDE. Commands are also available:

To run linting against a single app/package:

`npx nx lint [name]`, e.g. `npx nx lint comply-advantage-app`

To run linting across all apps/packages in parallel:

`npx nx run-many --target=lint`

To run linting with auto-fix enabled, append `:fix` to commands above, e.g. `npx nx run-many --target=lint:fix`. Prettier formatting fixes will also be applied by auto-fixing commands.