document.addEventListener('DOMContentLoaded', () => {
    const productType = document.getElementById('product-type');
    const customText = document.getElementById('custom-text');
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const uploadImage = document.getElementById('upload-image');
    const previewText = document.getElementById('preview-text');
    const previewProduct = document.getElementById('preview-product');
    const previewImage = document.getElementById('preview-image');
    const addBtn = document.getElementById('add-custom-cart');

    function updatePreview() {
        
        let text = customText.value.trim();
        if (text === '') text = 'نص تجريبي';
        previewText.textContent = text;
        previewText.style.color = textColor.value;
        
        
        previewProduct.style.backgroundColor = bgColor.value;
        
        
        if (uploadImage.files && uploadImage.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(uploadImage.files[0]);
        } else {
            previewImage.style.display = 'none';
        }
    }

    customText.addEventListener('input', updatePreview);
    textColor.addEventListener('input', updatePreview);
    bgColor.addEventListener('input', updatePreview);
    uploadImage.addEventListener('change', updatePreview);
    productType.addEventListener('change', () => {
        
        updatePreview();
    });

    updatePreview();

    addBtn.addEventListener('click', () => {
        let imageBase64 = null;
        if (uploadImage.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageBase64 = e.target.result;
                saveCustomToCart(imageBase64);
            };
            reader.readAsDataURL(uploadImage.files[0]);
        } else {
            saveCustomToCart(null);
        }
    });

    function saveCustomToCart(imageBase64) {
        const customItem = {
            id: 'custom_' + Date.now(),
            name: `منتج مخصص (${productType.options[productType.selectedIndex].text})`,
            price: 24.99, 
            image: imageBase64,
            type: 'custom',
            quantity: 1,
            customData: {
                productType: productType.value,
                text: customText.value,
                textColor: textColor.value,
                bgColor: bgColor.value,
                image: imageBase64
            }
        };
        addToCart(customItem);
        alert('تمت إضافة المنتج المخصص إلى السلة!');
        
        customText.value = '';
        uploadImage.value = '';
        updatePreview();
    }
});