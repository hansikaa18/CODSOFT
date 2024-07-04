document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const ItemContainer = document.querySelector('.cart_items');
    const totalElement = document.querySelector('.Total');

    let serialNo = 1;
    let foodCart = new Map();
    let totalPrice = 0;

    function CartItemsSupply() {
        ItemContainer.innerHTML = ''; 

        foodCart.forEach((item, name) => {
            const itemStorage = document.createElement('div');
            itemStorage.className = 'cart_item';

            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;

            itemStorage.innerHTML = `
                <p>
                    <input type="checkbox" class="item-checkbox">
                    <span class="serial-number">${serialNo}.</span>
                    <span class="item-name">${name}</span>
                    <span class="quantity"> X ${item.quantity}</span>
                    <span class="price">${itemTotalPrice.toFixed(2)}$</span>
                </p>
            `;
            ItemContainer.appendChild(itemStorage);
            serialNo++;
        });

        totalElement.textContent = `${totalPrice.toFixed(2)}$`;
    }

    cart.forEach(item => {
        if (!foodCart.has(item.name)) {
            foodCart.set(item.name, { price: parseFloat(item.price), quantity: 1 });
        } else {
            foodCart.get(item.name).quantity++;
        }
    });

    CartItemsSupply();

    const removeItem = document.querySelector('.remove_item');
    removeItem.addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.item-checkbox');

        if (this.textContent === 'Remove Item') {
            checkboxes.forEach(checkbox => {
                checkbox.style.display = 'inline'; 
            });
            this.textContent = 'CONFIRM REMOVE';
        } else {
            let foodToRemove = [];
            checkboxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    foodToRemove.push(Array.from(foodCart.keys())[index]);
                }
                checkbox.style.display = 'none';
                checkbox.checked = false;
            });

            foodToRemove.forEach(itemName => {
                foodCart.delete(itemName);
            });

            const updatedCart = [];
            foodCart.forEach((item, itemName) => {
                for (let i = 0; i < item.quantity; i++) {
                    updatedCart.push({ name: itemName, price: item.price.toFixed(2) });
                }
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            serialNo = 1;
            totalPrice = 0;
            CartItemsSupply();
            updateCartCount(foodCart.size);
            this.textContent = 'Remove Item';
        }
    });

    function payCart(totalPrice){
        return('Are you sure you want to pay ' + totalPrice + '$?')
    };
    
    const pay = document.querySelector('.pay');
    pay.addEventListener('click', function(){
        if (confirm(payCart(totalPrice.toFixed(2)))){
            localStorage.removeItem('cart');
            localStorage.setItem('cartCount', 0);
            foodCart = new Map();
            totalPrice = 0;
            serialNo = 1;
            CartItemsSupply();
            updateCartCount(0);
            payMessage('Successful Transaction!!');
        };
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
