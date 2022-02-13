import axios from 'axios';
import { useMutation, useQuery } from 'react-query';


export const useFetchSpendingProfile = ({ queryArgs, feedbackOptions, queryOptions, queryCallbacks, queryClient }) => {
    const { requestedProfile, initialSpendings, spendingsContentKey } = queryArgs;
    const { enabled } = queryOptions;
    const myQueryKey = [
        'loadSpendingProfile',
        {
            graphqlArgs: {
                args: {
                    name : { graphqlType: 'String!', value : requestedProfile}
                },
                selection: `{
                    spendings {
                        label,
                        amount,
                        frequency
                    }
                }`
            },
            feedbackOptions
        },
        spendingsContentKey
    ];

    const myQueryOptions = {
        ...queryCallbacks,
        enabled,
        refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false,
        keepPreviousData: true, cacheTime: 0,
        initialData: {
            error: null,
            data: {
                spendings: initialSpendings
            },
            feedback: ''
        },
        select: (res) => {
            return queryClient.getDefaultOptions().queries.select(res).spendings.map(item => {
                return {
                    defaultName: item.label,
                    defaultAmount: item.amount,
                    defaultTPY: item.frequency
                }
            })
        }
    };
    return { myQueryKey, ...useQuery(myQueryKey, myQueryOptions) };
}

export const useFetchMySpendingProfileNames = () => {
    const myQueryKey = [
        'mySpendingProfileNames',
        {
            graphqlArgs : {},
            feedbackOptions : { disableOnSuccess : true }
        }
    ];

    const myQueryOptions = {
        refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false
    };
    return { myQueryKey, ...useQuery(myQueryKey, myQueryOptions) }
}

export const useCreateSpendingProfile = () => {
    const { mutate } = useMutation();
    return {
        mutate: ({ mutationArgs, feedbackOptions, mutationCallbacks }) => {
            const { nameValue, spendingsValue, totalValue } = mutationArgs;
            const payload = [
                'saveSpendingProfile',
                {
                    graphqlArgs: {
                        args: {
                            name: { graphqlType : 'String!', value: nameValue },
                            spendings: {
                                graphqlType: '[SpendingInput!]!',
                                value: spendingsValue.reduce((prev, curr) => {
                                    const { currentName : label, currentAmount : amount, currentTPY : frequency } = curr;
                                    return [...prev, { label, amount, frequency }]
                                }, [])
                            },
                            total: { graphqlType : 'Float!', value : totalValue },
                            overwrite: { graphqlType : 'Boolean', value : false }
                        }
                    },
                    feedbackOptions
                }
            ];

            mutate(payload, mutationCallbacks);
        }
    }
}

export const useOverwriteSpendingProfile = () => {
    const { mutate } = useMutation();
    return {
        mutate: ({ mutationArgs, feedbackOptions }) => {
            const { nameValue, spendingsValue, totalValue } = mutationArgs;
            const payload = [
                'saveSpendingProfile',
                {
                    graphqlArgs: {
                        args: {
                            name: { graphqlType : 'String!', value: nameValue },
                            spendings: {
                                graphqlType: '[SpendingInput!]!',
                                value: spendingsValue.reduce((prev, curr) => {
                                    const { currentName : label, currentAmount : amount, currentTPY : frequency } = curr;
                                    return [...prev, { label, amount, frequency }]
                                }, [])
                            },
                            total: { graphqlType : 'Float!', value : totalValue },
                            overwrite: { graphqlType : 'Boolean', value : true }
                        }
                    },
                    feedbackOptions
                }
            ];
    
            mutate(payload);
        }
    }
}

export const useRemoveSpendingProfile = () => {
    const { mutate } = useMutation();
    return {
        mutate: ({ mutationArgs, feedbackOptions, mutationCallbacks }) => {
            const { nameValue } = mutationArgs;
            const payload = [
                'removeSpendingProfile',
                {
                    graphqlArgs: {
                        args: {
                            name: { graphqlType : 'String!', value: nameValue },
                        }
                    },
                    feedbackOptions
                }
            ];

            mutate(payload, mutationCallbacks);
        }
    }
}
