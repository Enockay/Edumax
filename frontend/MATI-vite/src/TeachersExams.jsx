import React, { useEffect, useState } from 'react';
import '../css/ExamList.css';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('https://edumax.fly.dev/ip/api/exams');
        const data = await response.json();
        setExams(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handlePrint = async (examId) => {
    window.open(`https://edumax.fly.dev/ip/api/exams/${examId}/print`, '_blank');

    try {
      await fetch(`/ip/api/exams/${examId}/print`, { method: 'POST' });
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam._id === examId ? { ...exam, printed: true } : exam
        )
      );
    } catch (error) {
      console.error('Error marking exam as printed:', error);
    }
  };

  const filteredExams = filterDate
    ? exams.filter((exam) =>
        new Date(exam.uploadedAt).toISOString().startsWith(filterDate)
      )
    : exams.filter((exam) => !exam.printed);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Uploaded Exams</h1>
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="date-filter"
      />
      <table className="exam-table">
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Notification</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExams.map((exam) => (
            <tr key={exam._id} className={exam.printed ? 'printed' : ''}>
              <td>{exam.teacherName}</td>
              <td>{exam.className}</td>
              <td>{exam.subject}</td>
              <td>{exam.notification}</td>
              <td>{new Date(exam.uploadedAt).toLocaleDateString()}</td>
              <td>
                <a
                  className="link"
                  href={`https://edumax.fly.dev/ip/api/file/${exam.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
                {exam.printed && <span className="printed-flag">Printed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamList;
