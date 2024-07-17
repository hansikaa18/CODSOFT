document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const temp = urlParams.get('template');
    const title = urlParams.get('title');
    const edit = document.querySelector('.edit');
    const save = document.querySelector('.save');

    if (temp) {
        const templates = document.querySelectorAll('.template');

        templates.forEach(template => {
            template.style.display = 'none';
        });

        selectedTemplate = document.querySelector(`.template[data-filter-type="${temp}"]`);

        if (title) {
            const topic = document.querySelector('.topic');
            topic.textContent = title;
        }
        if (selectedTemplate) {
            selectedTemplate.style.display = 'block';
        }

    }

    let edit_allow = false;

    edit.addEventListener('click', () => {
        if (!edit_allow) {
            selectedTemplate.innerHTML = selectedTemplate.innerHTML.replace(/\[([^\]]+)\]/g, '<input type="text" value="$1" data-original="$1" />');
            edit_allow = true;
        }
    });

    save.addEventListener('click', () => {
        if (edit_allow) {
            const inputs = selectedTemplate.querySelectorAll('input');
            inputs.forEach(input => {
                const newValue = input.value;
                const span = document.createElement('span');
                const orig_data = input.getAttribute('data-original');
                span.textContent = newValue !== orig_data ? newValue : `[${orig_data}]`;
                input.parentNode.replaceChild(span, input);
            });
            edit_allow = false;
        }
    });
});
