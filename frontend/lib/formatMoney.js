// Note: function exhibits strange rounding behavior with
// very large number as below:
// expect(formatMoney(111111111111111134)).toEqual(
//   '$1,111,111,111,111,111.34'
// );
// expect(formatMoney(129394059381294534)).toEqual(
//   '$1,293,940,593,812,945.34'
// );
export default function(amount) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };
  // if its a whole, dollar amount, leave off the .00
  if (amount % 100 === 0) options.minimumFractionDigits = 0;
  const formatter = new Intl.NumberFormat('en-US', options);
  return formatter.format(amount / 100);
}
