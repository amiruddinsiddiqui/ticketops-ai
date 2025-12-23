import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

import { useAuth } from '../context/AuthContext';

const TicketList = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const myTickets = tickets.filter(t => t.createdBy?._id === user?._id || t.createdBy === user?._id);
    const assignedTickets = tickets.filter(t => t.assignedTo?._id === user?._id);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/tickets');
            setTickets(response.data);
        } catch (err) {
            setError('Failed to fetch tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (ticketId) => {
        
        setTickets(tickets.map(t => t._id === ticketId ? { ...t, status: 'COMPLETED' } : t));

        try {
            await api.put(`/tickets/${ticketId}`, { status: 'COMPLETED' });
        } catch (err) {
            alert("Failed to update status");
    
            fetchTickets();
            console.error(err);
        }
    };

    if (loading) return <div className="page-container">Loading...</div>;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="form-title" style={{ margin: 0, textAlign: 'left' }}>Your Tickets</h1>
                <Link to="/create-ticket" className="submit-btn" style={{ width: 'auto', textDecoration: 'none' }}>
                    + New Ticket
                </Link>
            </div>

            {loading && <div className="loading-spinner">Loading tickets...</div>}
            {error && <div className="error-msg">{error}</div>}

            {!loading && !error && (
                <div className="ticket-sections">
                    {assignedTickets.length > 0 && (
                        <div className="section mb-8">
                            <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                                Assigned to Me ({assignedTickets.length})
                            </h2>
                            <div className="ticket-grid">
                                {assignedTickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket._id}
                                        ticket={ticket}
                                        badgeColor="bg-blue-600"
                                        onComplete={handleComplete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="section">
                        <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-gray-700 pb-2">
                            My Tickets ({myTickets.length})
                        </h2>

                        {myTickets.length === 0 ? (
                            <div className="text-gray-500 italic">You haven't created any tickets yet.</div>
                        ) : (
                            <div className="ticket-grid">
                                {myTickets.map((ticket) => (
                                    <TicketCard key={ticket._id} ticket={ticket} badgeColor="bg-gray-700" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const TicketCard = ({ ticket, badgeColor, onComplete }) => (
    <div className="ticket-card bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-750 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <h3 className="ticket-title font-bold text-lg text-white">{ticket.title}</h3>
            <span className={`status-badge px-2 py-1 rounded text-xs uppercase ${badgeColor} text-white`}>
                {ticket.status}
            </span>
        </div>
        <p className="ticket-desc text-gray-400 text-sm mb-4 line-clamp-2">{ticket.description}</p>

        <div className="ticket-details text-xs text-gray-400 mb-4 space-y-1">
            <div className="flex justify-between">
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
            {ticket.createdBy && (
                <div className="text-blue-300">
                    Requested By: {ticket.createdBy.email}
                </div>
            )}
        </div>

        <div className="ticket-actions flex justify-between items-center mt-4 border-t border-gray-700 pt-3">
            {onComplete && ticket.status !== 'COMPLETED' ? (
                <button
                    onClick={() => onComplete(ticket._id)}
                    className="flex items-center gap-1 bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded transition-all text-[10px] font-bold uppercase tracking-wide"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Resolve
                </button>
            ) : (
                <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10' : 'text-gray-500'}`}>
                    {ticket.status === 'COMPLETED' ? '✓ Resolved' : ''}
                </span>
            )}

            {ticket.assignedTo && (
                <span title={ticket.assignedTo.email} className="text-xs text-gray-500">
                    Assigned: {ticket.assignedTo.email.split('@')[0]}
                </span>
            )}
        </div>
    </div>
);

export default TicketList;
