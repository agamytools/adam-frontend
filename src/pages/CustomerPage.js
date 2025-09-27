import React, {useState, useEffect} from 'react';
import './CustomerPage.css';

function getStatus(status) {
    switch (status) {
        case 1:
            return 'Pending';
        case 2:
            return 'Confirmed';
        case 3:
            return 'Completed';
        case 4:
            return 'Cancelled';
        default:
            return 'Unknown';
    }
}

export default function CustomerPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    // Fetch customer bookings
    useEffect(() => {
        async function fetchBookings() {
            setBookingsLoading(true);
            try {
                const res = await fetch('http://127.0.0.1:3000/api/v1/bookings/my-bookings?customerId=1&offset=0&limit=10');
                const data = await res.json();
                setBookings(data.data.records || []);
            } catch (err) {
                setBookings([]);
            }
            setBookingsLoading(false);
        }

        fetchBookings();
    }, [success]); // refresh on successful booking

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:3000/api/v1/bookings/booking-request', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    customerId: 1,
                    startTime,
                    endTime
                })
            });
            if (res.ok) {
                setSuccess('Booking requested successfully!');
                setModalOpen(false);
                setStartTime('');
                setEndTime('');
            } else {
                setError('Failed to request booking.');
            }
        } catch (err) {
            setError('Network error.');
        }
        setLoading(false);
    };

    return (
        <div className="customer-fullscreen">
            <header className="customer-header">
                <span className="customer-icon">👤</span>
                <h1>Customer Dashboard</h1>
            </header>
            <main className="customer-main">
                <section className="card card-large">
                    <div className="card-header">
                        <h2>Request a Booking</h2>
                        <button className="add-btn" onClick={() => setModalOpen(true)}>Request Booking</button>
                    </div>
                    {success && <div className="success-msg">{success}</div>}
                    {error && <div className="error-msg">{error}</div>}
                </section>
                <section className="card card-large">
                    <h2>Upcoming Bookings</h2>
                    {bookingsLoading ? (
                        <p>Loading...</p>
                    ) : bookings.length === 0 ? (
                        <p>No upcoming bookings.</p>
                    ) : (
                        <table className="bookings-table">
                            <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                                    <td>{new Date(booking.endTime).toLocaleString()}</td>
                                    <td className={`status-${getStatus(booking.status)}`}>{getStatus(booking.status)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal modal-enhanced">
                        <h3>Request Booking</h3>
                        <form onSubmit={handleBooking} className="modal-form">
                            <label>Start Time</label>
                            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required/>
                            <label>End Time</label>
                            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required/>
                            <div className="modal-actions">
                                <button type="submit" disabled={loading}>{loading ? 'Requesting...' : 'Request'}</button>
                                <button type="button" onClick={() => setModalOpen(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
