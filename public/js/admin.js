const deleteProduct = (btnElem) => {
  const btnParentNode = btnElem.parentNode;

  const csrfTokenValue = btnParentNode.querySelector('[name="_csrf"]').value;
  const productId = btnParentNode.querySelector('[name="productId"]').value;

  const elementToRemove = btnElem.closest("article");

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfTokenValue,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      elementToRemove.parentNode.removeChild(elementToRemove);
    })
    .catch((err) => console.log(err));
};
