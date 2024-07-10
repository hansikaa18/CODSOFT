document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById("modal");
    var closeButton = document.getElementsByClassName("close-button")[0];
    var openModalButtons = document.getElementsByClassName("open-modal");
    var modalImg = document.getElementById("modal-img");
    var modalTitle = document.getElementById("modal-title");
    var priceButton = document.querySelector('.modal .price');
    const filterLinks = document.querySelectorAll('.sidebar .sub-item');
    const content = document.querySelector('.content');
    const searchBox = document.getElementById('search-box');
    const quantityInput = document.getElementById('quantity-input');

    filterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const filterType = this.getAttribute('filter-type');
            filterContent(filterType);
        });
    });

    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterContentBySearch(searchTerm);
    });

    function filterContentBySearch(searchTerm) {
        const clothCards = content.querySelectorAll('.clothCard');
        clothCards.forEach(card => {
            const button = card.querySelector('button.open-modal');
            const clothName = button.textContent.toLowerCase();
            if (clothName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function filterContent(filterType) {
        const clothCards = content.querySelectorAll('.clothCard');
        clothCards.forEach(card => {
            if (filterType === 'all' || card.getAttribute('filter-type') === filterType) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    for (var i = 0; i < openModalButtons.length; i++) {
        openModalButtons[i].addEventListener('click', function () {
            var imgSrc = this.previousElementSibling.src;
            var title = this.textContent;
            const ClothPrice = parseFloat(this.dataset.price);

            modal.style.display = "block";
            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            priceButton.dataset.ClothPrice = ClothPrice;  
            priceButton.textContent = `Add $${ClothPrice.toFixed(2)}`;
            quantityInput.value = 1;  
        });
    }

    closeButton.onclick = function () {
        modal.style.display = "none";
    }

    quantityInput.addEventListener('input', () => {
        const ClothPrice = parseFloat(priceButton.dataset.ClothPrice);
        priceButton.textContent = `Add $${ClothPrice.toFixed(2)}`;
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
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

    function addtobag(item) {
        let shoppingbag = JSON.parse(localStorage.getItem('shoppingbag')) || [];
        shoppingbag.push(item);
        localStorage.setItem('shoppingbag', JSON.stringify(shoppingbag));
        updateBagCount();
        cartMessage(`${item.name} has been added to your cart!`);
    }

    function updateBagCount() {
        let shoppingbag = JSON.parse(localStorage.getItem('shoppingbag')) || [];
        let totalQuantity = shoppingbag.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.getElementById('item-count');
        cartCount.textContent = totalQuantity;
    }

    const storedNumber = localStorage.getItem('cartCount') || 0;
    updateBagCount(storedNumber);

    priceButton.addEventListener('click', function () {
        const clothname = modalTitle.textContent;
        const clothsizeSelect = document.querySelector('.modal .size');
        const clothsize = clothsizeSelect.options[clothsizeSelect.selectedIndex].text;
        const clothquantity = parseInt(quantityInput.value) || 1; 
        const clothprice = parseFloat(priceButton.dataset.ClothPrice); 
        addtobag({ name: clothname, size: clothsize, price: clothprice.toFixed(2), quantity: clothquantity });
    });
});
