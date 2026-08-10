import axios from "axios";
import { Person } from "@/types/person";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const personApi = {
  getAll: async (): Promise<Person[]> => {
    const response = await apiClient.get<Person[]>("persons");
    return response.data;
  },
};
