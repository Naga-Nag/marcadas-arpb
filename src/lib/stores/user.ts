import { writable } from 'svelte/store';
import type { shortWebUser } from '$lib/types/gen';

export const userStore = writable<shortWebUser | undefined>(undefined);

export const setUser = (newUser: shortWebUser) => {
    userStore.set(newUser);
};

export const getUser = (): shortWebUser => {
    let user: shortWebUser | undefined;
    userStore.subscribe(value => user = value)();
    if (user === undefined) {
        throw new Error('User not logged in');
    }
    return user;
};

export const clearUser = () => {
    userStore.set(undefined);
};

export const isAdmin = (user: shortWebUser) => {
     return user.role === 'ADMIN';
}

userStore.subscribe((value) => {
    console.log('userStore data ::  =>', value);
});

export default userStore;