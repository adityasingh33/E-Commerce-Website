import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users/';

const register  = async(userData) => {
    const response  = await axios.post(API_URL + 'register',userData);

    return response.data;
}

const login = async(userData) => {
    const response = await axios.post(API_URL + 'login',userData);

    if (response.data){
        localStorage.setItem('user',JSON.stringify(response.data));
    }

    return response.data;
}

const logout = () => {
    localStorage.removeItem('user');
    // You might want to also call an API endpoint to invalidate the token on the server
};
const authService = {
  register,
  login,
  logout
}

export default authService 
