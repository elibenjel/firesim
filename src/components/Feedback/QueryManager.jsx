import React, { useState, useRef } from "react";
import {
    Snackbar,
    Alert,
    Slide
} from '@mui/material';
import axios from 'axios';

const getdefaultRQFn = (isMutation) => async (obj) => {
    const queryKey = isMutation ? obj : obj.queryKey;
    const [key, { graphqlArgs = {}, feedbackOptions = {} }] = queryKey;
    const { args = {}, selection = '' } = graphqlArgs;
    let emptyArgs = true;
    for (const _ in args) {
        emptyArgs = false;
        break;
    }

    let queryName;
    let queryBody;
    if (Array.isArray(key)) {
        queryName = isMutation ? 'Mutation' : 'Query';
        queryBody = key.join('\n');
    } else {
        queryName = key.charAt(0).toUpperCase() + key.slice(1);
        queryBody = key;
    }

    const queryNameArgs = Object.entries(args).map(([arg, { graphqlType, value }]) => {
        const argName = Array.isArray(key) ? arg.join('_') : arg;
        return `$${argName}: ${graphqlType}`;
    }).join(', ');
    const queryArgs = Object.entries(args).map(([arg, { graphqlType, value }]) => {
        const argName = Array.isArray(key) ? arg.join('_') : arg;
        return `${argName}: $${argName}`;
    }).join(', ');
    const query = `${isMutation ? 'mutation' : 'query'} ${queryName}${emptyArgs ? '' : `(${queryNameArgs})`} {
        ${queryBody}${emptyArgs ? '' : `(${queryArgs})`}${selection}
    }`;

    const payload = {
        query,
        variables: Object.entries(args).reduce((prev, [argName, { value }]) => ({ ...prev, [argName]: value }), {})
    };
    
    const createFeedback = (onState) => (fb) => {
        const options = feedbackOptions[onState] || feedbackOptions;
        return (
            options.replace ||
            `${options.insert || ''}${fb}${options.append || ''}`
        );
    }
  
    const res = {};
    try {
        const data = await axios.post('/graphql', JSON.stringify(payload), {
            headers: {
                'content-type': 'application/json'
            },
        });
  
        res.error = data.data.errors;
        if (!res.error) {
            res.data = Array.isArray(key) ? data.data.data : data.data.data[key];
            res.feedback = feedbackOptions.disable || feedbackOptions.disableOnSuccess ? ''
            : createFeedback('onSuccess')(`Successfully fetched ${Array.isArray(key) ? key.join(', ') : key}`);
            return res;
        }
  
        // if graphql returned some errors without throwing them,
        // do so here
        throw res.error;
    } catch (error) {
        res.error = error;
        res.feedback = feedbackOptions.disable || feedbackOptions.disableOnError ? ''
        : createFeedback('onError')(`Failed to fetch ${key} : ${res.error.map ? res.error.map(item => item.extensions.code).join(' | ') : res.error}`);
        throw res;
    }
}
  
const defaultQueryFn = getdefaultRQFn(false);
const defaultMutationFn = getdefaultRQFn(true);

const QueryManager = (props) => {
    const { queryClient } = props;
    const [makeFeedback, setMakeFeedback] = useState(false);
    const feedback = useRef('');
    const feedbackSeverity = useRef('info');
    const currentFeedback = useRef('');
    const currentFeedbackSeverity = useRef('info');
    if (makeFeedback) {
        currentFeedback.current = feedback.current;
        currentFeedbackSeverity.current = feedbackSeverity.current;
    }

    // select function is called only when query is successful
    // used to destructure the res object and keep only the data
    // while retrieving the feedback to display
    const defaultSelect = (res) => {
        const { data, feedback : fb } = res;
        feedback.current = fb;
        return data;
    }

    const defaultOnSettled = (onSuccessArg, onErrorArg) => {
        if (onErrorArg) {
            feedback.current = onErrorArg.feedback;
            feedbackSeverity.current = 'error';
        } else {
            feedbackSeverity.current = 'success';
        }
        !!feedback.current && setMakeFeedback(true)
    };

    // also it is not called for mutations
    // so we need to have a specific onSuccess for mutations
    // to track the value of feedback
    const defaultOnMutationSettled = (onSuccessArg, onErrorArg) => {
        defaultOnSettled(defaultSelect(onSuccessArg || {}), onErrorArg);
    };

    queryClient.setDefaultOptions({
        queries: {
            queryFn: defaultQueryFn,
            select: defaultSelect,
            onSettled: defaultOnSettled,
            retry: false
        },
        mutations: {
            mutationFn: defaultMutationFn,
            onSettled: defaultOnMutationSettled,
            retry: false
        }
    });

    const onSnackbarClose = () => {
        setMakeFeedback(false);
    }

    return (
        <Snackbar open={makeFeedback} autoHideDuration={5000}
            anchorOrigin={{ vertical : 'top', horizontal : 'center' }}
            TransitionComponent={Slide}
            onClose={onSnackbarClose} >
            <Alert onClose={onSnackbarClose} severity={makeFeedback ? feedbackSeverity.current : currentFeedbackSeverity.current} sx={{ width: '100%' }}>
                {makeFeedback ? feedback.current : currentFeedback.current}
            </Alert>
        </Snackbar>
    )
}

export default QueryManager;