function WebApplicationError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = {
  WebApplicationError
};
