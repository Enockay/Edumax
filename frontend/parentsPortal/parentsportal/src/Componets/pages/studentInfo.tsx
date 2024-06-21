import React from 'react';
import studentPic from '../../assets/student.png';

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

interface StudentProps {
  student: Student;
}

const StudentInfo: React.FC<StudentProps> = ({ student }) => {
  return (
    <>
    <div className="bg-white shadow-md rounded-lg p-6 mb-6  max-h-full ">
      <div className='flex flex-col sm:flex-row gap-4 w-full text-gray-700'>
      <div className="flex flex-col items-center sm:items-start sm:w-1/3">
        <div className="w-32 h-32 bg-gray-300 rounded-full border-2 border-blue-100 flex items-center justify-center mb-4 overflow-hidden">
          <img src={studentPic} alt="Profile" className="w-full h-full object-cover" />
        </div>
  
        <div className="text-center sm:text-left shadow-md p-5 md:min-h-14 rounded-lg">
          <nav className='p-0 shadow '>
          <h3 className="text-2xl font-bold mb-2">{student.fullName}</h3>
          </nav>
          <p className='flex gap-5'>ADM NO:<span className='text-green-900'>{student.admissionNumber}</span> </p>
          <p className='flex gap-5'>Gender: <span className='text-green-900'>{student.gender}</span></p>
          <p className='flex gap-5'>Stream: <span className='text-green-900'>{student.stream}</span></p>
          <p className='flex gap-5'>Admission Date: <span className='text-green-900'>{student.dateOfAdmission}</span></p>
        </div>
      </div>
      <div className="sm:w-1/3 shadow-md p-5 min-h-5 rounded-lg">
      <nav className='shadow p-0 top-0'>
      <h4 className="text-xl font-semibold mb-4 left-0">Academic Information</h4>
      </nav>
        <p className='flex gap-5' >KCPE Index:<span className='text-green-900'>{student.kcpeIndex}</span></p>
        <p className='flex gap-5'>KCPE Marks: <span className='text-green-900'>{student.kcpeMarks}</span></p>
        <p className='flex gap-5'>Birth No: <span className='text-green-900'>{student.studentBirthNo}</span></p>
      </div>
      <div className="sm:w-1/3 shadow-md p-5 min-h-5 rounded-lg">
      <nav className='shadow'>
        <h4 className="text-xl font-semibold mb-4">Financial Information</h4>
      </nav>
         <p className='flex gap-5'>Year: <span className='text-green-900'>2024</span></p>
        <p className='flex gap-5'>Tearm:<span className='text-green-900'>2</span></p>
        <p className='flex gap-5'>Total Fees:<span className='text-green-900'>Null</span></p>
        <p className={`font-bold ${student.fees.totalBalance === 0 ? 'text-green-500' : 'text-red-500'}`}>
          Total Balance: ksh{student.fees.totalBalance}
        </p>
      </div>
    </div>
    <div className='shadow-md rounded-lg p-4 mt-4 min-h-10'>
       <nav className='shadow'>
       <h4 className="text-xl font-semibold ">Notifications</h4>
       </nav>
       <div className='shadow-xl min-h-9 p-4 mt-7'>
        <p><strong>Date</strong></p>
        <p><strong>Message</strong></p>
        <p><strong>From</strong></p>
       </div> 
    </div>
    </div> 
    </>
  );
};
    
    

export default StudentInfo;
