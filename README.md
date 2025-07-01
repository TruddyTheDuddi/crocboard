# CrocBoard
Game content building dashboard for creating levels and display some stats for the **"No, You Won't Speak to the Manager"** game. 

Access it and use it [here!](https://truddytheduddi.github.io/crocboard/)


## 1. Intro – Game Concept
This ultra dumb game consists of a series of messages from the antagonist that the player needs to read through. The concept is very similar and was inspired by [The Longest Game Ever](https://play.google.com/store/apps/details?id=longest.game&hl=en), but with a different theme.

The goal of the antagonist is for the player to give up and quit before reaching the end of the game (ie. talk to the manager). The game, while extremely long and annoying as heck, is designed to be finishable, but it will test the raw willpower and determination of the player.

The aim of **CrocBoard,** a.k.a. the dashboard, is to provide writers (me RIP) an interface to create the levels with the various features instead of having to either code it all manually in the game, or to write in JSON and import them. With this board, I can easily create levels, add components, manage them all in one place and export them to the game to generate the levels procedurally.

> [!NOTE]
> I am aiming to have at least 1000 levels, we'll see who joins and if it's enough for the game.


### 1.1. Level Types

Each message is a level, and the player needs to read and click to advance to the next one. Sometimes however the levels contain other tasks to complete before they can move on as explained below:
- **No Components:** Most basic compontent, only displays the message, the player reads it and simply clicks to advance.

- **Button:** The player must click a button to advance.

- **Count Button:** The player must click a button a specific number of times to advance.

- **Two Buttons:** The player needs to choose between two buttons, but only one is correct.

- **Input:** The player needs to write the correct answer in a Textbox. This can either be: 
    - A **static answer:** An answer that cannot ever change, like a fact, a name, etc... That will always be the same no matter what.

    - A **dynamic answer:** An answer that can change, today's date, the sum of randomly generated numbers,  etc... This lets the game know, once coded, that it needs to evaluate the answer dynamically at runtime. Therefore you add a unique identifier as the function's name.

- **Timeout (wait):** The player must wait a certain amount of time before they can advance.

## 2. Dashboard Features
- Create levels with a simple text editor and input fields, and add various components if needed. IT does the validation for you to avoid any mistakes.

- View all the levels that have beed created in the "Levels Database" section. Keep track of how many have been created.

- Edit or delete any level you have created.

- Import levels from a JSON file, or export all the levels to a JSON file.

- Login and set a username to keep track of who created which levels. Good for multiple writers editing the game content.

- Snazzy hacker style dahsboard! :P

## 3. Technical Details
I'm hosting the project on [Github Pages](https://truddytheduddi.github.io/crocboard/), you can easily access adn use it. Working on the levels will require the people to export, send the files and import them back in the dashboard. This is a limitation of the current implementation without the usage of databases, but it works well enough for now.

— ddemkoo 2025