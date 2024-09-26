const productsToSelectFromList = async () => {
    const products = await fetch("http://localhost:4001");
    const data = await products.json();
    console.log(data);
  }
productsToSelectFromList();