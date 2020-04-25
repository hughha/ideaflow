### Running instructions for submission

Install required modules

> npm install

Start the client app

> npm start

View in browser

> http://localhost:3000/

### Notes on interaction

- Hashtags are not considered "complete" until you use a space or make a selection from the list
- You can continue editing a person, hashtag, relation by clicking in the unfinished field, which a lighter and surrounded by dashed lines instead of solid lines.
- Once "completed", entities cannot be edited. You can delete them by backspacing.
- only Mark Cuban and Mark Zuckerberg have photos
- The automplete list supports the right and left boundary edge cases, where it will move the list to the left or above the typing area if needed
- If the user deletes the @,# or <> characters, we assume the user does not want to create an entity and the remaining text become plain
