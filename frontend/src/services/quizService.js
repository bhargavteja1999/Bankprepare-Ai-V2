import api from './api';

export const quizService = {
  async generateQuiz(payload) {
    const response = await api.post('/quizzes/generate', payload);
    return response.data;
  },

  async createManualQuiz(payload) {
    const response = await api.post('/quizzes/manual', payload);
    return response.data;
  },

  async listQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  async getQuiz(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  async submitQuiz(id, submission) {
    const response = await api.post(`/quizzes/${id}/submit`, submission);
    return response.data;
  },

  async getQuizAttempts(id) {
    const response = await api.get(`/quizzes/${id}/attempts`);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  // Flashcards
  async generateFlashcards(payload) {
    const response = await api.post('/flashcards/generate', payload);
    return response.data;
  },

  async listFlashcardDecks() {
    const response = await api.get('/flashcards/decks');
    return response.data;
  },

  async getFlashcardDeck(id) {
    const response = await api.get(`/flashcards/decks/${id}`);
    return response.data;
  },

  async reviewFlashcard(cardId, quality) {
    const response = await api.post(`/flashcards/cards/${cardId}/review`, { quality });
    return response.data;
  },

  // Syllabus & Games & Analytics
  async getSyllabus() {
    const response = await api.get('/syllabus/tree');
    return response.data;
  },

  async getSpeedChallenge() {
    const response = await api.get('/games/speed-challenge');
    return response.data;
  },

  async submitGameScore(payload) {
    const response = await api.post('/games/score', payload);
    return response.data;
  },

  async getDashboardAnalytics() {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }
};
