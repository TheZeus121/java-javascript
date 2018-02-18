## Backstory
One day I found out that Java has a built-in engine for JavaScript. I had to check it out. It was disappointing that it didn't recognize `const` and `let` keywords, at least in the Oracle 1.8 JDK. Well, as it turned out, it is using Edition 5.1 of ECMAScript so, I guess, that might be the reason. But what was interesting was the fact that I could access Java classes from JavaScript. So I had to test out if I could make something graphical with that. I could. So, well, a few hours later this was born. So I present to you *(drum-roll)*
# Flappy Bird written in Java and JavaScript
Yes, that's right. You may want to kill me now, but don't worry, so do I.
## How to play it?
So you want to play it huh. You can grab a .jar file from the GitHub releases and run it with `java -jar jarfile.jar` or compile it yourself with `javac JsMain.java` in the `src/` folder and then play it with `java JsMain`. You can also just open all of this in Eclipse IDE and compile & run from there. 

Oh yea I guess you need at least Java 1.6 for the JavaScript engine, but I don't know, maybe I'm using something else newer. Java 8 should work.
## No, I mean how do I control the bird?
* Space to flap
* Escape to exit the game (there aren't any confirmation dialogs here)
* R to restart the game (there aren't any confirmation dialogs here either)

## I like the code, can I use it?
I know no one will say this, but I had to add this here. Yes, you can use the code, it's free.

### License

Copyright (C) 2018 Uko Koknevics

This project is free software. There is no warranty; not even for merchantability or fitness for a particular purpose.

The file `PressStart2P-Regular.ttf` located in `src/res/` folder is licensed under SIL Open Font License 1.1. See the file `LICENSE-OFL.txt` for more info.

You may use, copy, modify and redistribute all the other files included in this distribution, individually or in aggregate, subject to the terms and conditions of the MIT license. See the file `LICENSE-MIT.txt` for more info.

In addition, you may, at your own option, use, copy, modify and redistribute all images included in this distribution located in `src/res/` folder according to the terms and conditions of the Creative Commons Attribution 4.0 International Public License. See the file `LICENSE-CC-BY.txt` for more info.