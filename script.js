const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const searchResultsDiv = document.querySelector("#search-results .book-list"); 
const bookList = document.querySelector("#featured-books .book-list");
const bookDetailsSection = document.getElementById("book-details");
const addBookForm = document.getElementById("add-book-form");

// Search functionality
searchBtn.addEventListener("click", () => {
    const userTyped = searchBar.value.trim();
    if (userTyped) {
        fetchBooks(userTyped);
    }
});

function fetchBooks(userTyped) {
    fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(userTyped)}`)
        .then(res => res.json())
        .then(data => displayResults(data.docs))
        .catch(err => console.error("Error fetching books:", err));
}

function displayResults(books) {
    searchResultsDiv.innerHTML = "";
    if (books.length === 0) {
        searchResultsDiv.innerHTML = "<p>No books found.</p>";
        return;
    }
    books.slice(0, 5).forEach(book => { 
        const div = document.createElement("div");
        div.classList.add("book");

        const coverId = book.cover_i;
        const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : "https://via.placeholder.com/150x200?text=No+Cover";
        div.innerHTML = `
            <img src="${coverUrl}" alt="Book Cover">
            <h3>${book.title}</h3>
            <p>by ${book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
            <button class="view-details-btn">View Details</button>
        `;

        // Event listener for "View Details"
        div.querySelector(".view-details-btn").addEventListener("click", () => {
            showBookDetails(book);
        });

        searchResultsDiv.appendChild(div);
    });
}

function showBookDetails(book) {
    const coverId = book.cover_i;
    const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` 
        : "https://via.placeholder.com/200x300?text=No+Cover";

    const publishYear = book.first_publish_year ? ` (${book.first_publish_year})` : "";
    const subjects = book.subject ? book.subject.slice(0, 3).join(", ") : "Not specified";

    let description = "Description not available.";
    if (book.subject && book.subject.length > 0) {
        description = `This book covers topics related to: ${subjects}`;
    }

    bookDetailsSection.innerHTML = `
        <h2>Book Details</h2>
        <img src="${coverUrl}" alt="Book Cover" style="max-width: 200px; height: auto;">
        <h3>${book.title}${publishYear}</h3>
        <p><strong>Author:</strong> ${book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
        <p><strong>Publisher:</strong> ${book.publisher ? book.publisher[0] : "Unknown"}</p>
        <p><strong>First Published:</strong> ${book.first_publish_year || "Unknown"}</p>
        <p><strong>Subjects:</strong> ${subjects}</p>
        <p><strong>Description:</strong> ${description}</p>
    `;
    bookDetailsSection.scrollIntoView({behavior: 'smooth'}); 
}

// Featured books
fetch("https://openlibrary.org/subjects/fantasy.json?limit=5")
    .then(res => res.json())
    .then(data => {
        const books = data.works;
        bookList.innerHTML = "";
        books.forEach(book => {
            addBookToFeatured({
                title: book.title,
                author_name: book.authors.map(a => a.name),
                cover_url: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : "cover.jpg",
                first_publish_year: book.first_publish_year
            });
        });
    })
    .catch(err => console.error("Error fetching books:", err));

// Admin Panel
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const description = document.getElementById("book-description").value.trim();
    const coverUrl = document.getElementById("book-cover").value.trim() || "cover.jpg";

    // Check if book already exists in featured books
    let existingBookDiv = Array.from(bookList.children).find(div => {
        return div.querySelector("h3").textContent === title;
    });

    const bookData = {
        title,
        author_name: [author],
        description,
        cover_url: coverUrl
    };

    if (existingBookDiv) {
        // Update existing book
        existingBookDiv.querySelector("img").src = coverUrl;
        existingBookDiv.querySelector("img").alt = title;
        existingBookDiv.querySelector("p").textContent = `by ${author}`;
        existingBookDiv.querySelector(".view-details-btn").onclick = () => showBookDetails(bookData);
    } else {
        // Add new book
        addBookToFeatured(bookData);
    }

    addBookForm.reset();
});

// Function to add a book to featured section
function addBookToFeatured(book) {
    const div = document.createElement("div");
    div.classList.add("book");

    div.innerHTML = `
        <img src="${book.cover_url}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>by ${book.author_name.join(", ")}</p>
        <button class="view-details-btn">View Details</button>
    `;

    div.querySelector(".view-details-btn").addEventListener("click", () => {
        showBookDetails(book);
    });

    bookList.appendChild(div);
}
