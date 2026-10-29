# Day 8 Reflection

The most difficult concept for me in this course was understanding how system components work together when many users access an application at the same time. I initially found it challenging to understand why a system could not simply check whether a seat was available and then sell it. Working through the TicketHub design helped me understand the problem better. Two users could see the same seat as available, so the database needs transactions, locks, and constraints to ensure that only one buyer can secure it. Breaking the problem into smaller steps made the concept easier to understand.

I have not received specific feedback on my QuickNotes capstone yet, so I cannot claim to be making changes based on feedback. However, I would improve its error handling and data persistence. The application uses JSONPlaceholder for practice, which means creating and deleting notes does not permanently change the server's data. I would connect it to a real backend and database so users could keep their notes after refreshing the page. I would also test how the application behaves when requests fail.

Next, I want to learn more about backend development, SQL databases, and API integration. I also want to practise testing applications under concurrent traffic so I can better understand how to build systems that remain reliable as the number of users grows.
