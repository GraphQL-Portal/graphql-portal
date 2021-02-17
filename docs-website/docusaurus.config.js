module.exports = {
  title: 'GraphQL Portal Documentation',
  tagline: 'GraphQL Portal Gateway Documentation',
  url: 'https://docs.graphql-portal.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'graphql-portal', // Usually your GitHub org/user name.
  projectName: 'graphql-portal', // Usually your repo name.
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'GraphQL Portal Documentation',
      logo: {
        alt: 'GraphQL Portal Logo',
        src: 'img/graphql-portal-logo.png',
      },
      items: [
        {
          href: 'https://www.graphql-portal.com/',
          label: 'SaaS version',
          position: 'right',
        },
        {
          href: 'https://github.com/graphql-portal/graphql-portal',
          'aria-label': 'GitHub',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Open Source',
          items: [
            {
              label: 'GraphQL Gateway',
              href: 'https://github.com/graphql-portal/graphql-portal',
            },
            {
              label: 'GraphQL Portal Dashboard',
              href: 'https://github.com/graphql-portal/graphql-portal-dashboard',
            },
            {
              label: 'Docker images',
              href: 'https://hub.docker.com/u/gqlportal',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discussions',
              href: 'https://github.com/GraphQL-Portal/graphql-portal/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/GraphQL-Portal/graphql-portal/issues',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/GraphQLPortal',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'SaaS version',
              href: 'https://www.graphql-portal.com/',
            },
            {
              label: 'Schedule a demo',
              href: 'https://www.graphql-portal.com/request-invite',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} GraphQL Portal. Built with Docusaurus. From Paris with 💜`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/graphql-portal/graphql-portal/edit/master/docs-website/',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
