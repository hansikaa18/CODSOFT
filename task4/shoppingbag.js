document.addEventListener('DOMContentLoaded', function () {
    let shoppingbag = JSON.parse(localStorage.getItem('shoppingbag')) || [];
    const itemContainer = document.querySelector('.cart_items');
    const totalElement = document.querySelector('.Total');

    let serialNo = 1;
    let clothCart = new Map();
    let totalPrice = 0;

    function CartItemsSupply() {
        itemContainer.innerHTML = ''; 
        totalPrice = 0; 

        serialNo = 1; 
        clothCart.forEach((item, key) => {
            const itemStorage = document.createElement('div');
            itemStorage.className = 'cart_item';

            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice; 

            const [name, size] = key.split('-');

            itemStorage.innerHTML = `
                <p>
                    <input type="checkbox" class="item-checkbox">
                    <span class="serial-number">${serialNo}.</span>
                    <span class="item-name">${name}</span>
                    <span class="item-size">${size}</span>
                    <span class="quantity"> X ${item.quantity}</span>
                    <span class="price">${itemTotalPrice.toFixed(2)}$</span>
                </p>
            `;
            itemContainer.appendChild(itemStorage);
            serialNo++;
        });

        totalElement.textContent = `${totalPrice.toFixed(2)}$`;
    }

    shoppingbag.forEach(item => {
        const key = `${item.name}-${item.size}`;
        if (!clothCart.has(key)) {
            clothCart.set(key, { price: parseFloat(item.price), quantity: item.quantity, size: item.size });
        } else {
            clothCart.get(key).quantity += item.quantity;
        }
    });

    CartItemsSupply();

    const removeItem = document.querySelector('.remove_item');
    removeItem.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('.item-checkbox');

        if (this.textContent === 'Remove Item') {
            checkboxes.forEach(checkbox => {
                checkbox.style.display = 'inline'; 
            });
            this.textContent = 'CONFIRM REMOVE';
        } else {
            let itemsToRemove = [];
            checkboxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    itemsToRemove.push(Array.from(clothCart.keys())[index]);
                }
                checkbox.style.display = 'none';
                checkbox.checked = false;
            });

            itemsToRemove.forEach(itemKey => {
                clothCart.delete(itemKey);
            });

            updateLocalStorage();
            CartItemsSupply();
            this.textContent = 'Remove Item';
        }
    });

    function updateLocalStorage() {
        const updatedCart = [];
        clothCart.forEach((item, itemKey) => {
            const [name, size] = itemKey.split('-');
            updatedCart.push({ name: name, size: size, price: item.price.toFixed(2), quantity: item.quantity });
        });
        localStorage.setItem('shoppingbag', JSON.stringify(updatedCart));
        updateCartCount(updatedCart.reduce((count, item) => count + item.quantity, 0));
    }

    function payCart(totalPrice) {
        return 'Are you sure you want to pay ' + totalPrice + '$?';
    }
    
    const pay = document.querySelector('.pay');
    pay.addEventListener('click', function () {
        if (confirm(payCart(totalPrice.toFixed(2)))) {
            localStorage.removeItem('shoppingbag');
            localStorage.setItem('cartCount', 0);
            clothCart = new Map();
            totalPrice = 0;
            serialNo = 1;
            CartItemsSupply();
            updateCartCount(0);
            payMessage('Successful Transaction!!');
        }
    });

    function payMessage(message) {
        const payMessage = document.getElementById('notification');
        payMessage.textContent = message;
        payMessage.style.display = 'block';
        setTimeout(() => {
            payMessage.style.display = 'none';
        }, 1500); 
    }

    function updateCartCount(number) {
        const cartCount = document.getElementById('item-count');
        if (cartCount) {
            cartCount.textContent = number;
        }
    }

    const storedNumber = localStorage.getItem('cartCount') || 0;
    updateCartCount(storedNumber);
});
