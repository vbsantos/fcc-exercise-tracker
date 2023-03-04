const forms = document.querySelectorAll('form');
console.log(forms);

forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formId = form.id;
    const resultContainer = document.querySelector(`#result-${formId}`)
    const formData = new FormData(form);
    const userId = formData.get("userId");
    const method = form.getAttribute('method').toUpperCase();
    const url = userId ? form.getAttribute('action').replace(":_id", userId) : form.getAttribute('action');

    // TODO: remover
    console.log({ method, url, body: Object.fromEntries([...formData]) });

    fetch(url, {
      method: method,
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // TODO: remover
        console.log(data);
        resultContainer.innerHTML = `<code>${JSON.stringify(data)}</code>`
        // Handle success response here
      })
      .catch(error => {
        // TODO: remover
        console.error(error);
        resultContainer.innerHTML = `<code>${error}</code>`
        // Handle error response here
      });
  });
});
