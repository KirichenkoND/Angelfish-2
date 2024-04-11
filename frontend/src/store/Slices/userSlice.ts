import { createSlice } from '@reduxjs/toolkit';

export interface IUserSlice {
    role: null | "security" | "admin"
}

const initialState = {role: null} satisfies IUserSlice as IUserSlice

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSecurityState: (state) => {
            state.role = "security"
        },
        setAdminState: (state) => {
            state.role = "admin"
        },
        setUser: (state, action) => {
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.role = null;
        }
    }
})

export const {setSecurityState, setAdminState, setUser, logout} = userSlice.actions;
export default userSlice.reducer;