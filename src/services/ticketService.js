import api from './api';
import {
    addNoteToTicket as addMockNoteToTicket,
    createTicket as createMockTicket,
    getCurrentUserTickets,
    getTicketById as getMockTicketById,
    mockStats,
    updateTicket as updateMockTicket
} from './mockData';

// Helper to check if using a test account
const isTestAccount = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user && user.email && (
    user.email === 'admin@example.com' ||
    user.email === 'agent@example.com' ||
    user.email === 'customer@example.com'
  );
};

// Get current user
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};

// Get all tickets
export const getTickets = async () => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const user = getCurrentUser();
    const tickets = getCurrentUserTickets(user.email);
    return { data: tickets };
  } else {
    // Use real API for regular accounts
    const response = await api.get('/tickets');
    return response.data;
  }
};

// Get ticket by ID
export const getTicketById = async (id) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const ticket = getMockTicketById(id);
    return { data: ticket };
  } else {
    // Use real API for regular accounts
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const user = getCurrentUser();
    const newTicket = createMockTicket(ticketData, user);
    return { data: newTicket };
  } else {
    // Use real API for regular accounts
    const response = await api.post('/tickets', ticketData);
    return response.data;
  }
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const updatedTicket = updateMockTicket(id, ticketData);
    return { data: updatedTicket };
  } else {
    // Use real API for regular accounts
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  }
};

// Add note to ticket
export const addNoteToTicket = async (id, noteData) => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    const user = getCurrentUser();
    const newNote = addMockNoteToTicket(id, noteData, user);
    return { data: newNote };
  } else {
    // Use real API for regular accounts
    const formData = new FormData();
    formData.append('text', noteData.text);

    if (noteData.attachment) {
      formData.append('attachment', noteData.attachment);
    }

    const response = await api.post(`/tickets/${id}/notes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
};

// Get dashboard stats (admin only)
export const getStats = async () => {
  if (isTestAccount()) {
    // Use mock data for test accounts
    return { data: mockStats };
  } else {
    // Use real API for regular accounts
    const response = await api.get('/tickets/stats');
    return response.data;
  }
};
