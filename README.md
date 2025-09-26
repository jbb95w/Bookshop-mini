# Bookshop-mini
Mini Bookshop 📚

A small web app to search, view, and manage books. Users can search books via the Open Library API, view details, and admins can add or update featured books.

Features

Search Books: Search by title or author (first 5 results shown).

View Details: Click "View Details" to see cover, title, author, publisher, year, subjects, and description.

Featured Books: Preloaded fantasy books with "View Details" functionality.

Admin Panel: Add new books or update existing ones. Cover image optional.

How It Works

Search: Uses Open Library API (search.json) → displays books dynamically.

Featured Books: Fetched from subjects/fantasy.json → displayed in featured section.

Book Details: Dynamically updates #book-details section with info from the selected book.

Admin Panel: Checks if book exists → updates it or adds a new one dynamically.

Technologies

HTML, CSS, JavaScript

Open Library API

Setup

Open index.html in a browser.

Search books, click featured books, or add/update books via admin panel.

Internet required for fetching Open Library data.