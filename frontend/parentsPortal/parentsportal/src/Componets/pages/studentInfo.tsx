import React from 'react';

interface StudentProps {
  student: {
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
  };
}

const StudentInfo: React.FC<StudentProps> = ({ student }) => {
  return (
    <div className="bg-white shadow-lg rounded p-6 mb-6">
      <div className="flex items-center mb-6">
        {/* Placeholder for Student Profile Photo/Icon */}
        <div className="w-16 h-16 bg-gray-300 rounded-full mr-6"></div>
        <div>
          <h3 className="text-2xl font-bold mb-2">{student.fullName}</h3>
          <p className="text-gray-600">Admission No: {student.admissionNumber}</p>
          <p className="text-gray-600">Gender: {student.gender}</p>
          <p className="text-gray-600">Admission Date: {student.dateOfAdmission}</p>
          <p className="text-gray-600">Stream: {student.stream}</p>
          {student.formerSchool && <p className="text-gray-600">Former School: {student.formerSchool}</p>}
          {student.guardianName && <p className="text-gray-600">Guardian Name: {student.guardianName}</p>}
          {student.guardianTel && <p className="text-gray-600">Guardian Tel: {student.guardianTel}</p>}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-4">Academic Information</h4>
        <p className="text-gray-600">KCPE Index: {student.kcpeIndex}</p>
        <p className="text-gray-600">KCPE Marks: {student.kcpeMarks}</p>
        <p className="text-gray-600">Birth No: {student.studentBirthNo}</p>
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-4">Financial Information</h4>
        <p className={`text-gray-600 ${student.fees.totalBalance === 0 ? 'text-green-500' : 'text-red-500'}`}>
          Total Balance: ${student.fees.totalBalance}
        </p>
        {student.fees.termfees.map((term, index) => (
          <p key={index} className="text-gray-600">
            {term.term}: ${term.amount}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StudentInfo;
