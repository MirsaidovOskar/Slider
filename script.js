const sliderContainer = document.querySelector(".keen-slider");
const arrowTextElement = document.querySelector(".arrow-content");

function navigation(slider) {
  let wrapper, arrowLeft, arrowRight, arrowContainer, arrowContent;

  let timeout;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 4000);
  }
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);

  function markup(remove) {
    wrapperMarkup(remove);
    arrowMarkup(remove);
  }

  function removeElement(elment) {
    elment.parentNode.removeChild(elment);
  }
  function createDiv(className) {
    var div = document.createElement("div");
    var classNames = className.split(" ");
    classNames.forEach((name) => div.classList.add(name));
    return div;
  }

  function arrowMarkup(remove) {
    if (remove) {
      removeElement(arrowLeft);
      removeElement(arrowRight);
      return;
    }

    arrowContainer = createDiv("arrow-container");
    arrowLeft = createDiv("arrow arrow--left");
    arrowLeft.addEventListener("click", () => slider.prev());
    arrowRight = createDiv("arrow arrow--right");
    arrowRight.addEventListener("click", () => slider.next());
    arrowContent = createDiv("arrow-content");

    sliderContainer.appendChild(arrowContainer);
    arrowContainer.appendChild(arrowLeft);
    arrowContainer.appendChild(arrowContent);
    arrowContainer.appendChild(arrowRight);
  }

  function wrapperMarkup(remove) {
    if (remove) {
      var parent = wrapper.parentNode;
      while (wrapper.firstChild)
        parent.insertBefore(wrapper.firstChild, wrapper);
      removeElement(wrapper);
      return;
    }
    wrapper = createDiv("navigation-wrapper");
    slider.container.parentNode.appendChild(wrapper);
    wrapper.appendChild(slider.container);
  }

  function updateClasses() {
    var slide = slider.track.details.rel;
    slide === 0
      ? arrowLeft.classList.add("arrow--disabled")
      : arrowLeft.classList.remove("arrow--disabled");
    slide === slider.track.details.slides.length - 1
      ? arrowRight.classList.add("arrow--disabled")
      : arrowRight.classList.remove("arrow--disabled");

    var slideDetails = slider.track.details;
    console.log(slideDetails);
    arrowContent.innerHTML = `<p>${
      slideDetails.rel + 1
    }<span class='arrow-content-faded'>/${slideDetails.length + 1}</span></p>`;
  }

  slider.on("created", () => {
    markup();
    updateClasses();
  });
  slider.on("optionsChanged", () => {
    console.log(2);
    markup(true);
    markup();
    updateClasses();
  });
  slider.on("slideChanged", () => {
    updateClasses();
  });
  slider.on("destroyed", () => {
    markup(true);
  });
}

var slider = new KeenSlider(
  "#my-keen-slider",
  {
    loop: true,
  },
  [navigation]
);
