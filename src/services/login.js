const axios = require('axios');

export async function loginUser({username, password}) {
    const payload = {
        query : `mutation Login {
            login(email: "${username}", password: "${password}") {
              token
            }
        }`
    };

    try {
        const data = await axios.post('/graphql', payload, {
            headers: {
              'content-type': 'application/json'
            }
        });
        // fetch('/graphql', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'authorization' : token
        //     },
        //     body: JSON.stringify(payload)
        // });

        return data.data;
    } catch (error) {
        throw error;
    }
}