import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    getAll
};

function login(UserName, Password) {
    var cred = {
        UserName: "test",
        Password: "test",
        FirstName: "SEW",
        LastName: "SEW",
        EmailAddress: "Sew@smartenergywater.com"
    };
    localStorage.setItem('cred', cred);
    return fetch(`api/Login/Authenticate`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cred)
    })
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(UserName + ':' + Password);
                localStorage.setItem('user', JSON.stringify(user.firstName));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}