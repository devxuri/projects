const paymentForm = document.querySelector("#payment-form");
const paymentHistory = document.querySelector("#payment-history");

let form_submissions = [];

let formid=0;

if (localStorage.getItem("form_submissions")) { // Change the pointer of formid to the last location of the history cards if they do exist
    form_submissions = JSON.parse(localStorage.getItem("form_submissions"));
    formid = form_submissions.length;
    }

let loadFormSubmissions = () => { 
    form_submissions.forEach((submission) => {
    const paymentCard = document.createElement("article");
    paymentCard.innerHTML = `
    <h3>${submission.metadate}</h3>
    <section id="${submission.metaid}" class="payment-history-card">
        <h4 class="card">${submission.formto}</h4>
        <section class="price-grid card">
            <p class="card">£${submission.formamt}</p>
        </section>
        <p class="card">To be categorised</p>
    </section>
    `;
    paymentHistory.appendChild(paymentCard);
    });
}

loadFormSubmissions();

paymentForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = getFormData();
    const paymentData = processFormData(formData);

    form_submissions.push(paymentData);
    
    localStorage.setItem("form_submissions", JSON.stringify(form_submissions));

    displayPaymentData(paymentData);

    paymentForm.reset();
    formid++;
}

function getFormData() { // Grabs the form submission data
    return {
        formacc: document.querySelector("#fmaccount").value,
        formto: document.querySelector("#fmto").value,
        formamt: document.querySelector("#fmamount").value,
        formref: document.querySelector("#fmref").value,
        formfreq: document.querySelector("#fmfreq").value,
        formdate: document.querySelector("#fmdate").value,
    };
}

function processFormData(formData) { // Adds metadata info to the submission data (metaid required later for onClick() and  metadate for filter handling)
    const date = new Date().toLocaleDateString();
    formData.metaid = formid;
    formData.metadate = date;
    return formData;
}

function displayPaymentData(paymentData) {  // Creates the card and displays it on the page
    const paymentCard = document.createElement("article");
    paymentCard.innerHTML = `
    <h3>${paymentData.metadate}</h3>
    <section id="${paymentData.metaid}" class="payment-history-card">
        <h4 class="card">${paymentData.formto}</h4>
        <section class="price-grid card">
            <p class="card">£${paymentData.formamt}</p>
        </section>
        <p class="card">To be categorised</p>
    </section>
    `;
    paymentHistory.appendChild(paymentCard);
}

