import axios from 'axios';

export async function fetchMySpendingProfileNames() {
    const payload = {
        query : `query Query {
            mySpendingProfileNames
        }`
    };

    try {
        const data = await axios.post('/graphql', JSON.stringify(payload), {
            headers: {
              'content-type': 'application/json'
            },
        });

        return data.data.data.mySpendingProfileNames;
    } catch (error) {
        throw error;
    }
}

export async function fetchRequestedProfile({ queryKey }) {
    const [_, { name }] = queryKey;
    const payload = {
        query : `query LoadSpendingProfile($name: String!) {
            loadSpendingProfile(name: $name) {
              spendings {
                label,
                amount,
                frequency
              }
            }
          }`,
          variables: {
              name
          }
    };

    try {
        const data = await axios.post('/graphql', JSON.stringify(payload), {
            headers: {
                'content-type': 'application/json',
                // 'Cache-Control': 'no-cache',
                // 'Pragma': 'no-cache',
                // 'Expires': '0',
            },
        });
        console.log('fetched : ', data)
        return data.data.data.loadSpendingProfile.spendings.map(item => {
            return {
                defaultName: item.label,
                defaultAmount: item.amount,
                defaultTPY: item.frequency
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function saveSpendingProfile({ name, spendings, total, overwrite = false }) {
    const payload = {
        query : `mutation SaveSpendingProfile($name: String!, $spendings: [SpendingInput!]!, $total: Float!, $overwrite: Boolean) {
            saveSpendingProfile(name: $name, spendings: $spendings, total: $total, overwrite: $overwrite)
        }`,
        variables: {
            name, spendings, total, overwrite
        }
    };

    try {
        const data = await axios.post('/graphql', JSON.stringify(payload), {
            headers: {
              'content-type': 'application/json'
            },
        });

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function removeSpendingProfile({ name }) {
    const payload = {
        query : `mutation RemoveSpendingProfile($name: String!) {
            removeSpendingProfile(name: $name)
        }`,
        variables: {
            name
        }
    };

    try {
        const data = await axios.post('/graphql', JSON.stringify(payload), {
            headers: {
              'content-type': 'application/json'
            },
        });

        return data.data;
    } catch (error) {
        throw error;
    }
}
