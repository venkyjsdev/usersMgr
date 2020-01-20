module.exports = {
    name: 'users',
    description: 'user model to store the user details',
    comments: '',
    required: ['name', 'email', 'role'],
    enforceType: ['name', 'email', 'role', 'mobile', 'active', 'createdAt', 'updatedAt'],
    default: [
        { key: 'active', value: true },
        { key: 'createdAt', formula: 'new Date().getTime()' }, 
        { key: 'updatedAt', formula: 'new Date().getTime()' },
    ],
    model: {
        name: 'string',
        email: 'string',
        role: 'string',
        mobile: 0,
        active: true,
        createdAt: 0,
        updatedAt: 0
    }
}
