import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const allowedHosts = process.env.VITE_ALLOWED_HOSTS;

  return defineConfig({
    plugins: [react()],
    server: {
      allowedHosts: allowedHosts.split(','),
    },
  });
}
