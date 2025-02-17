<script lang="ts">
    import { enhance } from '$app/forms';

    export let form;

</script>


<form use:enhance method="post" action="?/login">
    <div class="form-item">
        <label for="username">username<sup><small class="required">*</small></sup></label>
        <input value={form?.username??''} id="username" type="username" name="username" required />
    </div>
    <div class="form-item">
        <label for="password">Password<sup><small class="required">*</small></sup></label>
        <input  id="password" type="password" name="password" required />
    </div>

    <div class="form-item">
        {#if form?.error}
        <small>{form?.message}</small>
        {/if}
    </div>

    <div class="form-item">
        <button type="submit">Login</button>
    </div>

</form>

<form use:enhance method="post" action="?/register">
    <div class="form-item">
        <label for="username">username<sup><small class="required">*</small></sup></label>
        <input id="username" type="username" name="username" required />
    </div>
    <div class="form-item">
        <label for="password">Password<sup><small class="required">*</small></sup></label>
        <input id="password" type="password" name="password" required />
    </div>
    <div class="form-item">
        <label for="departamento">Departamento<sup><small class="required">*</small></sup></label>
        <input id="departamento" type="departamento" name="departamento" required />
    </div>
    <div class="form-item">
        <button type="submit">Register</button>
    </div>
</form>

<style>
    div{
        color: #FFF;
        margin-bottom: .5em;
    }
    label{
        padding-right: .5em;
    }
    button{
        width: 100%;
        background-color: #FFF;
        transition: all 0.3s ease-in;
    }
    button:hover{
        cursor: pointer;
        text-decoration: underline;
        color: #FFF;
        background-color: #4d4c4c;
        transition: all 0.3s ease-in;
    }
    .form-item{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .required{
            padding-left: .5em;
            color: #ff0000;
        }
    .reset-link{
            color: #FFFFFF;
            text-decoration: none;
    }
    .reset-link:hover{
        text-decoration: underline;
    }
</style>