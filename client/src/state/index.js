import { createSlice } from "@reduxjs/toolkit";

// below state will be stored in global state
// so this data will be accessible from anywhere
// throughout the application
const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else{
                console.error("User friends non-existent :(");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if(post._id === action.payload.post_id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;

// above `reducers` can be considered as functions but they
// differ from regular functions in the fact that
// these modify our global state

// When an action is dispatched in the Redux store, the reducer 
// function will be called with the current state and the action object. 
// The function will determine which action to perform based on the type
// of the action object and return a new state object that reflects the changes made by the action.