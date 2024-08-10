const contriesContainer = document.querySelector(".contries-container")
const mode = document.querySelector(".color-mode");
const modeName = document.querySelector(".mode_name");
const icon = document.querySelector(".color-mode i");
const backBtn = document.querySelector(".backbtn");
const mainContainer = document.querySelector(".main-container")
const searchBar = document.querySelector(".search-bar input");
const selectBar = document.querySelector(".select-bar select");

const clickhandler = (e) => {
    if (e.currentTarget.children[1].children[0].innerHTML) {
        window.location.href = `/country.html?name=${e.currentTarget.children[1].children[0].innerHTML}`;
    }
}

const movetopage = (elem) => {
    location.href = `/country.html?name=${elem.currentTarget.innerHTML}`
}

let userMode = localStorage.getItem("mode") || "Dark Mode";
modeName.innerHTML = userMode
if (userMode === "Light Mode") {
    document.body.classList.toggle("dark");
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
}

let allData;
async function Contriesfatch() {
    fetch("https://restcountries.com/v3.1/all").then((data) => {
        return data.json();
    }).then((data) => {
        allData = data;
        data.forEach((e) => {

            let contrySingle = document.createElement("div");
            contrySingle.onclick = clickhandler;
            contrySingle.classList.add("contry-single");
            let data = `
                <img src="${e.flags.svg}">
                <div class="single-data">
                    <h2>${e.name.common}</h2>
                    <p><strong>Population: </strong><span>${e.population.toLocaleString('en-IN')}</span></p>
                    <p><strong>Region: </strong><span>${e.region}</span></p>
                    <p><strong>Capital: </strong><span>${e.capital || "No Capital"}</span></p>
                </div>`
            contrySingle.innerHTML = data;
            if (contriesContainer) {
                contriesContainer.append(contrySingle);
            }
        })
    })
}

Contriesfatch()


mode.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    modeName.innerHTML = modeName.innerHTML == "Light Mode" ? "Dark Mode" : "Light Mode";
    localStorage.setItem("mode", modeName.innerHTML);

    if (modeName.innerHTML == "Light Mode") {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
    } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
    }
})

if (selectBar) {

    renderRegion = (val) => {
        contriesContainer.innerHTML = "";
        allData.filter((data) => { return data.region.toLowerCase().includes(val) }).forEach((e) => {
            let contrySingle = document.createElement("div");
            contrySingle.onclick = clickhandler;
            contrySingle.classList.add("contry-single");
            let data = `
                <img src="${e.flags.svg}">
                <div class="single-data">
                    <h2>${e.name.common}</h2>
                    <p><strong>Population: </strong><span>${e.population.toLocaleString('en-IN')}</span></p>
                    <p><strong>Region: </strong><span>${e.region}</span></p>
                    <p><strong>Capital: </strong><span>${e.capital || "No Capital"}</span></p>
                </div>`
            contrySingle.innerHTML = data;
            if (contriesContainer) {
                contriesContainer.append(contrySingle);
            }
        })
    }

    selectBar.addEventListener("change", (e) => {
        renderRegion(e.target.value.toLowerCase())
    })
}

if (searchBar) {
    renderitem = (val) => {
        console.log(val)
        if (val) {
            contriesContainer.innerHTML = "";
            allData.filter((data) => { return data.name.common.toLowerCase().includes(val) }).forEach((e) => {
                let contrySingle = document.createElement("div");
                contrySingle.onclick = clickhandler;
                contrySingle.classList.add("contry-single");
                let data = `
                    <img src="${e.flags.svg}">
                    <div class="single-data">
                        <h2>${e.name.common}</h2>
                        <p><strong>Population: </strong><span>${e.population.toLocaleString('en-IN')}</span></p>
                        <p><strong>Region: </strong><span>${e.region}</span></p>
                        <p><strong>Capital: </strong><span>${e.capital || "No Capital"}</span></p>
                    </div>`
                contrySingle.innerHTML = data;
                if (contriesContainer) {
                    contriesContainer.append(contrySingle);
                }
            })

        } else {
            console.log("empty")
        }
    }

    searchBar.addEventListener("input", (e) => {

        renderitem(e.target.value.toLowerCase())

    })
}



if (window.location.href.includes("country")) {

    backBtn.addEventListener("click", () => {
        history.back()
    })

    const urlObj = new URL(window.location.href);
    const params = new URLSearchParams(urlObj.search);
    const name = params.get('name');
    async function fetchbyname(params) {
        return fetch(`https://restcountries.com/v3.1/name/${name}`).then((data) => {
            return data.json();
        }).then((data) => {
            // let div = document.createElement("div");

            let elem = `
            <div class="imageContainer">
                <img src="${data[0].flags.svg}">
            </div>
            <div class="content">
                <h2>${data[0].name.official}</h2>
                <div class="list-items">
                    <p><b>Native Name:</b> <span> ${data[0].name.common}</span></p>
                    <p><b>Population:</b> <span> ${data[0].population.toLocaleString()}</span></p>
                    <p><b>Region:</b> <span> ${data[0].region}</span></p>
                    <p><b>Sub Region:</b> <span> ${data[0].subregion}</span></p>
                    <p><b>Capital:</b> <span> ${data[0].capital.join(", ")}</span></p>
                    <p><b>Top Level Domain:</b> <span> ${data[0].tld.join(", ")}</span></p>
                    <p><b>Currencies:</b><span> ${Object.values(data[0].currencies)[0].name}</span></p>
                    <p><b>Languages:</b> <span> ${Object.values(data[0].languages)}</span></p>
                </div>
                <div class="border-country"><b>Border Contries:</b><span id="countryarr"> ${data[0].borders?getcontry(data[0].borders)&&"Loading...":"No Data"}</span>
                </div>
            </div>
            `

            mainContainer.innerHTML = elem

        })
    }

    fetchbyname()

}


async function getcontry(data) {
    let elemarr = [];
    let allpromise = [];
    data.forEach((e) => {
        allpromise.push(getsingleapi(e).then((name) => {
            elemarr.push(name)
        }))

    })

    Promise.all(allpromise).then(() => {
        document.getElementById("countryarr").innerHTML = "";
        elemarr.forEach((elem) => {
            let span = document.createElement("span");
            span.classList.add("Country_btn")
            span.innerHTML = elem;
            span.onclick = movetopage
            document.getElementById("countryarr").append(span)

        })
    })





}

async function getsingleapi(code) {
    return fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((data) => {
        return data.json()
    }).then((data) => {
        return data[0].name.common
    })
}