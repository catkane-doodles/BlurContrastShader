let blurH, blurV, contrast;
let blurLevel = 0.4;
let particleSize = 10;

let width = 400;
let height = 800;

let fr = 30;
let cnv;
let pg;
let z = 0;

let totalParticles = 200;

let particles = [];

function preload() {
  // load the shaders, we will use the same vertex shader and frag shaders for both passes
  blurH = loadShader("base.vert", "blur.frag");
  blurV = loadShader("base.vert", "blur.frag");
  contrast = loadShader("base.vert", "contrast.frag");
}

function setup() {
  frameRate(fr);

  // create dom
  cnv = createCanvas(width, height);
  pg = createGraphics(width, height);

  noStroke();

  pass1 = createGraphics(width, height, WEBGL);
  pass2 = createGraphics(width, height, WEBGL);
  pass3 = createGraphics(width, height, WEBGL);

  pass1.noStroke();
  pass2.noStroke();
  pass3.noStroke();

  // let numberOfCircles = random(totalParticles);
  for (let i = 0; i < totalParticles; i++) {
    particles.push(
      new Circle(random(width), random(height), particleSize, random(100))
    );
  }
}

function draw() {
  background(255);
  pg.background(255);
  particles.forEach(function (particle) {
    particle.move();
    pg.fill(0);
    pg.ellipse(particle.pos.x, particle.pos.y, particle.diameter);
  });

  // set the shader for our first pass
  pass1.shader(blurH);

  // send the camera texture to the horizontal blur shader
  // send the size of the texels
  // send the blur direction that we want to use [1.0, 0.0] is horizontal
  blurH.setUniform("tex0", pg);
  blurH.setUniform("texelSize", [blurLevel / width, 0.7 / height]);
  blurH.setUniform("direction", [1.0, 0.0]);

  // we need to make sure that we draw the rect inside of pass1
  pass1.rect(0, 0, width, height);

  pass2.shader(blurV);

  // instead of sending the webcam, we will send our first pass to the vertical blur shader
  // texelSize remains the same as above
  // direction changes to [0.0, 1.0] to do a vertical pass
  blurV.setUniform("tex0", pass1);
  blurV.setUniform("texelSize", [blurLevel / width, blurLevel / height]);
  blurV.setUniform("direction", [0.0, 1.0]);

  // again, make sure we have some geometry to draw on in our 2nd pass
  pass2.rect(0, 0, width, height);

  pass3.shader(contrast);

  contrast.setUniform("tex0", pass2);

  // rect gives us some geometry on the screen
  pass3.rect(0, 0, width, height);

  image(pass3, 0, 0, width, height);
  // draw the second pass to the screen
}
