# Next.js Enterprise Boilerplate

A production-ready template for building enterprise applications with Next.js. This boilerplate provides a solid foundation with carefully selected technologies and ready-to-go infrastructure to help you develop high-quality applications efficiently.

## Motivation

While most Next.js boilerplates focus on individual developer needs with excessive complexity, **next-enterprise** prioritizes strategic simplicity for enterprise teams. It offers a streamlined foundation with high-impact features that maximize developer productivity and accelerate time-to-market for business-critical applications.

> [!NOTE]
> This is a customized Next.js boilerplate for enterprise applications.

## Documentation

There is separate documentation that explains its functionality, highlights core business values and technical decisions, provides guidelines for future development, and includes architectural diagrams.

We encourage you to review the documentation to learn more about the features and capabilities.

## Integrated features

### Boilerplate
With this template you will get all the boilerplate features included:

* [Next.js 15](https://nextjs.org/) - Performance-optimized configuration using App Directory
* [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework for efficient UI development
* [ESlint 9](https://eslint.org/) and [Prettier](https://prettier.io/) - Code consistency and error prevention
* [Corepack](https://github.com/nodejs/corepack) & [pnpm](https://pnpm.io/) as the package manager - For project management without compromises 
* [Strict TypeScript](https://www.typescriptlang.org/) - Enhanced type safety with carefully crafted config and [ts-reset](https://github.com/total-typescript/ts-reset) library
* [GitHub Actions](https://github.com/features/actions) - Pre-configured workflows including bundle size and performance tracking
* Perfect Lighthouse score - Optimized performance metrics
* [Bundle analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Monitor and manage bundle size during development
* Testing suite - [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/react), and [Playwright](https://playwright.dev/) for comprehensive testing
* [Storybook](https://storybook.js.org/) - Component development and documentation
* Advanced testing - Smoke and acceptance testing capabilities
* [Conventional commits](https://www.conventionalcommits.org/) - Standardized commit history management
* [Observability](https://opentelemetry.io/) - Open Telemetry integration
* [Absolute imports](https://nextjs.org/docs/advanced-features/module-path-aliases) - Simplified import structure
* [Health checks](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) - Kubernetes-compatible monitoring
* [Radix UI](https://www.radix-ui.com/) - Headless components for customization
* [CVA](http://cva.style/) (Class Variance Authority) - Consistent design system creation
* [Renovate BOT](https://www.whitesourcesoftware.com/free-developer-tools/renovate) - Automated dependency and security updates
* [Patch-package](https://www.npmjs.com/package/patch-package) - External dependency fixes without compromises
* Component relationship tools - Graph for managing coupling and cohesion
* [Semantic Release](https://github.com/semantic-release/semantic-release) - Automated changelog generation
* [T3 Env](https://env.t3.gg/) - Streamlined environment variable management

### Infrastructure & deployments

#### Vercel

Easily deploy your Next.js app with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=github&utm_campaign=next-enterprise) by clicking the button below:

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

#### Custom cloud infrastructure

This boilerplate offers dedicated infrastructure as code (IaC) solutions built with Terraform, designed specifically for deploying Next.js applications.

Learn more in the documentation how to quickstart with the deployments using simple CLI.

#### Available cloud providers and theirs features:

* **AWS (Amazon Web Services)**
  * Automated provisioning of AWS infrastructure
  * Scalable & secure setup using:
     * VPC - Isolated network infrastructure
     * Elastic Container Service (ECS) - Container orchestration
     * Elastic Container Registry (ECR) - Container image storage
     * Application Load Balancer - Traffic distribution
     * S3 + CloudFront - Static asset delivery and caching
     * AWS WAF - Web Application Firewall protection
     * Redis Cluster - Caching
  * CI/CD ready - Continuous integration and deployment pipeline

*... more coming soon*

### Team & maintenance

This boilerplate is maintained by the community and provides up to date security features and integrated feature updates.

#### Active maintainers

Community contributors

#### All-time contributors

Community contributors

## License

MIT