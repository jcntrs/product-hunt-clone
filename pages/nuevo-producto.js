import { useState, useContext } from 'react'
import { useRouter } from 'next/router';
import { css } from '@emotion/core';
import { Form, Field, InputSubmit, ErrorMessage } from '../components/ui/Form';
import { FirebaseContext } from '../firebase';
import useValidation from '../hooks/useValidation';
import validateCreateProduct from '../validation/validateCreateProduct';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layouts/Layout';
import Error404 from '../components/layouts/Error404';

const initialState = {
    name: '',
    company: '',
    url: '',
    description: ''
}

const NewProduct = () => {
    const [imageName, setImageName] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState('');
    const [error, setError] = useState(false);
    const { values, errors, handleChange, handleSubmit } = useValidation(initialState, validateCreateProduct, createProduct);
    const { name, company, image, url, description } = values;
    const { firebase, user } = useContext(FirebaseContext);
    const router = useRouter();

    async function createProduct() {
        if (!user)
            return router.push('/iniciar-sesion');

        const newProduct = {
            name,
            company,
            url,
            imageURL,
            description,
            votes: 0,
            comments: [],
            createdAt: Date.now(),
            creator: {
                id: user.uid,
                name: user.displayName
            },
            hasVoted: []
        }
        firebase.db.collection('products').add(newProduct);
        return router.push('/');
    }

    const handleUploadStart = () => {
        setProgress(0);
        setUploadingImage(true);
    }

    const handleUploadError = error => {
        setUploadingImage(error);
        console.error(error);
    }

    const handleUploadSuccess = imageName => {
        setProgress(100);
        setUploadingImage(false);
        setImageName(imageName);
        firebase
            .storage
            .ref('products')
            .child(imageName)
            .getDownloadURL()
            .then(url => {
                console.log(url)
                setImageURL(url);
            });
    }

    const handleProgress = progress => setProgress({ progress });

    return (
        <Layout>
            {user
                ? <>
                    <h1 css={css`text-align: center; margin-top: 5rem;`}>Nuevo Producto</h1>
                    <Form onSubmit={handleSubmit} noValidate>
                        <fieldset>
                            <legend>Información General</legend>
                            <Field>
                                <label htmlFor="name">Nombre</label>
                                <input id="name" type="text" name="name" placeholder="Nombre del producto" value={name} onChange={handleChange} />
                            </Field>
                            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                            <Field>
                                <label htmlFor="company">Empresa</label>
                                <input id="company" type="text" name="company" placeholder="Empresa o compañía" value={company} onChange={handleChange} />
                            </Field>
                            {errors.company && <ErrorMessage>{errors.company}</ErrorMessage>}
                            <Field>
                                <label htmlFor="image">Imagen</label>
                                <FileUploader
                                    accept="image/*"
                                    id="image"
                                    name="image"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref("products")}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                />
                            </Field>
                            <Field>
                                <label htmlFor="url">URL</label>
                                <input id="url" type="url" name="url" placeholder="URL del producto" value={url} onChange={handleChange} />
                            </Field>
                            {errors.url && <ErrorMessage>{errors.url}</ErrorMessage>}
                        </fieldset>
                        <fieldset>
                            <legend>Sobre tu Producto</legend>
                            <Field>
                                <label htmlFor="description">Descripción</label>
                                <textarea id="description" name="description" placeholder="Descripción del producto" value={description} onChange={handleChange} />
                            </Field>
                            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
                        </fieldset>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        <InputSubmit type="submit" value="Crear Producto" />
                    </Form>
                </>
                : <Error404 />
            }
        </Layout>
    );
}

export default NewProduct;