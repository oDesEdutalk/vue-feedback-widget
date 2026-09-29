import { createApp } from 'vue'
import App from './App.vue'
import VueFeedbackWidget from '../src/index'
import '../src/styles/style.css'

const app = createApp(App)

app.use(VueFeedbackWidget, {
  telegram: {
    botToken: '', // Có thể nhập botToken để test
    chatId: '',    // Có thể nhập chatId để test
  },
  userContext: {
    userId: '12345',
    userName: 'Demo User',
    email: 'demo@example.com',
  },
})

app.mount('#app')
