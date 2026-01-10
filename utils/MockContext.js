import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_TASKS } from '../services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MockContext = createContext();

export const MockProvider = ({ children }) => {
    // const [points, setPoints] = useState(100); // Removed per user request
    const [issues, setIssues] = useState([]); // Kept for task list state management if needed
    const [userLocation, setUserLocation] = useState({ city: 'Ahmedabad', address: 'Unknown' });
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial state
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const token = await AsyncStorage.getItem('userToken');
            if (userData && token) {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.log('Failed to load user', e);
        } finally {
            setIsLoading(false);
        }
    };

    const addIssue = (issue) => {
        setIssues(prev => [issue, ...prev]);
        // Points logic removed
    };

    const refreshIssues = async () => {
        // Mock refresh delay or implement real API call later
        return new Promise(resolve => setTimeout(resolve, 500));
    };

    const login = async (userData, token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
        } catch (e) {
            console.log('Login persistence error', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            setUser(null);
        } catch (e) {
            console.log('Logout error', e);
        }
    };

    return (
        <MockContext.Provider value={{
            // points, // Removed
            addIssue,
            issues,
            userLocation,
            setUserLocation,
            refreshIssues,
            user,
            login,
            logout,
            isLoading
        }}>
            {children}
        </MockContext.Provider>
    );
};

export const useMockContext = () => useContext(MockContext);
