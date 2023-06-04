import {getDirname, path} from '@vuepress/utils';
import {defaultTheme} from '@vuepress/theme-default'
import {productionReleaseVersion, productionReleaseSri} from '../../package';
import {registerComponentsPlugin} from '@vuepress/plugin-register-components';
import {searchPlugin} from '@vuepress/plugin-search';

const __dirname = getDirname(import.meta.url);

export default {
  title: 'signature-js',
  head: [['link', {rel: 'icon', href: '/assets/img/eid-easy-icon.png'}]],
  description: 'signature-js is an official eID Easy browser-side JavaScript library. You can use signature-js to handle eID Easy signing flows in your web application.',
  theme: defaultTheme({
    logo: '/assets/img/eid-easy-logo.png',
    version: productionReleaseVersion,
    sri: productionReleaseSri,
    navbar: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide/'},
      {text: 'Config Reference', link: '/config-reference/'},
    ],
    sidebar: 'auto',
    contributors: false,
  }),
  plugins: [
    searchPlugin({}),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],
}
