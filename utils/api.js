import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://gigmatch-backend.onrender.com";

class GigMatchApi {
  static token = localStorage.getItem("token");

  static storeToken(newToken) {
    this.token = newToken;
    localStorage.setItem("token", newToken);
  }

  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && {
        Authorization: `Bearer ${this.token}`,
      }),
    };

    try {
      const response = await axios({
        url,
        method,
        headers,
        ...(method !== "get" && { data }),
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error with ${method} request to ${url}:`,
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  }

  static async userLogin(data) {
    const res = await this.request("user/login", data, "post");
    this.storeToken(res.token);
    return res;
  }

  static async adminLogin(data) {
    const res = await this.request("admin/login", data, "post");
    this.storeToken(res.token);
    return res;
  }

  static async registerUser(data) {
    const res = await this.request("user/register", data, "post");
    return res;
  }

  static async registerAdmin(data) {
    const res = await this.request("admin/register", data, "post");
    return res;
  }
  static async getAllUsers(requester) {
    const res = await this.request("admin/users", requester);
    return res;
  }

  static async createEventRequest(data) {
    const res = await this.request("event", data, "post");
    return res;
  }
  static async updateUser(userid, data) {
    const res = await this.request(`user/${userid}`, data, "put");

    return res;
  }

  static async updateEventRequest(requestid, data) {
    const res = await this.request(`event/${requestid}`, data, "put");
    return res;
  }

  static async getAllEventRequests() {
    const res = await this.request("event");
    return res;
  }

  static async getEventRequestsByUserId(userid) {
    const res = await this.request(`user/events/${userid}`);
    return res;
  }

  static async getEventRequestsByStatus(status) {
    const res = await this.request(`event/${status}`);
    return res;
  }
  static async deleteEventRequestByRequestId(requestid) {
    const res = await this.request(
      `admin/event-requests/${requestid}`,
      {},
      "delete"
    );
    return res;
  }
  static async deleteUser(userid) {
    const res = await this.request(`admin/users/${userid}`, {}, "delete");
    console.log("Delete User Res", res);
    return res;
  }
}

export default GigMatchApi;
