import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ScrollView,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { COLORS, GLOBAL_STYLES } from '../styles/theme';
import i18n from '../i18n';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { resolveTask } from '../utils/api';

const WorkCompletionScreen = ({ route, navigation }) => {
    const { task } = route.params || {};
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraVisible, setCameraVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [comment, setComment] = useState('');
    const [satisfaction, setSatisfaction] = useState('Good');
    const [location, setLocation] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(i18n.t('permissionDenied'), i18n.t('locationPermissionRequired'));
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                setImage(photo.uri);
                setCameraVisible(false);
            } catch (e) {
                Alert.alert(i18n.t('error'), i18n.t('cameraError'));
            }
        }
    };

    const handleSubmit = async () => {
        if (!image) {
            Alert.alert(i18n.t('evidenceRequired'), i18n.t('uploadProof'));
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: image,
                name: 'proof.jpg',
                type: 'image/jpeg',
            });
            formData.append('latitude', location?.coords?.latitude?.toString() || '0');
            formData.append('longitude', location?.coords?.longitude?.toString() || '0');
            formData.append('comment', comment);

            // Use the task ID from params, fallback if missing
            const taskId = task?.id;
            if (!taskId) throw new Error("Task ID missing");

            await resolveTask(taskId, formData);

            navigation.replace('Success', {
                taskTitle: task?.title || i18n.t('taskCompleted'),
                points: 50
            });
        } catch (error) {
            console.error("Resolve Task Error:", error);
            Alert.alert(i18n.t('error'), i18n.t('submissionFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    if (cameraVisible) {
        if (!permission) {
            // Camera permissions are still loading.
            return <View />;
        }

        if (!permission.granted) {
            return (
                <View style={GLOBAL_STYLES.container}>
                    <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.button}>
                        <Text style={styles.buttonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                    <View style={styles.cameraControls}>
                        <TouchableOpacity
                            style={styles.closeCameraButton}
                            onPress={() => setCameraVisible(false)}
                        >
                            <Ionicons name="close" size={30} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        );
    }

    return (
        <View style={GLOBAL_STYLES.container}>
            <Header title="Work Completion" showLogo={false} />
            <ScrollView contentContainerStyle={styles.content}>

                {/* Task Summary */}
                <View style={styles.section}>
                    <Text style={styles.label}>Task</Text>
                    <Text style={styles.value}>{task?.title || 'Quick Upload'}</Text>
                    {location && (
                        <Text style={styles.gpsText}>
                            GPS: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                        </Text>
                    )}
                </View>

                {/* Photo Upload */}
                <View style={styles.section}>
                    <Text style={styles.label}>{i18n.t('uploadProof')}</Text>
                    {image ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.retakeButton} onPress={() => setCameraVisible(true)}>
                                <Ionicons name="camera-reverse" size={20} color={COLORS.white} />
                                <Text style={styles.retakeText}>Retake</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadButton} onPress={() => setCameraVisible(true)}>
                            <Ionicons name="camera" size={40} color={COLORS.textSecondary} />
                            <Text style={styles.uploadText}>Tap to Capture</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Comment */}
                <View style={styles.section}>
                    <Text style={styles.label}>Note (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a note..."
                        multiline
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>

                {/* Satisfaction */}
                <View style={styles.section}>
                    <Text style={styles.label}>{i18n.t('satisfaction')}</Text>
                    <View style={styles.satisfactionRow}>
                        {['Poor', 'Good', 'Excellent'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.satisfactionButton,
                                    satisfaction === level && styles.activeSatisfaction
                                ]}
                                onPress={() => setSatisfaction(level)}
                            >
                                <Text style={[
                                    styles.satisfactionText,
                                    satisfaction === level && { color: COLORS.white }
                                ]}>{level}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{i18n.t('submit')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        color: COLORS.primary,
    },
    gpsText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    uploadButton: {
        height: 150,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    uploadText: {
        marginTop: 10,
        color: COLORS.textSecondary,
    },
    imagePreviewContainer: {
        position: 'relative',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    retakeButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
    },
    retakeText: {
        color: COLORS.white,
        marginLeft: 5,
        fontSize: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: COLORS.white,
    },
    satisfactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    satisfactionButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginHorizontal: 4,
        backgroundColor: COLORS.white,
    },
    activeSatisfaction: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    satisfactionText: {
        fontWeight: '600',
        color: COLORS.text,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    closeCameraButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
    },
    captureButton: {
        alignSelf: 'flex-end',
        marginBottom: 40,
    },
    captureInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.white,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.5)',
    },
});

export default WorkCompletionScreen;
