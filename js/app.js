//-----------------category Names api-------------------------
const loadCategory = async () => {
    const categoryUrl = `https://openapi.programming-hero.com/api/news/categories`;

    const res = await fetch(categoryUrl);
    const data = await res.json();
    try {
        if (data == "") throw "empty";
    } catch (err) {
        console.log("error");
    }
    displayCategory(data.data.news_category);
};


const displayCategory = (categories) => {
    const listContainer = document.getElementById("category-container");
    loadCategoryItem(categories[0].category_id, categories[0].category_name);
    categories.forEach((category) => {
        const div = document.createElement("div");
        div.innerHTML = `
             <a><p onclick='loadCategoryItem("${category.category_id}", "${category.category_name}")'  class="text-gray-600 font-medium hover:text-emerald-500 hover:bg-gray-300 px-5 py-1 rounded-lg cursor-pointer">${category.category_name}</p></a>
        `;
        listContainer.appendChild(div);
    });
};

loadCategory();


//-----------------category items api-----------------------
const loadCategoryItem = async (category_id, category_name) => {
    toggleSpinner(true);
    const categoryUrl = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
    const res = await fetch(categoryUrl);
    const data = await res.json();

    const itemNumber = parseInt(data.data.length);
    if (itemNumber !== 0) {
        const itemContainer = document.getElementById("total-items");
        itemContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `
        ${itemNumber} items found for ${category_name}`;
        itemContainer.appendChild(div);
    } else {
        const itemContainer = document.getElementById("total-items");
        itemContainer.innerHTML = "";
        const div = document.createElement("div");
        div.innerHTML = `
        No item found for ${category_name}`;
        itemContainer.appendChild(div);
    }
    displayCategoryItems(data.data);
};
// ----------------------spinner--------------
const toggleSpinner = (isLoading) => {
    const spinner = document.getElementById("spinner");
    if (isLoading) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
};
// ---------------------category items card----------------------
const displayCategoryItems = (items) => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    items.forEach((element) => {
        const postDetails = element.details.slice(0, 300);
        if (element.author.published_date == null) {
            element.author.published_date = "No data found";
        }
        if (element.author.name == null || element.author.name == "") {
            element.author.name = "No data Found";
        }
        let views = element.total_view;
        if (views == null) {
            views = "No data found";
        }
        const card = document.createElement("div");
        card.classList.add("my-5");
        card.innerHTML = `
                    <div class="flex items-center flex-col bg-white rounded-lg border shadow-md md:flex-row md:max-w-2xl lg:max-w-7xl  mx-20">
                    <img
                        class="object-cover rounded-t-lg md:h-auto md:w-48 lg:w-96 md:rounded-none md:rounded-l-lg"
                        src="${element.image_url}"
                        alt=""
                    />
                    <div class="flex flex-col p-2 lg:p-5 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                            ${element.title}
                        </h5>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            ${postDetails}...
                        </p>
                        <div class="grid sm:grid-cols-2 md:grid-cols-3 mx-auto">
                            <div class="flex">
                                <div>
                                    <img src="${element.author.img}" alt="..." class="rounded-full w-20 p-2" />
                                </div>
                                <div>
                                    <p class="font-bold">${element.author.name}</p>
                                    <p>${element.author.published_date}</p>
                                </div>
                            </div>
                            <div class="mx-auto py-4"><i class="fa-solid fa-eye"></i>  ${views}</div>
                            <div class="ml-auto py-4 lg:mr-12 text-2xl">
                                <button
                                onclick='showDetails("${element._id}")'
                                 class=" bg-slate-200 hover:bg-slate-300 px-4 rounded"><i class="fa-solid fa-arrow-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        cardContainer.appendChild(card);
    });
    toggleSpinner(false);
};

// --------------------------modal----------------
const showDetails = async (news_id) => {
    const detailsUrl = `https://openapi.programming-hero.com/api/news/${news_id}`;
    const res = await fetch(detailsUrl);
    const data = await res.json();
    const details = data.data;

    const modalContainer = document.getElementById("modal-div");
    modalContainer.innerHTML = "";
    modalContainer.classList.remove("hidden");
    details.forEach((element) => {
        if (element.author.name == null || element.author.name == "") {
            element.author.name = "No data found";
        }
        if (element.author.published_date == null) {
            element.author.published_date = "No data found";
        }
        if (element.total_view == null) {
            element.total_view = "No data found";
        }
        const modal = document.createElement("div");
        modalContainer.innerHTML = `
            <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                    <!-- Modal content -->
                    <div class="relative rounded-lg shadow bg-gray-500">
                        <!-- Modal header -->
                        <div class="flex justify-between items-start p-4 rounded-t border-b">
                        <img src="${element.author.img}" alt="" class="w-20 rounded-full">
                            <button
                                onclick="decline()"
                                type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <i class="fa-solid fa-mark"></i>
                            </button>
                        </div>
                        <!-- Modal body -->
                        <div class="p-6 space-y-6">
                            <p class="text-base leading-relaxed text-white">Name: ${element.author.name}</p>
                            <p class="text-base leading-relaxed text-white">Published Date: ${element.author.published_date}</p>
                            <p class="text-base leading-relaxed text-white">Post title: ${element.title}</p>
                            <p class="text-base leading-relaxed text-white">Views: ${element.total_view}</p>
                            <p class="text-base leading-relaxed text-white">Rating: ${element.rating.badge} , ${element.rating.number}</p>
                            <p class="text-base leading-relaxed text-white">Post Id:  ${element._id}</p>
                        </div>
                        <!-- Modal footer -->
                        <div class="flex justify-end items-center p-6 space-x-2 rounded-b border-t border-gray-200">
                            <button
                                onclick="decline()"
                                class="text-white bg-red-500 hover:text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-normal font-medium px-5 py-2.5 focus:z-10"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
        `;
        modalContainer.appendChild(modal);
    });
};
const decline = () => {
    const modalContainer = document.getElementById("modal-div");
    modalContainer.classList.add("hidden");
};