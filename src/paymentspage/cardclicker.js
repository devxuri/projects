const paymentCards = document.querySelector('#payment-history');
const formPopup = document.querySelector(".form-modal-container");
const blurSelectAside = document.querySelector("aside");
const blurSelectMain = document.querySelector("main");

let currentlyOpenPopup = null;

async function handlePaymentCardClick(event, cardId) {
  event.stopPropagation();
  
  if (currentlyOpenPopup) {
    closeForm();
  }
  
  let cardData = grabCardInfo(cardId);
  let cardPopup = createPopup(cardData);
  
  currentlyOpenPopup = cardPopup;
  openForm(cardPopup);
};

paymentCards.addEventListener('click', async function(event) {
    if (!event.target.closest('.payment-history-card') && !event.target.closest('.card')) {
        return;
    }
    
    let target = event.target.closest('.payment-history-card') || event.target.closest('.card');
    let cardId = target.id;
    
    if (!cardId) {
        target = target.parentElement;
        cardId = target.id;
    }
    
    if (!cardId) {
        return;
    }
    
    await handlePaymentCardClick(event, cardId);
});

document.addEventListener("click", function(event) {
    if (!event.target.closest('.form-modal')) {
        if (currentlyOpenPopup) {
            closeForm();
        }
    }
});

function grabCardInfo(cardId) {
    grabData = form_submissions[cardId];
    return grabData;
};


function createPopup(cardData) {
    let cardCreate = document.createElement("div");
    cardCreate.classList = "form-modal";
    cardCreate.id = "myForm";
    cardCreate.innerHTML = `
    <div class="form-modal-content"> 
        <div class="form-modal-header">
            <figure id="logo-modal">
                <svg width="20%" height="20%" viewBox="0 0 80 34" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill = "#ffffff" d="M26.0672 3.7136C26.0672 5.76373 24.4016 7.42543 22.3465 7.42543C20.2915 7.42543 18.6259 5.76373 18.6259 3.7136C18.6259 1.66346 20.2915 0.0017644 22.3465 0.0017644C24.4016 -0.019816 26.0672 1.64188 26.0672 3.7136Z" fill="#1929D6"/>
                <path fill = "#ffffff" d="M15.8785 9.08593V14.5889H9.47541V23.7175C9.47541 25.746 10.4056 26.5445 12.5039 26.5445H15.9001V31.8101H12.0712C6.03593 31.8101 3.3103 29.1126 3.3103 24.0196V14.5889H0.000610352V9.08593C1.8177 9.08593 3.28867 7.61846 3.28867 5.80571V3.23764H9.45378V9.08593H15.8785V9.08593Z" fill="#1929D6"/>
                <path fill = "#ffffff" d="M25.418 9.08551H19.2529V31.8097H25.418V9.08551Z" fill="#1929D6"/>
                <path fill = "#ffffff" d="M46.3792 30.1492C44.7785 31.4009 42.2908 32.1346 39.7166 32.1346C33.5082 32.1346 28.2084 27.1279 28.2084 20.5675C28.2084 14.007 33.4866 8.8709 39.7166 8.8709C42.2908 8.8709 44.7785 9.66937 46.3792 10.8995V1.46881H52.5443V31.8325H46.3792V30.1492ZM46.4657 20.5675C46.4657 17.2009 43.7185 14.4602 40.2574 14.4602C36.8828 14.4602 34.2653 17.2009 34.2653 20.5675C34.2653 23.9772 36.8828 26.6747 40.2574 26.6747C43.805 26.6747 46.4657 23.9772 46.4657 20.5675Z" fill="#1929D6"/>
                <path fill = "#ffffff" d="M66.6053 32.3524C59.3154 32.3524 54.6212 27.2594 54.6212 20.5263C54.6212 13.9659 59.51 8.65707 66.6486 8.65707C73.852 8.65707 78.2 13.6206 78.2 20.2242C78.2 21.109 78.1135 22.2527 78.1135 22.4038H60.6998C61.3704 25.274 63.5336 27.1515 66.7351 27.1515C69.4824 27.1515 71.4941 25.9646 72.7704 24.1302L77.3997 26.9573C75.1932 30.2806 71.6672 32.3524 66.6053 32.3524ZM60.9161 17.8288H71.97C71.2995 15.088 69.093 13.7069 66.6053 13.7069C63.7283 13.7069 61.7165 15.2607 60.9161 17.8288Z" fill="#1929D6"/>
                </svg>
                <button id="modalclose" type="button" class="btn cancel" onclick="closeForm()">X</button>
            </figure>
            <p></p>
            <hr>
        </div>
        
        
        <div id="print-select" class="form-modal-main">
            <article class = "modal-account modal">
                <h5>Account Name</h5>
                <h6>${cardData.formacc}</h6>
            </article>

            <article class="modal-to modal">
                <h5>Sent to</h5>
                <h6>${cardData.formto}</h6>
            </article>

            <article class="modal-amt modal">
                <h5>Amount sent</h5>
                <h6>£${cardData.formamt}</h6>
            </article>

            <article class="modal-ref modal">
                <h5>Reference</h5>
                <h6>${cardData.formref}</h6>
            </article>

            <article class="modal-freq modal">
                <h5>Frequency</h5>
                <h6>${cardData.formfreq}</h6>
            </article>

            <article class="modal-date modal">
                <h5>Date</h5>
                <h6>${cardData.formdate}</h6>
            </article>  
        </div>
        <button id="modalprint" type="button" onclick="printDiv()">PRINT</button>
        
        
    </div>
  `
  return cardCreate;
}

function openForm(cardPopup) {
    formPopup.appendChild(cardPopup);
    cardPopup.classList.add("open");
    blurSelectAside.classList.add("blur");
    blurSelectMain.classList.add("blur");
    disableScroll();
}
  
function closeForm() {
    formPopup.innerHTML = '';
    currentlyOpenPopup = null;
    blurSelectAside.classList.remove("blur");
    blurSelectMain.classList.remove("blur");
    enableScroll();
}

function disableScroll() {
    document.body.classList.add("stop-scrolling");
}
  
function enableScroll() {
    document.body.classList.remove("stop-scrolling");
}

function printDiv() {
    let divContents = document.getElementById("print-select").innerHTML;
    let a = window.open('', '', 'height=1920, width=1080');
    a.document.write('<html>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}

