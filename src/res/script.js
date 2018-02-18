"use strict"; // idk if strict even works

// classes
var Color = java.awt.Color;
var Dimension = java.awt.Dimension;
var Font = java.awt.Font;

var KeyAdapter = java.awt.event.KeyAdapter;
var KeyEvent = java.awt.event.KeyEvent;
var WindowAdapter = java.awt.event.WindowAdapter;

var BufferedImage = java.awt.image.BufferedImage;

var File = java.io.File;
var FileWriter = java.io.FileWriter;

var ClassLoader = java.lang.ClassLoader;
var Integer = java.lang.Integer;
var Runnable = java.lang.Runnable;
var System = java.lang.System;
var Thread = java.lang.Thread;

var Scanner = java.util.Scanner;

var ImageIO = javax.imageio.ImageIO;

var JFrame = javax.swing.JFrame;
var JPanel = javax.swing.JPanel;

// implemented on use
var MyKeyListener = Java.extend(KeyAdapter);
var MyPanel = Java.extend(JPanel, Runnable);
var MyWindowListener = Java.extend(WindowAdapter);

// class definitions end here

// images
var bg = ImageIO.read(ClassLoader.getSystemResourceAsStream("res/bg.png"));
var bird = ImageIO.read(ClassLoader.getSystemResourceAsStream("res/bird.png"));
var pipe = ImageIO.read(ClassLoader.getSystemResourceAsStream("res/pipe.png"));
var pipe_bottom = ImageIO.read(ClassLoader.getSystemResourceAsStream("res/pipe_bottom.png"));
var pipe_top = ImageIO.read(ClassLoader.getSystemResourceAsStream("res/pipe_top.png"));

var font = Font.createFont(Font.TRUETYPE_FONT, ClassLoader.getSystemResourceAsStream("res/PressStart2P-Regular.ttf"));
font = font.deriveFont(10.0);

// location of square, coordinates are from 0 to 1
var x = 0.1;
var y = 0.5;

// background offset
var bg_offset = 0;
var bg_speed = 1 / 50;

// size of the square
var sq_w = 0.05;
var sq_h = 0.05;

// size of a hole
var hole_w = sq_w * 3;
var hole_h = sq_h * 4.5;

// distance between holes
var distance = 0.3 + hole_w;

// an array of hole locations, there are 5 holes at any time
var holes = [];

var speed;

var gravity = 1 / 500000;

// BufferedImage for double buffered rendering
var buf = null;
var buf_g = null;

var gameover;

var passed_first_hole;

var score;
var old_highscore = 0;
var highscore = 0;

var highscore_file = new File("highscore.dat");
if (!highscore_file.exists()) {
	highscore_file.createNewFile();
	var writer = new FileWriter(highscore_file);
	writer.write("0");
	writer.close();
} else {
	var reader = new Scanner(highscore_file);
	highscore = reader.nextInt();
	old_highscore = highscore;
	reader.close();
}

function checkHighscore() {
	if (old_highscore == highscore)
		return;
	var writer = new FileWriter(highscore_file);
	writer.write(Integer.toString(highscore));
	writer.close();
	old_highscore = highscore;
}

function init() {
	y = 0.5;
	
	for (var i = 0; i < 5; i++) {
		holes[i] = {
			y: Math.random() * (1 - hole_h),
			x: 1 + i * distance
		};
	}
	
	speed = {
		x: 1 / 5000,
		y: 0
	};
	
	gameover = false;
	
	passed_first_hole = false;
	score = 0;
}
init();

// delta - elapsed milliseconds since last update call
function update(delta) {
	if (gameover) {
		checkHighscore();
	}
	
	y += speed.y;
	if (y < 0) {
		y = 0;
	}
	
	if (y >= 1) {
		gameover = true;
		return;
	}

	speed.y += gravity * delta;
	
	if (gameover)
		return;
	
	bg_offset += delta * bg_speed;
	
	for (var i in holes) {
		holes[i].x -= speed.x * delta;
	}
	
	if (holes[0].x < - hole_w) {
		passed_first_hole = false;
		holes = holes.slice(1);
		holes.push({
			x: holes[holes.length - 1].x + distance,
			y: Math.random() * (1 - hole_h)
		});
	}
	
	// could put holes.length instead of 2 but it works like this and is theoretically faster
	for (var i = 0; i < 2; i++) {
		if (x + sq_w > holes[i].x && x < holes[i].x + hole_w && 
				(y < holes[i].y || y + sq_h > holes[i].y + hole_h)) {
			gameover = true;
			return;
		}
	}
	
	if (!passed_first_hole && x > holes[0].x + hole_w) {
		passed_first_hole = true;
		score++;
		if (score > highscore) {
			highscore = score;
		}
	}
}

// g - Graphics object for drawing
// width, height - size of panel
function draw(g, width, height) {
	// if the window is made too small it will crash the BufferedImage constructor
	if (width <= 0 || height <= 0)
		return;
	
	// if buffer hasn't been initialized or the window has been resized, we make a new buffer
	if (buf == null || buf.getWidth() != width || buf.getHeight() != height) {
		buf = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		buf_g = buf.getGraphics();
	}
	
	// draw the bg
	while (bg_offset > width) {
		bg_offset -= width;
	}
	buf_g.drawImage(bg, -bg_offset, 0, width, height, null);
	buf_g.drawImage(bg, width - bg_offset, 0, width, height, null);
	
	// draw the holes
	for (var i in holes) {
		buf_g.drawImage(pipe, holes[i].x * width, 0, hole_w * width, holes[i].y * height - pipe_top.getHeight(), null);
		buf_g.drawImage(pipe_top, holes[i].x * width, holes[i].y * height - pipe_top.getHeight(), hole_w * width, pipe_top.getHeight(), null);
		buf_g.drawImage(pipe, holes[i].x * width, (holes[i].y + hole_h) * height + pipe_bottom.getHeight(), hole_w * width, height, null);
		buf_g.drawImage(pipe_bottom, holes[i].x * width, (holes[i].y + hole_h) * height, hole_w * width, pipe_bottom.getHeight(), null);
	}

	// draw the square
	width -= sq_w * width;
	height -= sq_h * height;
	buf_g.drawImage(bird, x * width - 5, y * height - 5, sq_w * width + 10, sq_h * height + 10, null);

	var score_str = "Score: " + score;
	var hiscore_str = "Highscore: " + highscore;
	
	buf_g.setFont(font);
	var metrics = buf_g.getFontMetrics();
	
	buf_g.setColor(Color.darkGray);
	buf_g.fillRect(8, 13 - metrics.getAscent(), metrics.stringWidth(score_str) + 4, metrics.getHeight() + 4);
	buf_g.fillRect(8, 28 - metrics.getAscent(), metrics.stringWidth(hiscore_str) + 4, metrics.getHeight() + 4);
	
	buf_g.setColor(Color.white);
	buf_g.drawString(score_str, 10, 15);
	buf_g.drawString(hiscore_str, 10, 30);
	
	if (gameover) {
		var over_str = "Game Over";
		var press_str = "Press R to restart";
		
		var over_x = (width - metrics.stringWidth(over_str)) / 2;
		var press_x = (width - metrics.stringWidth(press_str)) / 2;
		
		buf_g.setColor(Color.darkGray);
		buf_g.fillRect(over_x - 2, height / 2 - 12 - metrics.getAscent(), metrics.stringWidth(over_str) + 4, metrics.getHeight() + 4);
		buf_g.fillRect(press_x - 2, height / 2 + 8 - metrics.getAscent(), metrics.stringWidth(press_str) + 4, metrics.getHeight() + 4)
		
		buf_g.setColor(Color.white);
		buf_g.drawString("Game Over", over_x, height / 2 - 10);
		buf_g.drawString("Press R to restart", press_x, height / 2 + 10);
	}
	
	// draw the buffer
	g.drawImage(buf, 0, 0, null);
}


// make the frame
var frame = new JFrame();
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setTitle("Hello World!");

// class is implemented here bcs i did it with the panel class, too
var keyListener = new MyKeyListener({
	keyPressed: function(e) {
		if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
			checkHighscore();
			System.exit(0);
		} else if (e.getKeyCode() == KeyEvent.VK_SPACE) {
			if (!gameover) {
				speed.y = -1 / 1000;
			}
		} else if (e.getKeyCode() == KeyEvent.VK_R) {
			checkHighscore();
			init();
		}
	}
});

frame.addKeyListener(keyListener);

var windowListener = new MyWindowListener({
	windowClosed: function(e) {
		checkHighscore();
	},
	windowClosing: function(e) {
		checkHighscore();
	}
});

frame.addWindowListener(windowListener);

// class is implemented here bcs idk how else to do Java.super()
var panel = new MyPanel({
	// paint() is empty bcs we don't want to do the normal rendering
	paint: function(g) {},
	run: function() {
		// this will be used to store the panel size
		var size = new Dimension();
		
		// for timing
		var oldTime = System.currentTimeMillis();
		var time = oldTime;
		while (true) {
			oldTime = time;
			time = System.currentTimeMillis();
			var delta = time - oldTime;
			var graphics = Java.super(panel).getGraphics();
			// graphics might be null if the panel isn't yet visible
			if (graphics != null) {
				size = Java.super(panel).getSize(size);
				update(delta);
				draw(graphics, size.width, size.height);
			}
			// sleep a bit
			Thread.sleep(1);
		}
	}
});
frame.add(panel);

// start the thread before making the frame visible so that there isn't an empty frame 
new Thread(panel).start();

frame.setSize(640, 480);
// this centers the frame
frame.setLocationRelativeTo(null);
frame.setVisible(true);