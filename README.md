### Running instructions for submission

Install required modules

> npm install

Start the client app

> npm start

View in browser

> http://localhost:3000/

### Notes on interaction

- Hashtags are not considered **complete** until you use a space or make a selection from the list
- It's possible to leave a person, hashtag, or relation editing field incomplete, this is by design. You can do so by clicking outside the field.
- You can continue editing a person, hashtag, or relation by clicking in the unfinished field.
- Active or incomplete fields are lighter and are surrounded by dashed lines instead of solid lines.
- Once **completed**, entities cannot be edited. You can delete them by backspacing.
- only Mark Cuban and Mark Zuckerberg have photos
- The automplete list supports the right and left boundary edge cases, where it will move the list to the left or above the typing area if needed.
- If the user deletes the @, # or <> characters, we assume the user does not want to create an entity and the remaining text will become plain text
