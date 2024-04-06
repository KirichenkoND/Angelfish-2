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
        }
    }
})

export const {setSecurityState, setAdminState} = userSlice.actions;
export default userSlice.reducer;