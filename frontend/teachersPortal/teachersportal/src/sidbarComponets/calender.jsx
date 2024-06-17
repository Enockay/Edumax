import React, { useState, useEffect } from 'react';
import './css/calender.css';
import { jwtDecode } from 'jwt-decode';

const CalendarComponent = () => {
  const [mainCalendar, setMainCalendar] = useState([]);
  const [schoolCalendar, setSchoolCalendar] = useState([]);
  const [schoolEvents, setSchoolEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    }
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await fetch('https://your-api-endpoint/calendar');
      const data = await response.json();
      setMainCalendar(data.mainCalendar);
      setSchoolCalendar(data.schoolCalendar);
      setSchoolEvents(data.schoolEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setError('Error fetching calendar data.');
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://your-api-endpoint/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: eventDate, event: newEvent }),
      });
      if (!response.ok) {
        throw new Error('Error adding event');
      }
      const addedEvent = await response.json();
      setMainCalendar([...mainCalendar, addedEvent]);
      setNewEvent("");
      setEventDate("");
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Error adding event.');
    }
  };

  return (
    <div className="calendar-component">
      <h2 className="calendar-heading">Calendar</h2>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="calendar-content">
          <div className="calendar-section">
            <h3 className="section-title">Main Calendar</h3>
            <div className="calendar-grid">
              {mainCalendar.map((event, index) => (
                <div key={index} className="calendar-event">
                  <p>{event.date}</p>
                  <p>{event.event}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="calendar-section">
            <h3 className="section-title">School Calendar</h3>
            <div className="calendar-grid">
              {schoolCalendar.map((event, index) => (
                <div key={index} className="calendar-event">
                  <p>{event.date}</p>
                  <p>{event.event}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="calendar-section">
            <h3 className="section-title">School Events</h3>
            <div className="calendar-grid">
              {schoolEvents.map((event, index) => (
                <div key={index} className="calendar-event">
                  <p>{event.date}</p>
                  <p>{event.event}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="event-form-section">
            <h3 className="section-title">Add Event</h3>
            <form className="event-form" onSubmit={handleEventSubmit}>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Event Description"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                required
              />
              <button type="submit">Add Event</button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
          {role === 'principal' || role === 'seniorTeacher' || role === 'deputy' ? (
            <div className="upload-section">
              <h3 className="section-title">Upload School Calendar</h3>
              <form className="upload-form">
                <input type="file" />
                <button type="submit">Upload</button>
              </form>
              <h3 className="section-title">Upload School Events</h3>
              <form className="upload-form">
                <input type="file" />
                <button type="submit">Upload</button>
              </form>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
