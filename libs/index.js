import Captch from './src/main.js';

Captch.install = (Vue) => {
  Vue.component(Captch.name, Captch)
}

if (typeof window !== 'undefined' && window.Vue) {
  Captch.install(window.Vue)
}

export default Captch;