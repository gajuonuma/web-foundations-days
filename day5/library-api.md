# Library Books REST API Design

## Overview

This API allows users to manage a library's book collection. Each book has an ID, title, author, publication year, and ISBN.

### Example book

{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publicationYear": 1958,
  "isbn": "9780385474542"
}



### Create


{
  "title": "Purple Hibiscus",
  "author": "Chimamanda Ngozi Adichie",
  "publicationYear": 2003,
  "isbn": "9781616202415"
}

### Update
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publicationYear": 1958,
  "isbn": "9780385474542"
}

### Error

{
  "error": "Not Found",
  "message": "The requested book was not found."
}


The examples above describe the API design; they do not mean that a real library server has been built. The six endpoints cover all the operations required by the assignment.

## Step 5: Test the assignment

Open `day5/index.html` in your browser. You can double-click the file in File Explorer, or use VS Code's Live Server if you already have that extension installed.

Test these behaviours in order:

- [ ] The page has the Load Users button, labelled filter input, status paragraph, and empty list before loading.
- [ ] Clicking **Load Users** displays a loading message and temporarily disables the button.
- [ ] The user list shows each person's name, email, city, and company.
- [ ] Typing `lea` or another partial name filters the displayed users without another request.
- [ ] Searching for a name that does not exist displays `No users match your filter.`
- [ ] The filter is case-insensitive.
- [ ] After a successful request, the button is enabled again.

### Test the error path

The assignment specifically asks you to test an unsuccessful request.

1. In `users.js`, temporarily change the API URL to an invalid one, for example:

   ```javascript
   const API_URL = "https://jsonplaceholder.typicode.com/invalid-users";