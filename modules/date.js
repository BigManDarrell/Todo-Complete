const date = new Date();
const getDate = date.toLocaleString("en-UK", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const getHours = date.getHours();

module.exports = { date: getDate, hours: getHours };
