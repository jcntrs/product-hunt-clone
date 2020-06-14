import { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';

const useProducts = orderBy => {
    const [products, setProducts] = useState([]);
    const { firebase } = useContext(FirebaseContext);

    const handleSnapshot = snapshoot => {
        const product = snapshoot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        setProducts(product);
    }

    useEffect(() => {
        const getProducts = () => {
            firebase.db.collection('products').orderBy(orderBy, 'desc').onSnapshot(handleSnapshot);
        }
        getProducts();
    }, [])

    return {
        products
    }
}

export default useProducts;