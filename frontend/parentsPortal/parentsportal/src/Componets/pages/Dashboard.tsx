import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentInfo from './studentInfo';
import Spinner from './Spinner';
import { useUser } from '../context';

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
  const { userName, admissionNumber } = useUser();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.post(`https://edumax.fly.dev/profile/?admission=${admissionNumber}`);
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
  }, [admissionNumber]);

  return (
    <div className="min-h-screen bg-gray-100 md:w-full">
      <nav className="bg-purple-950 p-6 text-white shadow-md">
        <h3 className="text-2xl font-bold">Parent Dashboard</h3>
      </nav>
      <div className="container mx-auto p-6 md:p-3">
        {loading && <Spinner />}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="flex justify-center max-h-screen overflow-auto p-2">
          {studentInfo && <StudentInfo student={studentInfo} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
