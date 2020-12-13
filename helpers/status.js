const successMessage = { status: 'success',fail:'FAIL' }; 
const failMessage = {status:'faIL'};
const noteFoundMessage={status:'FAIL',not_found:'Not Found'};
const errorMessage = { status: 'error',something_went:'something went wrong',not_found:'Not Found' };
const status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
  unprocessable :422,
  forbidden : 403
};

const trip_statuses = {
  active: 1.00,
  cancelled: 2.00,
}
module.exports = {
  successMessage,
  errorMessage,
  status,
  trip_statuses,
  failMessage,
  noteFoundMessage
};