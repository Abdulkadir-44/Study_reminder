import { createSlice } from "@reduxjs/toolkit"

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user  : storedUser || null
};

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        userLogin : (state,action)=>{
            state.user = action.payload;
            localStorage.setItem("user",JSON.stringify(action.payload));
        },
        userLogout : (state)=>{
            state.user = null;
            localStorage.removeItem("user");
        }
    }
})

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;
