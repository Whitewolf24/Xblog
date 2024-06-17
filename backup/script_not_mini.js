const field = document.querySelector(".search_inp"),
    search = document.querySelector(".search");

window.onunload = function () {
    field.value = "", window.scrollTo(0, 0)
};

const addSearchWindow = e => {
    e.onclick = function (e) {
        e.preventDefault();
        const t = document.createElement("section");
        t.setAttribute("id", "search_window"), t.innerHTML = `
            <div class="m-0 m-auto pb-2">
                <form class="flex relative search_form" method="POST" role="search" action="/search">
                    <div class="flex text-xl text-white relative hover:text-zinc-400" id="cancel">
                        <button class="m-0 m-auto" id="cancel_butt"><span>X</span></button>
                    </div>
                    <input class="bg-gray-200 h-9 focus:outline-none focus:shadow-[inset_0_1px_1px_0_rgba(50,50,50,0.9)] text-xs text-gray-950 px-4 relative rounded-xl leading-3 new_search_inp" type="search" aria-label="Search" name="search_inp" placeholder="Search">
                    <div>
                        <button class="p-2 flex h-8 mb-2 ml-6 w-9 new_search_butt">
                            <svg class="text-white h-6 w-7 hover:text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>`, document.body.prepend(t), document.body.style.overflowY = "hidden";
        const n = document.querySelector("#cancel_butt"),
            c = document.querySelector(".new_search_inp"),
            r = document.querySelector(".new_search_butt");
        n.onclick = function (e) {
            e.preventDefault(), t.remove(), document.body.style.overflowY = "scroll"
        }, r.addEventListener("click", (function (e) {
            ("" === c.value || c.value.length < 4) && (e.preventDefault(), alert("Please use more than 3 characters to search"))
        }))
    }
}, searchButton = document.querySelector("#search_butt"), search_button_mini = document.querySelector("#search_butt_mini");

if (searchButton && addSearchWindow(searchButton), search_button_mini && addSearchWindow(search_button_mini), window.location.toString().includes("profile")) {
    const e = document.querySelector("#profile_butt");
    e && (e.style.display = "none")
}

const searchField = document.querySelector("#search"),
    searchSubmit = document.querySelector("#search_submit");

function removeScripts(e) {
    let t = e.querySelectorAll("script");
    for (let e of t) e.remove()
}

function hide_menu() {
    const e = window.innerWidth,
        t = document.getElementById("menu");
    e >= 640 && (t.style.display = "none")
}

searchSubmit && searchField && searchSubmit.addEventListener("click", (function (e) {
    ("" === searchField.value || searchField.value.length < 4) && (e.preventDefault(), alert("Please use more than 3 characters to search"))
})), burger = document.querySelector(".burger"), burger.addEventListener("click", (function () {
    "none" === menu.style.display || "" === menu.style.display ? menu.style.display = "inline" : menu.style.display = "none"
}));

search_button_mini.addEventListener("click", function () {
    menu.style.display = "none";
});

window.addEventListener("resize", hide_menu);

const header = document.querySelector("header");
let scroll = window.scrollY;
window.addEventListener("scroll", (function () {
    window.scrollY > scroll ? header.classList.add("header-hidden") : header.classList.remove("header-hidden"), scroll = window.scrollY
}));
