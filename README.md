# iTICKET Technical Challenge

This repo contains all the info you need to complete the iTICKET frontend Technical Challenge.

We will provide you with User Stories and an API which you will need to turn into a frontend app.

Please treat this as a real life project. eg use git version control, tests and some basic documentation.

We are here to help during this process. You can ask us questions, get clarification and ask for advice. We encourage communication. A lot of this process is designed to see how you work and how you interact with us.

## Stage 1: Planning

Use the user stories below to come up with some project requirements.

Draw some wireframes showing the pages you intend to create and the functionality on each (back of the napkin sketches are fine).

We will then discuss what you have come up with and make sure it's in the scope of the challenge then continue with stage two.

## Stakeholders

- **Ticketing Company**: The company selling the tickets (iTICKET).
- **Event Goer**: The person who is purchasing tickets on the iTICKET website.

## User Stories

These user stories define a small slice of our frontend where Event Goers can buy tickets. You are not required to design any backend or dashboard.

1. As an Event Goer I want to see what event's are on so I can go to one.
1. As an Event Goer I want to be able to book tickets to multiple events at once so I don't have to do multiple transactions.

1. As an Event Goer purchasing tickets to a General Admission event

   1. I want to be able to add or remove tickets from my cart.
   1. I want to be able to see the available ticket prices.

1. As The Ticketing Company we want to limit the number of tickets an Event Goer can purchase to the amount shown on the Event Record.
1. As The Ticketing Company, we want to limit the number of each price ticket an Event Goer can purchase for General Admission Events to 10 tickets.

1. As The Ticketing Company or the Event Goer we want the totals displayed on the order summary to be correct.

## Glossary

- **Allocated Seating**: An event that has a seating plan where one seat is one ticket.
- **General Admission**: An event that has a set capacity in an area.

## API

Documentation for the API can be found here https://technical-test-api.azurewebsites.net/documentation with the base url being https://technical-test-api.azurewebsites.net/. You can also import the API into a tool like Insomnia or Postman using OpenAPI3 json url here https://technical-test-api.azurewebsites.net/documentation/json

## Stage 2: Build

To get started, first fork the repo.

Next, clone your forked repo.

```
git clone https://github.com/<your-username>/frontend-coding-challenge.git
```

Go to the directory.

```
cd frontend-coding-challenge
```

Then install the dependencies.

```
yarn add
```

Then run dev to start the server.

```
yarn dev
```

We have included Next.js, and Tailwind CSS for this challenge as these are the technologies we use. If you are unfamiliar with either of these, you can find the documentation here:

[Tailwind CSS](https://tailwindcss.com/docs/installation)

[Next.js](https://nextjs.org/docs/getting-started)
