export const MOCK_USER = {
    id: 'W1001',
    name: 'Ramesh Kumar',
    role: 'Sanitation Worker',
    zone: 'North Zone, Delhi',
    profileImage: 'https://via.placeholder.com/150',
    totalTasks: 120,
    rating: 4.5,
};

export const MOCK_TASKS = [
    {
        id: 'T101',
        title: 'Garbage Collection - Sector 4',
        locationName: 'Sector 4, Market Area',
        coordinate: {
            latitude: 28.6139,
            longitude: 77.2090,
        },
        status: 'pending', // pending, in-progress, completed
        scheduledTime: '09:00 AM',
        priority: 'High',
        description: 'Collect garbage from the main market area bins.',
        instructions: 'Ensure all wet and dry waste is separated. Check for overflow.',
        distance: '2.5 km',
    },
    {
        id: 'T102',
        title: 'Street Cleaning - MG Road',
        locationName: 'MG Road, Block B',
        coordinate: {
            latitude: 28.6200,
            longitude: 77.2100,
        },
        status: 'pending',
        scheduledTime: '11:00 AM',
        priority: 'Medium',
        description: 'Sweep the street and clear drainage blockage if any.',
        instructions: 'Wear safety gear. Report any large debris.',
        distance: '3.0 km',
    },
    {
        id: 'T103',
        title: 'Park Maintenance',
        locationName: 'Central Park',
        coordinate: {
            latitude: 28.6100,
            longitude: 77.2050,
        },
        status: 'completed',
        scheduledTime: '07:00 AM',
        priority: 'Normal',
        description: 'Clean the walking tracks and empty dustbins.',
        instructions: 'Verify no plastic waste left on grass.',
        distance: '1.2 km',
    },
];
