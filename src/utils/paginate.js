const paginate = (page = 1, limit = 5) => {
  const offset = (Number(page) - 1) * Number(limit);
  const info = {};

  if (offset > 0) {
    info.previous = {
      page: Number(page) - 1,
      limit
    };
  }
  return {
    offset,
    limit,
    info
  };
};
export default paginate;
