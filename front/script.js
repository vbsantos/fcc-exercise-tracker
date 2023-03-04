const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formId = form.id;
    const resultContainer = document.querySelector(`#result-${formId}`)

    const formData = new FormData(form);
    const userId = formData.get("userId");
    formData.delete("userId")

    const method = form.getAttribute('method').toUpperCase();
    const url = userId ? form.getAttribute('action').replace(":_id", userId) : form.getAttribute('action');

    if (method === "GET") {
      const urlWithQueries = `${url}?` + new URLSearchParams(Object.fromEntries([...formData]));
      console.log("🚀 ~ file: script.js:19 ~ form.addEventListener ~ urlWithQueries:", urlWithQueries)
      fetch(urlWithQueries, { method })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => {
          console.log(data)
          resultContainer.innerHTML = `<code>${JSON.stringify(data)}</code>`
        })
        .catch(error => {
          console.error(error);
          resultContainer.innerHTML = `<code>${error}</code>`
        });
    } else {
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
          console.log(data)
          resultContainer.innerHTML = `<code>${JSON.stringify(data)}</code>`
        })
        .catch(error => {
          console.error(error);
          resultContainer.innerHTML = `<code>${error}</code>`
        });
    }

  });
});
