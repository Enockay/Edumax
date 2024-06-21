import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentInfo from './studentInfo';

interface Student {
  _id: string;
  fullName: string;
  admissionNumber: string;
  gender: string;
  dateOfAdmission: string;
  stream: string;
  formerSchool?: string;
  guardianName?: string;
  guardianTel?: string;
  kcpeIndex?: number;
  kcpeMarks?: number;
  studentBirthNo?: string;
  uniformFees?: number;
  fees: {
    year: string;
    totalBalance: number;
    termfees: Array<{ term: string; amount: number }>;
  };
}

const Dashboard: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.post('http://localhost:3000/profile/?admission=1008');
        const data = response.data;

        if (data.success) {
          const student = data.message;
          setStudentInfo(student);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-6 text-white shadow-md">
        <h3 className="text-2xl font-bold">Parent Dashboard</h3>
      </nav>
      <div className="container mx-auto p-6">
        {loading && <p className="text-center text-gray-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentInfo && <StudentInfo student={studentInfo} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
