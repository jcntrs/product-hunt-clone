export default function validateCreateProduct(values) {
    let errors = {};

    if (!values.name)
        errors.name = 'El nombre es obligatorio';

    if (!values.company)
        errors.company = 'La empresa es obligatoria';

    if (!values.url) {
        errors.url = 'La URL es obligatoria';
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url = 'URL inválida';
    }

    if (!values.description)
        errors.description = 'La descripción es obligatoria';

    return errors;
}