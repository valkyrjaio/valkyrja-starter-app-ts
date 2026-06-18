<p align="center"><a href="https://valkyrja.io" target="_blank">
    <img src="https://raw.githubusercontent.com/valkyrjaio/art/refs/heads/master/long-banner/orange/typescript.png" width="100%">
</a></p>

# Valkyrja Starter (App)

Starter application for building TypeScript applications on the
[Valkyrja][Valkyrja url] framework.

This repository gives you a working Valkyrja application as a starting point —
HTTP and CLI kernels pre-wired, example controllers and commands, configuration
scaffolding, and a ready-to-customize `App/` namespace. The starter passes the
same linting, type checking, and formatting rules as the Valkyrja framework
itself, so you can focus on building your application rather than cleaning up
the foundation.

<p>
    <a href="https://www.npmjs.com/package/@valkyrjaio/application"><img src="https://img.shields.io/npm/v/@valkyrjaio/application.svg" alt="Latest Version on npm"></a>
    <a href="https://www.npmjs.com/package/@valkyrjaio/application"><img src="https://img.shields.io/node/v/@valkyrjaio/application.svg" alt="Supported Node.js Version"></a>
    <a href="https://github.com/valkyrjaio/valkyrja-starter-app-ts/blob/26.x/LICENSE.md"><img src="https://img.shields.io/github/license/valkyrjaio/valkyrja-starter-app-ts.svg" alt="License"></a>
    <a href="https://github.com/valkyrjaio/valkyrja-starter-app-ts/actions/workflows/ci.yml?query=branch%3A26.x"><img src="https://github.com/valkyrjaio/valkyrja-starter-app-ts/actions/workflows/ci.yml/badge.svg?branch=26.x" alt="CI Status"></a>
</p>

## What's in the Box

- **Pre-wired HTTP and CLI kernels** — the application boots and responds to
  both web requests and command-line invocations out of the box
- **Example controllers and commands** — working code showing typical routing,
  request handling, and command dispatch patterns
- **Configuration scaffolding** — `Config` and `Data` layers with example
  files and environment-driven overrides
- **Sindri integration** — pre-computed data file generation wired up for fast
  runtime performance
- **Full CI pipeline** — TypeScript, ESLint, Prettier, and Vitest all
  configured and passing on a clean clone

## Installation

### Use this template _(recommended)_

This repository is a GitHub template. Click the **Use this template** button
at the top of the repo to create a new repository in your own account,
pre-populated with the starter code.

### Clone manually _(for contributing to the starter itself)_

```
git clone git@github.com:valkyrjaio/valkyrja-starter-app-ts.git
cd valkyrja-starter-app-ts
npm install
```

## Getting Started

### Project Structure

The key directories you'll work in:

```
src/
└── App/           # your application code lives here
    ├── Cli/       # CLI commands, controllers, providers, configuration, and data
    └── Http/      # HTTP controllers, providers, configuration, and data
bin/
└── cli.ts         # CLI entry point
```

Your application code goes in the `App` namespace under `src/App/`. The starter
provides example HTTP controllers and CLI commands you can study, modify, or
replace.

### Running Your Application

The application runs directly from TypeScript source via Node's type-stripping —
no build step required.

**CLI:**

```
npm run cli
```

Run with no arguments to see the list of available commands.

### Writing Code

**Adding a route:** see the example controller in `src/App/Http/Controller/` and
the route definitions registered by the providers under `src/App/Http/Provider/`.

**Adding a command:** see the example command in `src/App/Cli/Command/`.

**Binding services:** the dependency injection container is configured in the
`Provider` classes under each `App/` subdirectory.

### Generating Data Files

The application uses [Sindri][sindri url] to generate pre-computed container,
routing, and event data files. After changing providers or configuration,
regenerate them:

```
npx sindri data:generate
```

### Running Tests

```
npm run vitest
```

For coverage:

```
npm run vitest-coverage
```

### Running CI Checks Locally

The starter ships with the same CI pipeline as the Valkyrja framework. Run any
check via its npm script:

```
npm run typescript
npm run eslint
npm run prettier
npm run vitest
```

## Documentation

Full Valkyrja [documentation][docs url] is available on the Valkyrja website.

For starter-specific questions, open an issue on this repository. For framework
questions, open an issue on the
[Valkyrja framework repository][framework url].

## Contributing

Contributions to the starter itself — improvements to the example code, bug
fixes, CI improvements — are welcome. See
[`CONTRIBUTING.md`][contributing url] for the submission process and
[`VOCABULARY.md`][vocabulary url] for the terminology used across Valkyrja.

## License

The Valkyrja framework and this starter are open-source software licensed
under the [MIT license][MIT license url]. See [`LICENSE.md`](./LICENSE.md).

[Valkyrja url]: https://valkyrja.io
[framework url]: https://github.com/valkyrjaio/valkyrja-ts
[sindri url]: https://github.com/valkyrjaio/sindri-ts
[docs url]: https://valkyrja.io
[contributing url]: https://github.com/valkyrjaio/.github/blob/master/CONTRIBUTING.md
[vocabulary url]: https://github.com/valkyrjaio/.github/blob/master/VOCABULARY.md
[MIT license url]: https://opensource.org/licenses/MIT
[license url]: ./LICENSE.md
