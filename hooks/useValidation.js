import { useState, useEffect } from 'react';

const useValidation = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const withoutErrors = Object.keys(errors).length === 0;
            withoutErrors && fn();
            setSubmitForm(false);
        }
    }, [errors]);

    const handleChange = event => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

    const handleBlur = () => {
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
    }

    const handleSubmit = event => {
        event.preventDefault();
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
        setSubmitForm(true);
    }

    return {
        values, errors, handleChange, handleSubmit
    }
}

export default useValidation