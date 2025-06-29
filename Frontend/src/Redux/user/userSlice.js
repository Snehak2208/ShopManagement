import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userRole: null, // 'shopkeeper' or 'customer'
    userProfile: null,
    isProfileLoaded: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserRole: (state, action) => {
            state.userRole = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
            state.isProfileLoaded = true;
        },
        clearUserData: (state) => {
            state.userRole = null;
            state.userProfile = null;
            state.isProfileLoaded = false;
        }
    }
})

export const { setUserRole, setUserProfile, clearUserData } = userSlice.actions
export default userSlice.reducer 