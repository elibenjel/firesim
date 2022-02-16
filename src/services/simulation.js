import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

const useFetchProfile = (queryName, dataSelection) => ({ queryArgs, feedbackOptions, queryOptions, queryCallbacks, queryClient }) => {
    const { selectedProfileName, initialProfileData } = queryArgs;
    const { enabled } = queryOptions;
    const myQueryKey = [
        queryName,
        {
            graphqlArgs: {
                args: {
                    name : { graphqlType: 'String!', value : selectedProfileName }
                },
                selection: dataSelection
            },
            feedbackOptions
        },
    ];

    const myQueryOptions = {
        ...queryCallbacks,
        enabled,
        refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false,
        keepPreviousData: true, cacheTime: 0,
        initialData: {
            error: null,
            data: initialProfileData,
            feedback: ''
        }
    };

    return { myQueryKey, ...useQuery(myQueryKey, myQueryOptions) };
}

const useFetchMyProfileNames = (queryName) => () => {
    const myQueryKey = [
        queryName,
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

const useFetchSpendingsProfile = useFetchProfile('loadSpendingsProfile', `{
    spendings {
        label,
        amount,
        frequency
    }
}`);

const useFetchMySpendingsProfileNames = useFetchMyProfileNames('mySpendingsProfileNames');

const useRemoveProfile = (mutationName, createGraphqlArgs) => () => {
    const { mutate } = useMutation();
    return {
        mutate: ({ mutationArgs, feedbackOptions, mutationCallbacks }) => {
            const { nameValue } = mutationArgs;
            const payload = [
                mutationName,
                {
                    graphqlArgs: createGraphqlArgs(mutationArgs),
                    feedbackOptions
                }
            ];

            mutate(payload, mutationCallbacks);
        }
    }
}

const useSaveProfile = (mutationName, createGraphqlArgs) => (overwrite) => () => {
    const { mutate } = useMutation();
    return {
        mutate: ({ mutationArgs, feedbackOptions, mutationCallbacks }) => {
            const graphqlArgs = createGraphqlArgs(mutationArgs);
            graphqlArgs.args.overwrite = { graphqlType : 'Boolean', value : overwrite };
            const payload = [
                mutationName,
                {
                    graphqlArgs,
                    feedbackOptions
                }
            ];

            mutate(payload, mutationCallbacks);
        }
    }
}

const useSaveSpendingsProfile = useSaveProfile('saveSpendingsProfile', (mutationArgs) => {
    const { nameValue, spendingsValue, totalValue } = mutationArgs;
    return {
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
        },
        selection: undefined
    }
});

const useCreateSpendingsProfile = useSaveSpendingsProfile(false);
const useOverwriteSpendingsProfile = useSaveSpendingsProfile(true);
const useRemoveSpendingsProfile = useRemoveProfile('removeSpendingsProfile', (mutationArgs) => {
    const { nameValue } = mutationArgs;
    return {
        args: {
            name: { graphqlType : 'String!', value: nameValue },
        },
        selection: undefined
    }
});

export const manageSpendings = {
    useFetchNames: useFetchMySpendingsProfileNames,
    useFetchProfile: useFetchSpendingsProfile,
    useCreateProfile: useCreateSpendingsProfile,
    useOverwriteProfile: useOverwriteSpendingsProfile,
    useRemoveProfile: useRemoveSpendingsProfile
}

export const manageIncome = {
    useFetchNames: useFetchMySpendingsProfileNames,
    useFetchProfile: useFetchSpendingsProfile,
    useCreateProfile: useCreateSpendingsProfile,
    useOverwriteProfile: useOverwriteSpendingsProfile,
    useRemoveProfile: useRemoveSpendingsProfile
}