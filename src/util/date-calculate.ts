export const dateCalculate = (term: number = 0) => {
  const calculated = new Date();
  calculated.setMonth(calculated.getMonth() - term);
  return calculated;
};
