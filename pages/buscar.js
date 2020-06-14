import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layouts/Layout';
import ProductDetails from '../components/layouts/ProductDetails';
import useProducts from '../hooks/useProducts';
import Error404 from '../components/layouts/Error404';

const Searcher = () => {
    const router = useRouter();
    const { query: { q } } = router;
    const { products } = useProducts('createdAt');
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (q) {
            const search = q.toLowerCase();
            const filter = products.filter(product =>
                product.name.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search)
            );
            setResult(filter);
        }
    }, [q, products])

    return (
        <>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {result.length > 0
                                ? result.map(product => <ProductDetails key={product.id} product={product} />)
                                : <Error404 />
                            }
                        </ul>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Searcher;