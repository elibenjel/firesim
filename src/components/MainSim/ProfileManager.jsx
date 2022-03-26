import React, { useEffect, useState, useRef } from "react";
import { useQueryClient } from 'react-query';
import {
    Box,
    Paper,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';


const ProfileManager = (props) => {
    const {
        tradHook: t,
        initialProfileData,
        managerFunctions,
        profileData,
        children
    } = props;

    const { useFetchNames, useFetchProfile, useCreateProfile, useOverwriteProfile, useRemoveProfile } = managerFunctions;
    // const [requestedProfile, setRequestedProfile] = useState(''); // no use, only selected profile and fetchedProfile
    // which profile do we want to request
    const [selectedProfileName, setSelectedProfileName] = useState('');
    const [newProfileName, setNewProfileName] = useState('');
    // if false, impossible to create or overwrite a profile
    const [isProfileLocked, setIsProfileLocked] = useState(false);
    
    // given to the content key prop and incremented when a new profile is successfully loaded for react to reset the content
    const profileKey = useRef(0);

    // only enable the query to load a profile when load button is clicked
    // the query should disable itself on settled
    const disableFetchProfileQuery = useRef(false);

    const queryClient = useQueryClient();

    const {
        data: fetchedProfile, refetch: refetchSelectedProfile
    } = useFetchProfile({
        queryArgs: { selectedProfileName, initialProfileData },
        queryOptions: { enabled : !disableFetchProfileQuery.current },
        queryCallbacks: {
            onSuccess: () => {
                disableFetchProfileQuery.current = true;
                profileKey.current += 1;
            }
        },
        queryClient,
        feedbackOptions: { replace : t('load-success') }
    });

    disableFetchProfileQuery.current = true;

    const { mutate : createProfile } = useCreateProfile();
    const { mutate : overwriteProfile } = useOverwriteProfile();
    const { mutate : removeProfile } = useRemoveProfile();

    const {
        myQueryKey: profileNamesQueryKey,
        data: profileNames,
        refetch: refetchProfileNames
    } = useFetchNames();

    // fetch this query on mount only: otherwise, when a profile is created or removed,
    // the new data is set on client-side, without refetching
    useEffect(() => {
        refetchProfileNames();
    }, []);

    const handleNewProfileNameChange = (event) => {
        setNewProfileName(event.target.value);
    }

    const handleSelectedProfileNameChange = (event) => {
        setSelectedProfileName(event.target.value);
    }

    const handleCreate = () => {
        const onCreateSuccess = () => {
            queryClient.setQueryData(profileNamesQueryKey, (current => {
                if (current.data.includes(newProfileName)) return current;
                return {
                    ...current,
                    data: [ ...current.data, newProfileName ]
                }
            }));
            setSelectedProfileName(newProfileName);
        }

        createProfile({
            mutationArgs: {
                nameValue: newProfileName,
                ...profileData.current
            },
            feedbackOptions: { onSuccess: { replace : t('create-success') } },
            mutationCallbacks: { onSuccess: onCreateSuccess }
        });

    };

    const handleLoad = () => {
        disableFetchProfileQuery.current = false;
        refetchSelectedProfile();
    }

    const handleOverwrite = () => {
        overwriteProfile({
            mutationArgs: {
                nameValue: selectedProfileName,
                ...profileData.current
            },
            feedbackOptions: { onSuccess: { replace : t('overwrite-success') } }
        });
    }

    const handleRemove = () => {
        const onRemoveSuccess = () => {
            queryClient.setQueryData(profileNamesQueryKey, (current => {
                return {
                    ...current,
                    data: current.data.filter(item => item !== selectedProfileName)
                }
            }));
            (fetchedProfile.name && selectedProfileName !== fetchedProfile.name) ?
            setSelectedProfileName(fetchedProfile.name) : setSelectedProfileName('');
        }

        removeProfile({
            mutationArgs: { nameValue: selectedProfileName },
            feedbackOptions: { onSuccess: { replace : t('remove-success') } },
            mutationCallbacks: { onSuccess: onRemoveSuccess }
        });
    }

    const newProfileNameFieldProps = {
        id: `profile-name-input`, variant: 'filled',
        label: t('create-label'), size: 'small', value: newProfileName,
        color: 'success'
    };

    const profileNameSelectorProps = {
        id: `profile-name-selector`, variant: 'filled', value: selectedProfileName,
        label: t('select-label'), size: 'small', color: 'success', sx: { minWidth: 300, ml: 15 }
    }

    const childrenProps = {
        tradHook: t, initial: fetchedProfile, setIsProfileLocked
    }

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-around', alignItems: 'center',
            p: 1, m: 1,
            width: '99%'
        }}>
            <Paper elevation={1} p={1} sx={{
                alignSelf : 'flex-start',
                display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
                p: 1
                }} >
                    <TextField {...newProfileNameFieldProps} onChange={handleNewProfileNameChange} />
                    <Button variant='contained' color='primary'
                        onClick={handleCreate}
                        disabled={!isProfileLocked || newProfileName.length === 0}
                        sx={{ ml : 1 }}>{t('create')}</Button>
                    <TextField select {...profileNameSelectorProps} onChange={handleSelectedProfileNameChange}
                        children={
                            profileNames ?
                            profileNames.map((item) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))
                            : <MenuItem key={''} value={''}>{''}</MenuItem>
                    }/>
                    <Button variant='contained' color='primary'
                        onClick={handleLoad}
                        disabled={selectedProfileName.length === 0}
                        sx={{ ml : 1 }}>{t('load')}</Button>
                    <Button variant='contained' color='primary'
                        onClick={handleOverwrite}
                        disabled={!isProfileLocked || selectedProfileName.length === 0}
                        sx={{ ml : 1 }}>{t('overwrite')}</Button>
                    <Button variant='contained' color='primary'
                        onClick={handleRemove}
                        disabled={selectedProfileName.length === 0}
                        sx={{ ml : 1 }}>{t('remove')}</Button>
            </Paper>
            {children({ key : profileKey.current, props : childrenProps })}
            {/* <sPanel key={profileKey.current} {...childrenProps} /> */}
        </Box>
    )
}

export default ProfileManager;