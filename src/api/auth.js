import client from './client';

export default {
  async login(email, password) {
    // FastAPI OAuth2PasswordRequestForm expects form-encoded, field name "username"
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);

    return client.post('/v1/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },

  async register(email, password) {
    return client.post('/v1/auth/register', { email, password });
  },

  async me() {
    return client.get('/v1/users/me');
  }
};