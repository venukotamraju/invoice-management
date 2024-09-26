async function fetchInvoiceId () {
    const fetchId = await fetch("http://localhost:4001/invoices/28");
    const data = await fetchId.json()
    console.log(data)
}
fetchInvoiceId()