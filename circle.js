function mod(n, m) {
  return ((n % m) + m) % m;
}

function Circle(x, y, diameter, z) {
  this.pos = createVector(x, y);
  this.diameter = diameter;
  this.radius = diameter / 2;

  this.show = function () {
    fill(0);
    circle(this.pos.x, this.pos.y, this.diameter);
  };

  this.move = function () {
    this.pos.add(createVector(0, map(noise(z), 0, 1, -2, 2)));
    z += 0.01;
    this.pos.x = mod(this.pos.x, windowWidth);
    this.pos.y = mod(this.pos.y, windowHeight);
  };
}
