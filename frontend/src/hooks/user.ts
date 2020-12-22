import { create } from "domain";
import { createContext, useContext } from "react";
import { User } from "../__generated__/types";

export const userContext = createContext<User>({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
})

export function useUser() {
    return useContext(userContext)
}