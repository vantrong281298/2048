import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  page: '/deploying-vite-project-example/',
  plugins: [vue()],
})
