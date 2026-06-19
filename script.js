let trenutniJezik = "bs";
let trenutniPrevodilac = "bs.korkut";
let trenutniAPI = "https://api.alquran.cloud/v1/ayah/random/bs.korkut";

const prevodiociBaza = {
    bs: [
        {kod: "bs.korkut", ime: "Besim Korkut"},
        {kod: "bs.mlivo", ime: "Mustafa Mlivo"}
    ],
    en: [
        {kod: "en.sahih", ime: "Sahih International"},
        {kod: "en.itani", ime: "Talal Itani (Clear Qur'an)"},
        {kod: "en.asad", ime: "Muhammad Asad"},
        {kod: "en.yusufali", ime: "Abdullah Yusuf Ali"}
    ]
};

function osvjeziPrevoditelje() {
    const dropdownJezik = document.getElementById("izborJezika");
    const dropdownPrevodilac = document.getElementById("izborPrevodioca");

    trenutniJezik = dropdownJezik.value;

    dropdownPrevodilac.innerHTML = "";

    prevodiociBaza[trenutniJezik].forEach(p => {
        const opcija = document.createElement("option");
        opcija.value = p.kod;
        opcija.innerText = p.ime;
        dropdownPrevodilac.appendChild(opcija);
        
    });

    trenutniPrevodilac = prevodiociBaza[trenutniJezik][0].kod;

    promjenaJezika();
}

function promjenaPrevodioca() {
    const dropdownPrevodilac = document.getElementById("izborPrevodioca");
    trenutniPrevodilac = dropdownPrevodilac.value;
    trenutniAPI = `https://api.alquran.cloud/v1/ayah/random/${trenutniPrevodilac}`

    prikaziAjet();
}

function promjenaJezika() {
    const dropdown = document.getElementById("izborJezika");
    trenutniJezik = dropdown.value;

    const naslov = document.getElementById("naslov");
    const deskripcija = document.getElementById("deskripcija");
    const dugme = document.getElementById("dugme");

    if (trenutniJezik === "en") {
        naslov.innerText = "Random Ayah";
        deskripcija.innerText = "Generate one of over 5,500 verses from the Holy Qur'an.";
        dugme.innerText = "Generate Ayah";
    } 
    else {
        naslov.innerText = "Nasumični Ajet";
        deskripcija.innerText = "Generiši jedan od preko 5.500 ajeta iz časnog Kur'ana.";
        dugme.innerText = "Generiši Ajet";
    }

    trenutniAPI = `https://api.alquran.cloud/v1/ayah/random/${trenutniPrevodilac}`;

    prikaziAjet(); 
}

function prikaziAjet() 
{
    const elementAjet = document.getElementById("ajet");
    const jedinstveniURL = trenutniAPI + "?nocache=" + new Date().getTime(); 
    
    fetch(jedinstveniURL)
        .then(response => response.json())
        .then(data =>
        {
            const tekstAjeta = data.data.text;

            if (tekstAjeta.length < 45) {
                console.log("Ajet je prekratak, tražim novi...");
                prikaziAjet(); 
                return;        
            }

            const nazivSure = data.data.surah.englishName;
            const brojAjeta = data.data.numberInSurah;

            elementAjet.classList.add("ucitavanje-teksta");

            const oznakaSura = trenutniJezik === "en" ? "Surah" : "Sura";
            const oznakaAjet = trenutniJezik === "en" ? "Ayah" : "ajet";

            elementAjet.innerHTML = `
                "${tekstAjeta}" <br>
                <small style="display:block; margin-top:10px; color:#475569;">
                    — ${oznakaSura} ${nazivSure}, ${oznakaAjet} ${brojAjeta}
                </small>
            `;
            
            setTimeout(() => {
                elementAjet.classList.remove("ucitavanje-teksta");
            }, 100); 
        })
        .catch(error => {
            console.error("Greška sa API: ", error);
            elementAjet.innerText = trenutniJezik === "en" 
                ? "Unable to load new verse, please try again." 
                : "Nije moguće učitati novi ajet, probajte ponovo.";
            elementAjet.classList.remove("ucitavanje-teksta");
        });
}

window.onload = function() {
    osvjeziPrevoditelje();
};