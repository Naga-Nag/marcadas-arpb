import { get, writable } from 'svelte/store';
import type { shortWebUser } from '$lib/types/gen';

export const userStore = writable<shortWebUser | undefined>(undefined);

export const setUser = (newUser: shortWebUser) => {
    if (!(get(userStore) === undefined)) {

    }
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

export const isCleared = () => {
    return getUser() === undefined;
};

export const clearUser = () => {
    userStore.set(undefined);
};

export const isAdmin = (user: shortWebUser) => {
    return user.role === 'ADMIN';
}

export const getDepartamentosPermitidos = () => {
    let departamentos: string[] = [];
    userStore.subscribe(state => {
        if (state) {
            departamentos = state.departamentosPermitidos;
        }
    })();
    return departamentos;
}
userStore.subscribe((value) => {
    console.log('userStore data ::  =>', value);
});

export default userStore;