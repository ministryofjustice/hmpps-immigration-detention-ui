# Agent Guidance

## Project shape

- This is a TypeScript 24 Express application for managing HMPPS immigration detention records.
- Request handling lives in `server/`: middleware, routes, services, data/API clients, models, and Nunjucks views.
- Browser assets live in `assets/`: TypeScript, SCSS, and frontend templates/components.
- End-to-end tests live in `integration_tests/` and use Playwright with WireMock API stubs.
- `esbuild/` owns the application and asset build. Do not edit generated output in `dist/`.

## Development commands

- Use Node 24 and run `npm run setup` after dependency changes; it runs `npm ci` and the repository's approved install scripts.
- Run `npm run lint` for ESLint, `npm run typecheck` for server plus integration-test and asset TypeScript projects, and `npm test` for Jest unit tests.
- Run `npm run build` for the production build or `npm run start:dev` for the local watch workflow.
- For integration tests, start WireMock with `docker compose -f docker-compose-test.yml up`, start the feature server with `npm run start-feature`, then run `npm run int-test`.
- Run the narrowest relevant test or typecheck after changes, then run the broader command when the change crosses package boundaries.
- See [README.md](README.md) for Docker, OAuth credentials, Redis, local environment, and deployment setup.

## Architecture conventions

- Construct application dependencies once in `server/services/index.ts` and pass the resulting `Services` object into `createApp()` and route classes; preserve this dependency-injection boundary.
- Keep external API access in `server/data/` clients and domain/application behavior in `server/services/`; use the existing HMPPS REST client patterns.
- Keep route handlers focused on request validation, navigation, rendering, and calling services. Follow nearby route tests and page objects when changing a workflow.
- Immigration detention workflow state is held in the session through the immigration detention store service. Preserve its established session shape and clear state at the same workflow boundaries as neighboring routes.
- OpenAPI-generated declarations under `server/@types/` are generated artifacts. Change the source API contract or rerun the relevant `generate-*-api-types` script instead of hand-editing generated output.

## Security-sensitive behavior

- Preserve middleware order in `server/app.ts`: authentication, authorisation, CSRF setup, current-user setup, prisoner population, telemetry, then application routes.
- Authorization uses the project role helpers in `server/@types/roles.ts`; roles are represented with the HMPPS `ROLE_` prefix. Reuse the existing middleware rather than checking roles ad hoc in routes.
- Form submissions use the CSRF token in `req.body._csrf` as configured by the existing CSRF middleware.
- Do not log credentials, tokens, session contents, or other sensitive prisoner information. Keep audit events routed through the existing audit service.

## Testing conventions

- Unit tests are colocated with server modules and generally mock services/API clients; use Jest and existing test utilities.
- Integration specs are serialized because they share a WireMock instance. Reuse helpers in `integration_tests/testUtils.ts`, mock APIs in `integration_tests/mockApis/`, and page objects in `integration_tests/pages/`.
- Playwright uses `data-qa` as its test-id attribute. Prefer the existing page-object selectors and user-visible behavior over implementation-specific selectors.
- When changing a user journey, update the focused unit/integration coverage and any affected page object together.

## Change discipline

- Prefer the smallest change consistent with existing patterns. Do not reformat unrelated files or edit generated/build output.
- Check `.env.example` and nearby configuration before introducing a new environment variable.
- Keep deployment changes in `helm_deploy/` aligned across the relevant environment values files and validate Helm-related changes with the repository's CI conventions.