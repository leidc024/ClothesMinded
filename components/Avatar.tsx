import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { getAvatarUriByUserID } from '@/contexts/database';

import { useUser } from '@/contexts/UserContext';

const Avatar = () => {
    
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { current:user } = useUser();

    useEffect(() => {

        const bucketId = '6825d9f500066a3dc28e';
        async function fetchAvatarId() {
            if (!user) return;
            const url = await getAvatarUriByUserID(user.$id);
            setImageUrl(url);
        }
        fetchAvatarId();
        
    }, []);

    return (
        <View>
            {imageUrl ? (
                <Image  
                    source={{ uri: imageUrl }}
                    className="h-full aspect-square"
                    resizeMode='contain'
                />
            ) : (
                <ActivityIndicator size="large" />
            )}
        </View>
    );
};

export default Avatar;


