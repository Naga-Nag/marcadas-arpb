<script>
    import {redirect} from '@sveltejs/kit'

    let username = '';
    let password = '';
    let error = '';

    let registerUsername = '';
    let registerPassword = '';
    let registerError = '';

    async function handleLogin() {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const { token } = await response.json();
            
            //DEBUG
            console.log(token);

            localStorage.setItem('token', token); // Store the token
            redirect(308, '/main'); // Redirect to the admin page
        } catch (err) {
            error = err.message;
        }
    }

    async function handleRegister() {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: registerUsername, password: registerPassword }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            registerError = '';
            username = registerUsername;
            password = registerPassword;
            registerUsername = '';
            registerPassword = '';
        } catch (err) {
            registerError = err.message;
        }
    }
</script>

<form on:submit|preventDefault={handleLogin}>
    <input type="text" bind:value={username} placeholder="Username" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
</form>

<p>or</p>

<form on:submit|preventDefault={handleRegister}>
    <input type="text" bind:value={registerUsername} placeholder="Register username" required />
    <input type="password" bind:value={registerPassword} placeholder="Register password" required />
    <button type="submit">Register</button>
</form>

{#if error}
    <p style="color: red;">{error}</p>
{/if}

{#if registerError}
    <p style="color: red;">{registerError}</p>
{/if}
