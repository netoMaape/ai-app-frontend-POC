import client from './client';

export default {
  async summarize(prompt) {
    return client.post('/v1/ai/summarize', { prompt });
  }
};