const calculateDiversityScore = (data, weightage) => {
  
  let score = 0;
  for (const item of data) {
    const { k, v } = item;
    let numerator = 0;
    let sum = 0;

    for (const value of v) {
        const { count } = value;
      if (value[k] != null) numerator += count * (count - 1);
      // console.log(count);
      sum += count;
    }
    // console.log("sum",sum);
    const denominator = sum * (sum - 1);
    score += (1 - numerator / denominator) * weightage[k];
  }

  return score;
};
exports.calculateDiversityScore = calculateDiversityScore;
