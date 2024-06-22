import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context';
import Spinner from './Spinner';

interface Unit {
  subject: string;
  totalMarks: number;
  points: string;
  grade: string;
}

interface Exam {
  term: string;
  examType: string;
  units: Unit[];
  totalPoints: string;
  totalGrade: string;
  totalMarks: string;
  classRank: string;
  streamRank: string;
}

interface Year {
  year: string;
  exams: Exam[];
}

interface StudentData {
  studentName: string;
  stream: string;
  years: Year[];
}

const Grades: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userName, admissionNumber, stream } = useUser();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(`https://edumax.fly.dev/transcript?admission=${admissionNumber}&stream=${stream}`);
        const data = response.data;

        if (data.success) {
          //console.log(data.message.student);
         // console.log(data.message);
          setStudentData(data.message);
        } else {
          setError('Failed to fetch grades');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [admissionNumber, stream]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!studentData) {
    return <p>No data available</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="bg-emerald-500 text-white shadow-md p-3">
        <h4 className="text-2xl font-bold">Performance Transcripts</h4>
      </nav>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        {studentData.years.map((year, index) => (
          <div key={index} className="mb-6">
            <h5 className="text-xl text-violet-500 font-semibold mb-4">Year: {year.year}</h5>
            {year.exams.map((exam, examIndex) => (
              <div key={examIndex} className="mb-4 border rounded-lg bg-gray-50 overflow-x-auto w-full p-1">
                <div className="flex justify-between items-center mb-2">
                  <h5 className=" font-bold">
                    {exam.term} - {exam.examType} Exam
                  </h5>
                  <div className="text-right">
                    <p><strong>SRank:</strong> {exam.streamRank}</p>
                    <p><strong>CRank:</strong> {exam.classRank}</p>
                  </div>
                </div>
                <div className="">
                  <table className=" mb-4">
                    <thead>
                      <tr className="bg-gray-200 table-auto">
                        <th className="px-4 py-2 left-0">Subject</th>
                        <th className="px-4 py-2">Total Marks</th>
                        <th className="px-4 py-2">Points</th>
                        <th className="px-4 py-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.units.map((unit, unitIndex) => (
                        <tr key={unitIndex} className="border-b">
                          <td className="px-4 py-2">{unit.subject}</td>
                          <td className="px-4 py-2">{unit.totalMarks}</td>
                          <td className="px-4 py-2">{unit.points}</td>
                          <td className="px-4 py-2">{unit.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="">
                  <div className="flex justify-between items-center">
                    <p><strong>Total Marks:</strong> <span className='text-sky-800'>{exam.totalMarks}</span></p>
                    <p><strong>Total Points:</strong> <span className='text-sky-800'>{exam.totalPoints}</span></p>
                    <p><strong>Total Grade:</strong> <span className='text-sky-800'>{exam.totalGrade}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grades;
