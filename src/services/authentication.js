import axios from 'axios';

export async function loginUser({username, password}) {
    const payload = {
        query : `mutation Login {
            login(email: "${username}", password: "${password}") {
              token
              _id
            }
        }`
    };

    try {
        const data = await axios.post('/graphql', payload, {
            headers: {
              'content-type': 'application/json'
            }
        });

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function signupUser({username, password, country}) {
    const payload = {
        query : `mutation Signup {
            signup(email: "${username}", password: "${password}") {
              token
              _id
            }
        }`
    };

    try {
        const data = await axios.post('/graphql', payload, {
            headers: {
              'content-type': 'application/json'
            }
        });

        return data.data;
    } catch (error) {
        throw error;
    }
}