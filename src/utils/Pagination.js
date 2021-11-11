const dotenv = require("dotenv");
dotenv.config();

const getPagingData = (rows, page, limit) => {
  const { count: totalItems, rows: data } = rows;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

const getPagination = (page, size) => {
  const limit = size ? +size : Number(process.env.ROWS_PER_PAGE);
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

module.exports = { getPagination, getPagingData };
