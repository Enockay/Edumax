const { ProducedResults } = require("../models/feedStudentMarks");

const updateStudentPdfs = async (pdfUpdates, batchSize, concurrency) => {
  // Function to update a batch of students
  const updateBatch = async (batch) => {
    const bulkOps = batch.map((update) => ({
      updateOne: {
        filter: {
          studentAdmission: update.studentAdmission,
          'years.year': update.year,
          'years.exams.term': update.term,
          'years.exams.examType': update.examType,
        },
        update: {
          $set: {
            'years.$[yearElem].exams.$[examElem].pdf': update.pdfBuffer,
          },
        },
        arrayFilters: [
          { 'yearElem.year': update.year },
          { 'examElem.term': update.term, 'examElem.examType': update.examType },
        ],
      },
    }));

   const update =  await ProducedResults.bulkWrite(bulkOps);
   //console.log(update);
  };

  // Split pdfUpdates into chunks of batchSize
  const chunks = [];
  for (let i = 0; i < pdfUpdates.length; i += batchSize) {
    chunks.push(pdfUpdates.slice(i, i + batchSize));
  }

  // Process chunks concurrently
  const processChunk = async (chunk) => {
    await updateBatch(chunk);
  };

  const chunkBatches = [];
  for (let i = 0; i < chunks.length; i += concurrency) {
    chunkBatches.push(chunks.slice(i, i + concurrency));
  }

  for (const chunkBatch of chunkBatches) {
    await Promise.all(chunkBatch.map(processChunk));
  }
};

module.exports = { updateStudentPdfs };
