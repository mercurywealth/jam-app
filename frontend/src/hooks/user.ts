import { createContext, useContext } from "react";
import { User } from "../__generated__/types";

export const userContext = createContext<User>({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    roles: [],
})

export function useUser() {
    return useContext(userContext)
}