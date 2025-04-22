// Mock data for test accounts

// Mock tickets
export const mockTickets = [
  {
    _id: 'ticket_001',
    title: 'Cannot access my account',
    description: 'I\'m having trouble logging into my account. It says my password is incorrect but I\'m sure it\'s right.',
    status: 'Active',
    user: {
      _id: 'user_customer',
      name: 'Customer',
      email: 'customer@example.com'
    },
    notes: [
      {
        _id: 'note_001',
        text: 'This is the initial ticket submission.',
        createdBy: {
          _id: 'user_customer',
          name: 'Customer'
        },
        createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  },
  {
    _id: 'ticket_002',
    title: 'Payment issue',
    description: 'My payment was processed but I haven\'t received the product yet.',
    status: 'Pending',
    user: {
      _id: 'user_customer',
      name: 'Customer',
      email: 'customer@example.com'
    },
    notes: [
      {
        _id: 'note_002',
        text: 'This is the initial ticket submission.',
        createdBy: {
          _id: 'user_customer',
          name: 'Customer'
        },
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        _id: 'note_003',
        text: 'I\'ve checked your order and it appears the payment was successful. Let me investigate why you haven\'t received the product yet.',
        createdBy: {
          _id: 'user_agent',
          name: 'Agent'
        },
        createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
  },
  {
    _id: 'ticket_003',
    title: 'Feature request',
    description: 'I would like to request a new feature for the application.',
    status: 'Closed',
    user: {
      _id: 'user_003',
      name: 'Bob Johnson',
      email: 'bob@example.com'
    },
    notes: [
      {
        _id: 'note_004',
        text: 'This is the initial ticket submission.',
        createdBy: {
          _id: 'user_003',
          name: 'Bob Johnson'
        },
        createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        _id: 'note_005',
        text: 'Thank you for your suggestion. We\'ll consider adding this feature in a future update.',
        createdBy: {
          _id: 'user_admin',
          name: 'Admin'
        },
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

// Mock users
export const mockUsers = [
  {
    _id: 'user_customer',
    name: 'Customer',
    email: 'customer@example.com',
    role: 'customer',
    createdAt: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
  },
  {
    _id: 'user_agent',
    name: 'Agent',
    email: 'agent@example.com',
    role: 'agent',
    createdAt: new Date(Date.now() - 5184000000).toISOString() // 60 days ago
  },
  {
    _id: 'user_admin',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
  },
  {
    _id: 'user_003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'customer',
    createdAt: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
  }
];

// Mock dashboard stats
export const mockStats = {
  totalTickets: 3,
  activeTickets: 1,
  pendingTickets: 1,
  closedTickets: 1,
  totalCustomers: 2,
  totalAgents: 1,
  totalAdmins: 1
};

// Helper function to get current user's tickets
export const getCurrentUserTickets = (userEmail) => {
  if (userEmail === 'admin@example.com' || userEmail === 'agent@example.com') {
    // Admins and agents can see all tickets
    return mockTickets;
  } else {
    // Customers can only see their own tickets
    return mockTickets.filter(ticket => ticket.user.email === userEmail);
  }
};

// Helper function to get a ticket by ID
export const getTicketById = (ticketId) => {
  return mockTickets.find(ticket => ticket._id === ticketId);
};

// Helper function to update a ticket
export const updateTicket = (ticketId, updates) => {
  const ticketIndex = mockTickets.findIndex(ticket => ticket._id === ticketId);
  if (ticketIndex !== -1) {
    mockTickets[ticketIndex] = {
      ...mockTickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockTickets[ticketIndex];
  }
  return null;
};

// Helper function to add a note to a ticket
export const addNoteToTicket = (ticketId, note, user) => {
  const ticketIndex = mockTickets.findIndex(ticket => ticket._id === ticketId);
  if (ticketIndex !== -1) {
    const newNote = {
      _id: `note_${Date.now()}`,
      text: note.text,
      createdBy: {
        _id: user._id,
        name: user.name
      },
      createdAt: new Date().toISOString()
    };
    
    mockTickets[ticketIndex].notes.push(newNote);
    mockTickets[ticketIndex].updatedAt = new Date().toISOString();
    
    return newNote;
  }
  return null;
};

// Helper function to create a new ticket
export const createTicket = (ticketData, user) => {
  const newTicket = {
    _id: `ticket_${Date.now()}`,
    title: ticketData.title,
    description: ticketData.description,
    status: 'Active',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    notes: [
      {
        _id: `note_${Date.now()}`,
        text: 'This is the initial ticket submission.',
        createdBy: {
          _id: user._id,
          name: user.name
        },
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockTickets.unshift(newTicket);
  return newTicket;
};

// Helper function to create a new user
export const createUser = (userData) => {
  const newUser = {
    _id: `user_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'customer',
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  return newUser;
};
