const field = document.querySelector(".search_inp"),
    search = document.querySelector(".search");

window.onunload = function () {
    (field.value = ""), window.scrollTo(0, 0);
};

function get_lang(cookie_name) {
    let name = cookie_name + "=";
    let cookies = decodeURIComponent(document.cookie).split(';').map(cookie => cookie.trim());



    for (let cookie of cookies) {

        if (cookie.startsWith(name)) {
            let cookieValue = cookie.substring(name.length);
            return cookieValue;
        }
    }
    return "";
}


const add_search_window = (e) => {
    e.onclick = function (e) {
        e.preventDefault();
        const t = document.createElement("section");
        let language = get_lang("cookie");


        let placeholder = language === 'gr' ? "Αναζήτηση" : "Search";

        t.setAttribute("id", "search_window");
        t.innerHTML = `
            <div class="m-0 m-auto pb-2">
                <form class="flex relative search_form" method="GET" role="search" action="/search">
                    <div class="flex text-xl text-white relative hover:text-zinc-400" id="cancel">
                        <button class="my-0 mx-auto" id="cancel_butt"><span>X</span></button>
                    </div>
                    <input class="bg-gray-200 h-9 focus:outline-none focus:shadow-[inset_0_1px_1px_0_rgba(50,50,50,0.9)] text-xs text-gray-950 px-4 relative rounded-xl leading-3 new_search_inp"
                    type="search" aria-label="Search" name="search_inp" id="searchInput" placeholder="${placeholder}">
                    <div>
                        <button class="p-2 flex h-8 mb-2 ml-6 w-9 new_search_butt">
                            <svg class="text-white h-6 w-7 hover:text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.prepend(t);
        document.body.style.overflowY = "hidden";

        const n = document.querySelector("#cancel_butt"),
            r = document.querySelector(".new_search_inp"),
            c = document.querySelector(".new_search_butt");

        n.onclick = function (e) {
            e.preventDefault();
            t.remove();
            document.body.style.overflowY = "scroll";
        };

        c.addEventListener("click", function (e) {
            if ("" === r.value || r.value.length < 4) {
                e.preventDefault();
                alert("Please use more than 3 characters to search");
            }
        });
    };
},
    search_button = document.querySelector("#search_butt");
let search_button_mini = document.querySelector("#search_butt_mini"),
    burger = document.querySelector(".burger");
if ((search_button && add_search_window(search_button), search_button_mini && add_search_window(search_button_mini))) {
    const e = document.querySelector("#profile_butt");
    e && (e.style.display = "none");

}

else search_button_mini = undefined;

const search_submit = document.querySelector(".search_submit"),
    new_search_inp = document.querySelector('.new_search_inp');

if (window.location.toString().includes("profile")) {
    const e = document.querySelector("#profile_butt"),
        link = e.querySelector("a");
    link.classList.add("no_hover");
    link.addEventListener('click', function (e) {
        e.preventDefault();
    });
}

function removeScripts(e) {
    let t = e.querySelectorAll("script");
    for (let e of t) e.remove();
}

function hide_menu() {
    const e = window.innerWidth,
        t = document.getElementById("menu");
    e >= 640 && (t.style.display = "none");
}
if (search_submit) {
    search_submit.addEventListener("click", function (e) {
        if (field.value === "" || field.value.length < 4) {
            e.preventDefault(); // Prevent form submission
            alert("Please use more than 3 characters to search"); // Alert user
        }
    });
}

// Event listener for burger menu toggle button
if (burger) {
    burger.addEventListener("click", function () {
        window.addEventListener("resize", hide_menu);
        if (menu.style.display === "none" || menu.style.display === "") {
            menu.style.display = "inline"; // Show menu
        } else {
            menu.style.display = "none"; // Hide menu
        }
    });
}

// Event listener for mini search button to close menu
if (search_button_mini) {
    search_button_mini.addEventListener("click", function () {
        menu.style.display = "none"; // Hide menu
    });
}

const header = document.querySelector("header");
let scroll = window.scrollY;
window.addEventListener("scroll", function () {
    window.scrollY > scroll ? header.classList.add("header-hidden") : header.classList.remove("header-hidden"), (scroll = window.scrollY);
});
