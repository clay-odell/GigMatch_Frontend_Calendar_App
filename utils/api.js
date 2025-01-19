import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

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
    return res.user;
  }
  static async getAllUsers(requester) {
    const res = await this.request("admin/users", requester);
    return res;
  }

  static async createEventRequest(data) {
    const res = await this.request("event", data, "post");
    return res;
  }
  static async updateUser(userId, data) {
    
    const res = await this.request(`user/${userId}`, data, "put");
    
    return res;
  }

  static async updateEventRequest(requestId, data) {
    const res = await this.request(`event/${requestId}`, data, "put");
    return res;
  }

  static async getAllEventRequests() {
    const res = await this.request("event");
    return res;
  }

  static async getEventRequestsByUserId(userId) {
    const res = await this.request(`user/events/${userId}`);
    return res;
  }

  static async getEventRequestsByStatus(status) {
    const res = await this.request(`event/${status}`);
    return res;
  }
  static async deleteEventRequestByRequestId(requestId) {
    const res = await this.request(`admin/event-requests/${requestId}`, {}, "delete");
    return res;
  }
  static async deleteUser(userId) {
    const res = await this.request(`admin/users/${userId}`, {}, "delete");
    return res;
    }
  
}

export default GigMatchApi;
