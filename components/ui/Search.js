import { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSubmit = styled.button`
    height:37px;
    width: 30px;
    padding-right: 35px;
    display: block;
    background-size: 4rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 2px;
    top: 2px;
    background-color: white;
    border: none;

    &:hover {
        cursor: pointer;
    }
`;

const Search = () => {
    const [search, setSearch] = useState('');

    const handleProductSearch = event => {
        event.preventDefault();

        if (search.trim() === '') return;

        Router.push({
            pathname: '/buscar',
            query: { q: search }
        });
    }

    return (
        <form css={css`position: relative`} onSubmit={handleProductSearch}>
            <InputText type="text" placeholder="Buscar productos" onChange={event => setSearch(event.target.value)} />
            <InputSubmit type="submit" />
        </form>
    );
}

export default Search;