const { faker } = require('@faker-js/faker');

const generateRandomStudents = (numberOfStudents) => {
  const students = [];

  for (let i = 0; i < numberOfStudents; i++) {
    students.push({
      fullName: faker.person.fullName(),
      guardianName: faker.person.fullName(),
      guardianTel: faker.phone.number(),
      admissionNumber: faker.number.int({min : 200,max:9000}),
      stream: faker.helpers.arrayElement(['1East', '1West']),
      kcpeIndex: faker.string.numeric(8),
      kcpeMarks: faker.number.int({ min: 100, max: 500 }),
      studentBirthNo: faker.string.numeric(8),
      dateOfAdmission: faker.date.past(),
      gender: faker.helpers.arrayElement(['Female','Male']),
      formerSchool: faker.company.name(),
      uniformFees: faker.number.int({ min: 1000, max: 5000 }),
      boardingOrDay: faker.helpers.arrayElement(['Boarding', 'Day']),
    });
  }

  return students;
};

module.exports = generateRandomStudents;
