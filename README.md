# Mini TODO

Simple and mini TODO app; intended to be used with a Raspberry Pi mini touch screen display. Built using [Create React App](https://create-react-app.dev/).

### Screenshots

![General View](/demo_images/general_view.png)
![Multi-Use Menu](/demo_images/multi-use_menu.png)
![Adding Todos](/demo_images/adding_todos.png)

### Dependencies

-   Supabase (see [Customization](#customization))
-   Nano ID

## Initialization

First, you'll need a Supabase account (or see [Customization](#customization) to use a different database). Then, after creating a project and a table for your todos, you'll need to create a `.env` text file in the root directory, containing this:

```
REACT_APP_SUPABASE_URL=[Your Project URL]
REACT_APP_SUPABASE_KEY=[Your Anon Key]
REACT_APP_TABLE_NAME=[Your Todos Table Name]
```

When using this app on a Raspberry Pi, you can add this to disable the cursor:

```
REACT_APP_KIOSK_MODE=true
```

Then, install dependencies and start the server with:

```
npm install & npm start
```

You can stop the app with `ctrl+c`. All subsequent restarts of the app will only require `npm start`.

## Usage

The UI is designed for a small landscape touch screen, but can still be used on any screen size. Tapping/clicking anywhere in a todo row checks/unchecks it. The right side contains the navigation arrows and the multi-use button.

### The Multi-Use Button (Dot Icon)

Pressing the multi-use button once checks/unchecks a todo. Holding it will bring up a menu with more options. Operations such as renaming or deleting will always be performed on the highlighted/selected todo, which can be changed via the arrow buttons.

### Console Functions

Some more advanced operations are available (e.g. adding multiple todos, deleting completed todos, reordering todos, etc.), but have no GUI; they are placed in the browser `window` object and can be accessed via `window.appConsoleFuncs`.

## Customization

While the data component of this app is built using Supabase, you can alternatively implement your own API for a different database. The data CRUD logic is decoupled from all other logic in this app. Simply replace these files in `src/utils/`:

-   `addTodos.js`
-   `deleteTodos.js`
-   `fetchTodos.js`
-   `updateTodos.js`

These files are required and referenced directly within `App.js`, but `getSupabase.js` can be deleted.
