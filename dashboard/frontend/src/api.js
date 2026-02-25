import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api";

export const getPrices = () => axios.get(`${BASE_URL}/prices`);
export const getChangePoint = () => axios.get(`${BASE_URL}/change-point`);
export const getEvents = () => axios.get(`${BASE_URL}/events`);