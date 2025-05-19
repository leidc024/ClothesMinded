import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Storage } from 'react-native-appwrite';

import { client } from '../lib/appwrite';

import { useUser } from '@/contexts/UserContext';

const Avatar = () => {
    
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { getPreferences } = useUser();

    useEffect(() => {

        const storage = new Storage(client);

        const bucketId = '6825d9f500066a3dc28e';
        async function fetchAvatarId() {
        const prefs = await getPreferences();
            if (prefs) {
                const fileId = prefs.avatarId; // Replace 'avatarId' with your key

                console.log("Avatar ID: ", fileId);

                const url = storage.getFileView(bucketId, fileId).href;
                console.log("Avatar URL: ", url);
                setImageUrl(url);
            }
        }
        fetchAvatarId();
        
    }, []);

    return (
        <View>
            {imageUrl ? (
                <Image  
                    source={{ uri: imageUrl }}
                    className="h-[90vh] aspect-square mt-24"
                    resizeMode='contain'
                />
            ) : (
                <ActivityIndicator size="large" />
            )}
        </View>
    );
};

export default Avatar;


