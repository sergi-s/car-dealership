import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Eye, CheckCircle, MessageSquare } from 'lucide-react';
import { contactService, type ContactMessage } from '../services/contactService';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const allMessages = await contactService.getAllContactMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (messageId: string, newStatus: 'new' | 'read' | 'replied') => {
    try {
      await contactService.updateMessageStatus(messageId, newStatus);
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-red-100 text-red-800', label: 'New' },
      read: { color: 'bg-yellow-100 text-yellow-800', label: 'Read' },
      replied: { color: 'bg-green-100 text-green-800', label: 'Replied' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          </div>
          <p className="text-gray-600">
            Manage and respond to customer inquiries submitted through the contact form.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.status === 'read').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              <div className="flex space-x-2">
                {(['all', 'new', 'read', 'replied'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No contact messages have been submitted yet.'
                  : `No ${filter} messages found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        {getStatusBadge(message.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        {message.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{message.email}</span>
                          </div>
                        )}
                        {message.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    
                    <div className="ml-4 flex space-x-2">
                      {message.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(message.id!, 'read');
                          }}
                          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                      {message.status !== 'replied' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(message.id!, 'replied');
                          }}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Mark as Replied
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Message View */}
                  {selectedMessage?.id === message.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Full Message:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        {message.email && (
                          <a
                            href={`mailto:${message.email}?subject=Re: Your inquiry from AutoMax`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Reply via Email
                          </a>
                        )}
                        {message.phone && (
                          <a
                            href={`tel:${message.phone}`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Customer
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessages; 