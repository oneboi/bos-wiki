import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "bos-wiki",
  description: "wiki for bos-wiki",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'wiki', link: '/wiki' }
    ],

    sidebar: [
      {
        text: 'navigation',
        items: [
          { text: 'wiki', link: '/wiki' },
          { text: 'nodes', link: '/docs/nodes' },
          { text: 'tools', link: '/docs/tools' },
          { text: 'funs', link: '/docs/funs' },
          { text: 'executor', link: '/docs/executor' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
