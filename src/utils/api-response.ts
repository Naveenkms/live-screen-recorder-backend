class ApiResponse {
  public status: number;
  public success: boolean;
  public data: unknown;
  public message: string;
  constructor(status: number, data: unknown, message: string = "Success") {
    this.status = status;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
