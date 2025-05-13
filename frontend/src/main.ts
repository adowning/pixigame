import './assets/main.css'
import responsiveModule from './responsiveModule' //
import reportWebVitals from './reportWebVitals' // You'd need to create/adapt this for Vue

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Import global styles and fonts
// In Vue, you typically import CSS directly.
// For fonts, ensure they are loaded via CSS (@font-face) or a link in your index.html
import './assets/main.css' // Example: your main CSS file
import './assets/index.css' // Corresponds to your './index.css'
// To import '../src/assets/fonts/Bronzier-Medium.ttf',
// you would typically define @font-face in your CSS.

// Import components that were globally rendered in React
// These would likely be part of your App.vue template or layout components in Vue.
// For example, if Watermark and Preloader are always present,
// they might be in App.vue's template.
// import Watermark from './components/Watermark.vue'; // Assuming you convert these to .vue files
// import Preloader from './components/Preloader.vue';

// Import modules that were called directly

// If Watermark and Preloader were meant to be globally available components
// you could register them globally, though it's often better to import them where needed
// or include them in a root layout component.
// app.component('Watermark', Watermark)
// app.component('Preloader', Preloader)

// Mount the application to the DOM element with id 'app' (or 'root' if you keep that)
// Your frontend/index.html uses <div id="app"></div>

// Initialize modules that run globally
responsiveModule()

// Call reportWebVitals if you have a Vue equivalent
// This might involve integrating with a performance monitoring service
reportWebVitals(console.log) // Or y

app.mount('#app')
