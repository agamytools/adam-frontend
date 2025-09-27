import React, { useState, useEffect } from 'react';
import './PainterPage.css';
import {DateTimeUtil} from "../core/util/date-time.util";

export default function PainterPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slots from API (replace with your API endpoint)
  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        // Example API call, replace with your endpoint
        const res = await fetch('http://136.115.12.229:3000/api/v1/technicians/timeslots/availability?technicianId=1&lastId=0&limit=10');
        const data = await res.json();
        setSlots(data.data);
      } catch (err) {
        setSlots([]);
      }
      setLoading(false);
    }
    fetchSlots();
  }, []);

  // Handle add slot
  const handleAddSlot = async (e) => {
    e.preventDefault();
    // Example POST request, replace with your API endpoint
    await fetch('http://136.115.12.229:3000/api/v1/technicians/timeslots/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({technicianId:1, startTime, endTime })
    });
    setModalOpen(false);
    setStartTime('');
    setEndTime('');

    // Refresh slots
    setLoading(true);
    const res = await fetch('http://136.115.12.229:3000/api/v1/technicians/timeslots/availability?technicianId=1&lastId=0&limit=10');
    const data = await res.json();
    setSlots(data.data);
    setLoading(false);
  };

  return (
    <div className="painter-fullscreen">
      <header className="customer-header">
        <span className="customer-icon">🎨</span>
        <h1>Painter Dashboard</h1>
      </header>
      <main className="painter-main">
        <section className="card card-large">
          <div className="card-header">
            <h2>Available Time Slots</h2>
            <button className="add-btn" onClick={() => setModalOpen(true)}>Add</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {slots.length === 0 ? (
                  <tr><td colSpan={2}>No slots available.</td></tr>
                ) : (
                  slots.map((slot, idx) => (
                    <tr key={idx}>
                      <td>{DateTimeUtil.format(slot.startTime)}</td>
                      <td>{DateTimeUtil.format(slot.endTime)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
      {/* Modal Dialog */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Time Slot</h3>
            <form onSubmit={handleAddSlot} className="modal-form">
              <label>Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              <label>End Time</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
