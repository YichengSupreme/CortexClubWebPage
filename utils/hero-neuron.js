let heroSketch = function (p) {
  let branches = [];
  let sparks = [];

  p.setup = function () {
    let heroSection = document.querySelector(".hero");
    let canvas = p.createCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
    let canvasElement = document.getElementById("hero-canvas");
    if (canvasElement) {
      canvas.parent("hero-canvas");
    }
    canvas.position(0, 0);
    p.noFill();
    p.colorMode(p.RGB, 255);
    p.background(11, 26, 51, 0); // Previous blue #0b1a33

    // Start from slightly right of center for balance
    branches.push(new Branch(p.width * 0.68, p.height * 0.75, -p.PI / 2, 130));
    branches.push(new Branch(p.width * 0.72, p.height * 0.8, -p.PI / 2.1, 110));
  };

  p.draw = function () {
    // Faint translucent background for trail effect (previous blue #0b1a33)
    p.colorMode(p.RGB, 255);
    p.background(11, 26, 51, 25);

    // Subtle global breathing motion
    p.push();
    let t = p.frameCount * 0.002;
    p.translate(p.width / 2, p.height / 2);
    p.scale(1 + 0.015 * Math.sin(t));
    p.translate(-p.width / 2, -p.height / 2);

    // Soft background neural fog with gentle sway
    let swayPhase = p.frameCount * 0.0004; // Very slow sway (~8 seconds per cycle)
    let swayAmount = Math.sin(swayPhase) * 12; // Gentle sway range: ±8 pixels
    
    for (let i = 0; i < 10; i++) {
      p.stroke(200, 80, 255, 5);
      let baseX1 = p.noise(i, p.frameCount * 0.001) * p.width;
      let baseY1 = p.noise(i + 50, p.frameCount * 0.001) * p.height;
      
      // Add gentle sway based on position and phase
      let swayX = Math.sin(swayPhase + i * 0.5) * swayAmount;
      let swayY = Math.cos(swayPhase + i * 0.5) * swayAmount * 0.5; // Less vertical sway
      
      let x1 = baseX1 + swayX;
      let y1 = baseY1 + swayY;
      let x2 = x1 + p.random(-30, 30);
      let y2 = y1 + p.random(-30, 30);
      p.line(x1, y1, x2, y2);
    }

    // Draw branches with glow and core
    // Outer glow — transparent soft white with super slow pulsing
    // Faint pulse every ~4 seconds (barely perceptible neuronal firing reminder)
    let pulseTime = p.frameCount * 0.00015; // Very slow: ~4 seconds per cycle
    let pulseIntensity = 5 + Math.sin(pulseTime) * 3; // Pulse between 2-8 opacity (very faint)
    
    p.stroke(255, 255, 255, pulseIntensity);
    p.strokeWeight(5);
    for (let b of branches) b.display();

    // Core white — brighter but still translucent
    p.stroke(255, 255, 255, 180);
    p.strokeWeight(1.3);
    for (let b of branches) b.display();

    // Update branches (growth)
    for (let b of branches) b.update();

    // Sparks (glowing blue particles)
    for (let s of sparks) s.update();
    sparks = sparks.filter((s) => !s.dead);

    // Add random sparks occasionally
    if (p.random() < 0.02) {
      sparks.push(new Spark(p.random(p.width), p.random(p.height)));
    }
    p.pop();
  };

  // Branch Class — growing neuron segment
  function Branch(x, y, angle, len) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.len = len;
    this.progress = 0;
    this.grown = false;
    this.growthSpeed = 0.012 + p.random(0.008); // Slightly variable speed for organic feel

    // Easing function for smooth growth (ease-out)
    this.easeOut = function(t) {
      return 1 - Math.pow(1 - t, 3); // Cubic ease-out
    };

    this.display = function () {
      // Apply easing for smoother visual growth
      let easedProgress = this.easeOut(this.progress);
      let x2 = this.x + this.len * easedProgress * p.cos(this.angle);
      let y2 = this.y + this.len * easedProgress * p.sin(this.angle);
      p.line(this.x, this.y, x2, y2);
    };

    this.update = function () {
      if (this.progress < 1) {
        // Slower, smoother increment
        this.progress += this.growthSpeed;
        // Clamp to 1 to avoid overshooting
        if (this.progress > 1) this.progress = 1;
      } else if (!this.grown && this.len > 8) {
        this.grown = true;
        setTimeout(() => {
          const angleSpread = p.random(0.3, 0.6);
          // 1–2 branches per node for organic growth
          branches.push(
            new Branch(
              this.x + this.len * p.cos(this.angle),
              this.y + this.len * p.sin(this.angle),
              this.angle + p.random(-angleSpread, angleSpread),
              this.len * 0.8
            )
          );
          if (p.random() < 0.6) {
            branches.push(
              new Branch(
                this.x + this.len * p.cos(this.angle),
                this.y + this.len * p.sin(this.angle),
                this.angle + p.random(-angleSpread, angleSpread),
                this.len * 0.7
              )
            );
          }
          if (p.random() < 0.4) sparks.push(new Spark(this.x, this.y));
        }, 200);
      }
    };
  }

  // Spark Class — glowing moving particle
  function Spark(x, y) {
    this.x = x;
    this.y = y;
    this.life = 255;
    this.angle = p.random(p.TWO_PI);
    this.speed = p.random(0.5, 1.5);
    this.dead = false;

    this.update = function () {
      this.x += p.cos(this.angle) * this.speed;
      this.y += p.sin(this.angle) * this.speed;
      this.life -= 3;

      let alpha = p.map(this.life, 0, 255, 0, 180);
      p.stroke(255, 255, 255, alpha);
      p.strokeWeight(2 + 0.5 * Math.sin(this.life * 0.1));
      p.strokeWeight(2 + 0.5 * Math.sin(this.life * 0.1));
      p.point(this.x, this.y);

      if (this.life <= 0) this.dead = true;
    };
  }

  // Handle window resize
  p.windowResized = function () {
    let heroSection = document.querySelector(".hero");
    p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
  };
};

// Wait for p5 to load
window.addEventListener("load", function () {
  if (typeof p5 !== "undefined") {
    new p5(heroSketch);
  } else {
    setTimeout(function () {
      if (typeof p5 !== "undefined") new p5(heroSketch);
    }, 100);
  }
});
