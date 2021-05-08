
const Utils = (() => {

  return ({
    formatDateToString(date: Date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
  });
})();

export default Utils;