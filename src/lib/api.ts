import ky from 'ky';

export const api = ky.create({
    prefixUrl: 'http://localhost:3000/api',
    hooks: {
        beforeRequest: [
            request => {
                const token = localStorage.getItem('token');
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            }
        ]
    }
});
