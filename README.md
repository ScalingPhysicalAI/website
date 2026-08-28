# website

=======

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.15.1 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" --install pnpm migrate
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Visitor analytics

The site can report visits to a hosted analytics provider. It is **off unless
configured**, so local builds and forks never write into the production numbers.

Set three variables (see `.env.example`). In production they are GitHub
repository secrets, read by `.github/workflows/deploy.yml` at build time:

| Variable                    | Meaning                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `PUBLIC_ANALYTICS_PROVIDER` | `umami`, `plausible`, `cloudflare`, or blank to disable     |
| `PUBLIC_ANALYTICS_SITE_ID`  | Website ID (Umami), registered domain (Plausible), or token |
| `PUBLIC_ANALYTICS_HOST`     | Only for self-hosting; blank uses the vendor's cloud        |

To add or change one, go to **Settings → Secrets and variables → Actions** on
the repository, set the values, then re-run the deploy workflow. Nothing in the
source needs to change to switch providers.

### Setting up Umami (free tier)

1. Create an account at [cloud.umami.is](https://cloud.umami.is) and add
   `starforgerobotics.com` as a website.
2. Copy the **Website ID** it gives you (a UUID).
3. Add repository secrets `PUBLIC_ANALYTICS_PROVIDER=umami` and
   `PUBLIC_ANALYTICS_SITE_ID=<the UUID>`.
4. Re-run the deploy workflow, then load the site and check the Umami dashboard.

### Notes

- Umami and Plausible are cookieless and do not need a consent banner. Google
  Analytics is deliberately not supported here, because it sets cookies and
  would require a consent banner for EU and UK visitors.
- Both trackers hook the History API, so SvelteKit's client-side navigations are
  counted automatically. Do not add manual pageview calls or hits will double.
- Both ignore `localhost` by default, so `npm run preview` will not register.
- Ad blockers block these endpoints, so expect real numbers to run somewhat
  below reality. Every provider has this problem; it is not a misconfiguration.
