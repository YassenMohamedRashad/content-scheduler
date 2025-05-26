// vite config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tailwindConfig from './tailwind.config';
import flowbiteReact from "flowbite-react/plugin/vite";



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(tailwindConfig), flowbiteReact()],
})