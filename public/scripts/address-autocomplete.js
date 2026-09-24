(function () {
    'use strict';

    function setupAddressAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'address-autocomplete-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const list = document.createElement('div');
        list.className = 'address-suggestions';
        list.style.display = 'none';
        wrapper.appendChild(list);

        let timer;

        input.addEventListener('input', function () {
            clearTimeout(timer);
            const query = input.value.trim();

            if (query.length < 3) {
                list.style.display = 'none';
                list.innerHTML = '';
                return;
            }

            timer = setTimeout(async function () {
                try {
                    const url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(query + ', USA') + '&limit=5';
                    const response = await fetch(url);
                    const data = await response.json();

                    list.innerHTML = '';

                    (data.features || []).forEach(function (item) {
                        const props = item.properties || {};
                        const address = [
                            props.name,
                            props.street,
                            props.city,
                            props.state,
                            props.country
                        ].filter(Boolean).join(', ');

                        const option = document.createElement('div');
                        option.className = 'address-suggestion-item';
                        option.textContent = address;

                        option.addEventListener('click', function () {
                            input.value = address;
                            list.style.display = 'none';
                        });

                        list.appendChild(option);
                    });

                    list.style.display = list.children.length ? 'block' : 'none';
                } catch (error) {
                    list.style.display = 'none';
                }
            }, 500);
        });

        document.addEventListener('click', function (event) {
            if (!wrapper.contains(event.target)) {
                list.style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupAddressAutocomplete('pickup_address');
        setupAddressAutocomplete('dropoff_address');
    });
})();
