class ApiResponse {
  constructor(statuscode, message = 'Successfully fetched data', data = null) {
    this.statuscode = statuscode;
    this.message = message;
    this.data = data;
    this.success = statuscode < 400;
  }
}

export { ApiResponse };
