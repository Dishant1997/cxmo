exports.handleResponse = ({
    res, statusCode = 200, msg = 'Success', data = {}, result = 1,
  }) => {  
    res.status(statusCode).send({ result, msg, data });
  };
  
  
exports.handleError = ({
    res, statusCode = 404, err = 'error', result = 0, data = {}
  }) => {
    res.status(statusCode).send({
      result,
      msg: err instanceof Error ? err.message : (err.msg || err),
      data
    });
  };