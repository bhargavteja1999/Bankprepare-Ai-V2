import api from './api';

export const documentService = {
  async uploadFile(file, title, subject) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (subject) formData.append('subject', subject);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async createTextDocument(title, subject, rawText) {
    const response = await api.post('/documents/text', {
      title,
      subject,
      raw_text: rawText,
    });
    return response.data;
  },

  async listDocuments() {
    const response = await api.get('/documents');
    return response.data;
  },

  async getDocument(id) {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};
