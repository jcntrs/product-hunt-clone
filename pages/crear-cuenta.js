import { useState } from 'react'
import router from 'next/router';
import Layout from '../components/layouts/Layout';
import { css } from '@emotion/core';
import { Form, Field, InputSubmit, ErrorMessage } from '../components/ui/Form';
import useValidation from '../hooks/useValidation';
import validateCreateAccount from '../validation/validateCreateAccount';
import firebase from '../firebase';

const initialState = {
    name: '',
    email: '',
    password: ''
}

const CreateAccount = () => {
    const [error, setError] = useState(false);
    const { values, errors, handleChange, handleSubmit } = useValidation(initialState, validateCreateAccount, createAccount);
    const { name, email, password } = values;

    async function createAccount() {
        try {
            await firebase.registerUser(name, email, password);
            router.push('/');
        } catch (error) {
            console.log('Error al crear usuario', error);
            setError(error.message);
        }
    }

    return (
        <>
            <Layout>
                <h1 css={css`text-align: center; margin-top: 5rem;`}>Crear Cuenta</h1>
                <Form onSubmit={handleSubmit} noValidate>
                    <Field>
                        <label htmlFor="name">Nombre</label>
                        <input id="name" type="text" name="name" placeholder="Nombre" value={name} onChange={handleChange} />
                    </Field>
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
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
                    <InputSubmit type="submit" value="Crear Cuenta" />
                </Form>
            </Layout>
        </>
    );
}

export default CreateAccount;