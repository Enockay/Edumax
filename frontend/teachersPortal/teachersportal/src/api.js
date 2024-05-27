export const fetchTeacherData = () => {
    return Promise.resolve({
        name: 'John Doe',
        profilePic: 'https://via.placeholder.com/80'
    });
};

export const fetchUnits = () => {
    return Promise.resolve([
        { id: 1, name: 'Maths', remarks: 'Needs Improvement' },
        { id: 2, name: 'Chemistry', remarks: 'Excellent' },
        { id: 3, name: 'Physics', remarks: 'Good' }
    ]);
};

export const fetchStudents = (unitId) => {
    return Promise.resolve([
        { id: 1, name: 'Student One', marks: 85 },
        { id: 2, name: 'Student Two', marks: 90 },
        { id: 3, name: 'Student Three', marks: 78 }
    ]);
};

export const updateStudentMarks = (unitId, studentId, newMarks) => {
    return Promise.resolve({
        id: studentId,
        name: `Student ${studentId}`,
        marks: newMarks
    });
};

export const fetchAnnouncements = () => {
    return Promise.resolve([
        'Exam dates have been updated.',
        'New semester starts next month.'
    ]);
};

export const addAnnouncement = (announcement) => {
    return Promise.resolve(announcement);
};
