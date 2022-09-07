import { create } from '@mui/material/styles/createTransitions';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

const useFetchProfile = (queryName, dataSelection) => ({ queryArgs, feedbackOptions, queryOptions, queryCallbacks, queryClient }) => {
    const { selectedProfileName, initialProfileData, selectedProfileNames, initialProfilesData } = queryArgs;
    const many = selectedProfileName === undefined;
    const argName = !many ? 'name' : 'names';
    const argType = !many ? 'String!' : '[String!]!';
    const argValue = !many ? selectedProfileName : selectedProfileNames;
    const initialData = !many ? initialProfileData : initialProfilesData;
    const { enabled } = queryOptions;
    const myQueryKey = [
        `${queryName}${!many ? '' : 's'}`,
        {
            graphqlArgs: {
                args: {
                    [argName] : { graphqlType: argType, value : argValue }
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
            data: initialData,
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
    total
}`);

const useFetchIncomeProfile = useFetchProfile('loadIncomeProfile', `{
    income {
        income,
        increase,
        period
    }
    incomeFrequency
    increaseFrequency
}`);

const useFetchMarketProfile = useFetchProfile('loadMarketProfile', `{
    variations {
        year,
        igr,
        ir
    }
}`);

const useFetchMySpendingsProfileNames = useFetchMyProfileNames('mySpendingsProfileNames');
const useFetchMyIncomeProfileNames = useFetchMyProfileNames('myIncomeProfileNames');
const useFetchMyMarketProfileNames = useFetchMyProfileNames('myMarketProfileNames');

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
            total: { graphqlType : 'Float!', value : totalValue }
        },
        selection: undefined
    }
});

const useSaveIncomeProfile = useSaveProfile('saveIncomeProfile', (mutationArgs) => {
    const { nameValue, incomeValue, incomeFrequencyValue, increaseFrequencyValue } = mutationArgs;
    return {
        args: {
            name: { graphqlType : 'String!', value: nameValue },
            income: {
                graphqlType: '[IncomeInput!]!',
                value: incomeValue
            },
            incomeFrequency: { graphqlType : 'Int!', value : incomeFrequencyValue },
            increaseFrequency: { graphqlType : 'Int!', value : increaseFrequencyValue }
        },
        selection: undefined
    }
});

const useSaveMarketProfile = useSaveProfile('saveMarketProfile', (mutationArgs) => {
    const { nameValue, variationsValue } = mutationArgs;
    return {
        args: {
            name: { graphqlType : 'String!', value: nameValue },
            variations: {
                graphqlType: '[MarketYearInput!]!',
                value: variationsValue
            }
        },
        selection: undefined
    }
});

const useCreateSpendingsProfile = useSaveSpendingsProfile(false);
const useCreateIncomeProfile = useSaveIncomeProfile(false);
const useCreateMarketProfile = useSaveMarketProfile(false);
const useOverwriteSpendingsProfile = useSaveSpendingsProfile(true);
const useOverwriteIncomeProfile = useSaveIncomeProfile(true);
const useOverwriteMarketProfile = useSaveMarketProfile(true);

const useRemoveSpendingsProfile = useRemoveProfile('removeSpendingsProfile', (mutationArgs) => {
    const { nameValue } = mutationArgs;
    return {
        args: {
            name: { graphqlType : 'String!', value: nameValue },
        },
        selection: undefined
    }
});

const useRemoveIncomeProfile = useRemoveProfile('removeIncomeProfile', (mutationArgs) => {
    const { nameValue } = mutationArgs;
    return {
        args: {
            name: { graphqlType : 'String!', value: nameValue },
        },
        selection: undefined
    }
});

const useRemoveMarketProfile = useRemoveProfile('removeMarketProfile', (mutationArgs) => {
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
    useFetchNames: useFetchMyIncomeProfileNames,
    useFetchProfile: useFetchIncomeProfile,
    useCreateProfile: useCreateIncomeProfile,
    useOverwriteProfile: useOverwriteIncomeProfile,
    useRemoveProfile: useRemoveIncomeProfile
}

export const manageMarket = {
    useFetchNames: useFetchMyMarketProfileNames,
    useFetchProfile: useFetchMarketProfile,
    useCreateProfile: useCreateMarketProfile,
    useOverwriteProfile: useOverwriteMarketProfile,
    useRemoveProfile: useRemoveMarketProfile
}