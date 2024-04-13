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
        logoutUser: (state) => {
            state.role = null;
        }
    }
})

export const {setSecurityState, setAdminState, setUser, logoutUser} = userSlice.actions;
export default userSlice.reducer;