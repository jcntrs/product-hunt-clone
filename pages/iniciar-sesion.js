import { useState } from 'react'
import router from 'next/router';
import Layout from '../components/layouts/Layout';
import { css } from '@emotion/core';
import { Form, Field, InputSubmit, ErrorMessage } from '../components/ui/Form';
import useValidation from '../hooks/useValidation';
import validateLogin from '../validation/validateLogin';
import firebase from '../firebase';
import { route } from 'next/dist/next-server/server/router';

const initialState = {
    email: '',
    password: ''
}

const Login = () => {
    const [error, setError] = useState(false);
    const { values, errors, handleChange, handleSubmit } = useValidation(initialState, validateLogin, tryLogin);
    const { email, password } = values;

    async function tryLogin() {
        try {
            await firebase.login(email, password);
            router.push('/');
        } catch (error) {
            console.log('Error al autenticar usuario', error);
            setError(error.message);
        }
    }

    return (
        <>
            <Layout>
                <h1 css={css`text-align: center; margin-top: 5rem;`}>Iniciar Sesión</h1>
                <Form onSubmit={handleSubmit} noValidate>
                    <Field>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
                    </Field>
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    <Field>
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" type="password" name="password" placeholder="Contraseña" value={password} onChange={handleChange} />
                    </Field>
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <InputSubmit type="submit" value="Iniciar Sesión" />
                </Form>
            </Layout>
        </>
    );
}

export default Login;