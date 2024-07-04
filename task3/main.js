document.addEventListener('DOMContentLoaded', function() {

    const filter = document.querySelector('.filter');
    const items = document.querySelector('.items');
    const subMenu = document.querySelector('.sub-menu');

    if (filter && subMenu) {
    document.addEventListener('click', function(event) {
        if (!subMenu.contains(event.target) && !filter.contains(event.target)) {
            subMenu.style.display = 'none';
        }
    });

    filter.addEventListener('click', function() {
        if (subMenu.style.display === 'block') {
            subMenu.style.display = 'none';
        } else {
            subMenu.style.display = 'block';
        }
    });


    document.querySelectorAll('.sub-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const filter_type = this.getAttribute('filter-type');
            cart_message(filter_type);
            subMenu.style.display = 'none';
        });
    });

    function cart_message(filter_type) {
        const foodCards = items.querySelectorAll('.foodcard_item');
        foodCards.forEach(card => {
            if (card.getAttribute('filter-type') === filter_type || filter_type === 'all') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

    function cartMessage(message) {
        const cart_message = document.getElementById('notification');
        cart_message.textContent = message;
        cart_message.style.display = 'block';
        setTimeout(() => {
            cart_message.style.display = 'none';
        }, 1500); 
    }

    function addToCart(foodName, foodPrice) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name: foodName, price: foodPrice });
        localStorage.setItem('cart', JSON.stringify(cart));
        const newCartCount = cart.length;
        localStorage.setItem('cartCount', newCartCount);
        updateCartCount(newCartCount);
        cartMessage(foodName + ' has been added to your cart!');
    }

    function updateCartCount(number) {
        const cartCount = document.getElementById('item-count');
        cartCount.textContent = number;
    }

    const storedNumber = localStorage.getItem('cartCount') || 0;
    updateCartCount(storedNumber);

    const price = document.querySelectorAll('.price');
    price.forEach(button => {
        button.addEventListener('click', function() {
            const foodName = this.parentElement.querySelector('h5').textContent;
            const foodPrice = this.textContent.replace('Add ', '').replace('$', '');
            addToCart(foodName, foodPrice);
        });
    });
});




