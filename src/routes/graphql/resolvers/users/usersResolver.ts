import { User } from "../../types/userType.js";

export const usersResolver = {
    Query: {
        users: () => {
            return [];
        }
    }
}
