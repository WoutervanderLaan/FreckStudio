"use-strict";

const cursor = document.getElementById("cursor");
const copyright = document.getElementById("copyright");
const anchorTags = document.querySelectorAll("a");
const allSections = document.querySelectorAll(".section");
const magneticAreas = document.querySelectorAll(".magnetic-area");
const magneticButtons = document.querySelectorAll(".my-button");
const nightDaySlider = document.querySelector("#nightDay");
const slider = document.querySelector("#sliderCircle");
const avatarContainer = document.querySelector("#avatarContainer");
const avatar = document.querySelector("#avatar");
const hand = document.querySelector("#hand");

class App {
  #cursorBoolean = false;
  #themeBoolean = false;
  #sectionObserver = new IntersectionObserver(this._revealSections.bind(this), {
    root: null,
    threshold: 0.2,
  });

  constructor() {
    this._setDate();
    this._initCursorSizeChange();
    this._hideSections();
    this._initMagneticArea();

    document.addEventListener("mousemove", this._moveAvatar);
    document.addEventListener("mousemove", this._cursorInit.bind(this));
    document.addEventListener("mouseover", this._cursorColorChange);
    nightDaySlider.addEventListener("click", this._lightDarkSwitch.bind(this));
  }

  ///////// General methods /////////

  _setDate() {
    const date = new Date();
    const year = date.getFullYear();
    copyright.textContent = `© Freck Studio ${year}`;
  }

  ///////// Cursor related methods /////////

  _cursorInit(e) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    cursor.style.display = "block";
    if (!this.#cursorBoolean) {
      const cursorX = e.clientX - 3;
      const cursorY = e.clientY - 3 + scrollTop;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    } else {
      const cursorX = e.clientX;
      const cursorY = e.clientY + scrollTop;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    }
  }

  _initCursorSizeChange() {
    anchorTags.forEach((object) => {
      object.addEventListener("mouseover", () => {
        this.#cursorBoolean = true;
        cursor.style = "width: 2px; height: 2px;";
      });
      object.addEventListener("mouseleave", () => {
        this.#cursorBoolean = false;
        cursor.style = "width: 6px; height: 6px";
      });
    });
  }

  _cursorColorChange(e) {
    const color = getComputedStyle(e.target).backgroundColor;
    const colorArray = color.slice(4, -1).split(",");
    const convertedColorArray = colorArray.map((colorCode) =>
      Number(colorCode)
    );

    cursor.style.backgroundColor = `rgb(${255 - convertedColorArray[0]}, ${
      255 - convertedColorArray[1]
    }, ${255 - convertedColorArray[2]})`;
  }
  ///////// Avatar related methods /////////

  _moveAvatar(e) {
    document.querySelectorAll(".object").forEach((object) => {
      const movingValue = object.getAttribute("data-value");
      const x = (e.clientX * movingValue) / 250;
      const y = (e.clientY * movingValue) / 250;

      object.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
  }

  ///////// Section related methods /////////

  _hideSections() {
    allSections.forEach((section) => {
      section.classList.add("section--hidden");
      this.#sectionObserver.observe(section);
    });
  }

  _revealSections(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    this.#sectionObserver.unobserve(entry.target);
  }

  ///////// Magnetic btn related methods /////////

  _initMagneticArea() {
    magneticAreas.forEach((mArea, index) => {
      mArea.addEventListener("mousemove", (e) => {
        this._magnetizeButton(e, index);
      });
      mArea.addEventListener("mouseleave", () => {
        gsap.to(magneticButtons[index], 1, {
          x: 0,
          y: 0,
          ease: Power4.easeOut,
        });
      });
    });
  }

  _magnetizeButton(e, index) {
    const boundingRect = e.target.getBoundingClientRect();
    const strength = 20;

    const relX =
      ((e.clientX - boundingRect.left) / (boundingRect.width / 2) - 1) *
      strength;
    const relY =
      ((e.clientY - boundingRect.top) / (boundingRect.height / 2) - 1) *
      strength;

    gsap.to(magneticButtons[index], {
      x: relX,
      y: relY,
      duration: 1,
      ease: Power4.easeOut,
    });
  }

  ///////// Theme related methods /////////

  _lightDarkSwitch() {
    this.#themeBoolean = !this.#themeBoolean;
    document.body.classList.toggle("lightTheme");
    document.body.classList.toggle("darkTheme");

    const direction = this.#themeBoolean ? "30px" : "0px";
    gsap.to(slider, {
      x: direction,
    });

    if (this.#themeBoolean) {
      avatarContainer.style.opacity = "0";
      avatar.src = "img/MemojiDark.png";
      hand.src = "img/MemojiHandDark.png";

      avatar.addEventListener("load", () => {
        gsap.to(avatarContainer, {
          opacity: 1,
        });
      });
    }

    if (!this.#themeBoolean) {
      avatarContainer.style.opacity = "0";
      avatar.src = "img/Memoji.png";
      hand.src = "img/MemojiHand.png";

      avatar.addEventListener("load", () => {
        gsap.to(avatarContainer, {
          opacity: 1,
        });
      });
    }
  }
}

const app = new App();
