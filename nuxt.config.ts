// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      socketPort: 3001,
      url: 'http://localhost',
    },
  },
  nitro: {
    plugins: ['./plugins/socket.io.server'],
  },
  plugins: ['./plugins/socket.io'],
});
