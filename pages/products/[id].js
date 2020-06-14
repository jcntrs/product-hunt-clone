import { useState, useEffect, useContext } from 'react';
import { useRouter, createRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';
import { css } from '@emotion/core';
import { es } from 'date-fns/locale';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Error404 from '../../components//layouts/Error404';
import Layout from '../../components/layouts/Layout';
import Spinner from '../../components/ui/Spinner';

const ProductContainer = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const ProductCreator = styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Product = () => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});

    const router = useRouter();
    const { query: { id } } = router
    const { firebase, user } = useContext(FirebaseContext);

    const handleVote = () => {
        if (!user) {
            return router.push('iniciar-sesion');
        }

        if (product.hasVoted.includes(user.uid)) {
            return;
        }

        const totalVotes = product.votes + 1;
        const hasVoted = [...product.hasVoted, user.uid];
        firebase.db.collection('products').doc(id).update({ votes: totalVotes, hasVoted });
        setProduct({ ...product, votes: totalVotes, hasVoted });
    }

    const handleCommentChange = event => {
        setComment({ ...comment, [event.target.name]: event.target.value })
    }

    const addComment = event => {
        event.preventDefault();

        if (!user) {
            return router.push('iniciar-sesion');
        }

        comment.userId = user.uid;
        comment.userName = user.displayName;

        const newComments = [...product.comments, comment];
        firebase.db.collection('products').doc(id).update({ comments: newComments });
        setProduct({ ...product, comments: newComments });
        event.target.reset();
    }

    const handleCanProductDelete = () => {
        if (!user) return false;
        if (product.creator.id === user.uid) return true;
    }

    const handleProductDelete = async () => {
        if (!user) {
            return router.push('iniciar-sesion');
        }
        if (product.creator.id !== user.uid) {
            return router.push('/');
        }

        try {
            await firebase.db.collection('products').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (id) {
            const getProduct = async () => {
                const result = await firebase.db.collection('products').doc(id);
                const document = await result.get();
                document.exists ? setProduct(document.data()) : setError(true);
            }
            getProduct();
        }
    }, [id])

    return (
        <Layout>
            {error
                ? <Error404 />
                : <>
                    {Object.keys(product).length === 0 && !error
                        ? <Spinner />
                        : <div className="contenedor">
                            <h1 css={css`text-align: center; margin-top: 5rem;`}>{product.name}</h1>
                            <ProductContainer>
                                <div>
                                    <p>Publicado hace: {formatDistanceToNow(new Date(product.createdAt), { locale: es })}</p>
                                    <p>Por: {product.creator.name} de {product.company}</p>
                                    <img src={product.imageURL} css={css`width: 100%;`} />
                                    <p>{product.description}</p>
                                    {user &&
                                        <>
                                            <h2>Agrega tu comentario</h2>
                                            <form onSubmit={addComment}>
                                                <Field>
                                                    <input type="text" name="message" required onChange={handleCommentChange} />
                                                </Field>
                                                <InputSubmit type="submit" value="Agregar Comentario" />
                                            </form>
                                        </>
                                    }
                                    <h2 css={css`margin: 2rem 0;`}>Comentarios</h2>
                                    {product.comments.length === 0
                                        ? <p>Aún no hay comentarios.</p>
                                        : <ul>
                                            {product.comments.map((comment, index) =>
                                                <li key={index} css={css`border: 1px solid #e1e1e1; padding: 2rem;`}>
                                                    <p>{comment.message}</p>
                                                    <p>Escrito por: <span css={css`font-weight: bold;`}>{comment.userName}</span></p>
                                                    {comment.userId === product.creator.id && <ProductCreator>Propietario</ProductCreator>}
                                                </li>
                                            )}
                                        </ul>
                                    }
                                </div>
                                <aside>
                                    <Button target="_blank" bgColor="true" href={product.url}>Visitar URL</Button>
                                    <div css={css`margin-top: 5rem;`}>
                                        <p css={css`text-align: center;`}>{product.votes} Votos</p>
                                        {user &&
                                            <Button onClick={handleVote}>Votar</Button>
                                        }
                                    </div>
                                </aside>
                            </ProductContainer>
                            {handleCanProductDelete() && <Button onClick={handleProductDelete}>Eliminar Producto</Button>}
                        </div>
                    }
                </>
            }

        </Layout>
    );
}

export default Product;