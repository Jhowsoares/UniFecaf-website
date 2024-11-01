document.querySelectorAll(".ano button").forEach(function (button) {
  button.addEventListener("click", function () {
    const content = this.parentElement.nextElementSibling;

    if (content.classList.contains("expanded")) {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.padding = "50px";

      requestAnimationFrame(() => {
        content.style.maxHeight = "0";
        content.style.padding = "0";
      });

      setTimeout(() => {
        content.classList.remove("expanded");
        content.style.display = "none";
      }, 500);

      // Remove the rotate class when collapsed
      this.classList.remove("rotate");
    } else {
      document
        .querySelectorAll(".matriz-content.expanded")
        .forEach(function (openContent) {
          openContent.style.maxHeight = openContent.scrollHeight + "px";
          openContent.style.padding = "50px";

          requestAnimationFrame(() => {
            openContent.style.maxHeight = "0";
            openContent.style.padding = "0";
          });

          setTimeout(() => {
            openContent.classList.remove("expanded");
            openContent.style.display = "none";
            // Remove the rotate class from all buttons
            openContent.previousElementSibling
              .querySelector("button")
              .classList.remove("rotate");
          }, 500);
        });

      content.classList.add("expanded");
      content.style.display = "block";
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.padding = "50px";

      // Add the rotate class when expanded
      this.classList.add("rotate");
    }
  });
});

const images = [
  "imgs/bg-computaçao.png",
  "imgs/bg-civil.png",
  "imgs/bg-eletrica.png",
  "imgs/bg-producao.png",
];
let currentIndex = 0;

const imgElement = document.querySelector(".carousel-item img");
const prevButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");
const navLinks = document.querySelectorAll(".carousel-nav a");

function updateCarousel() {
  imgElement.src = images[currentIndex];
  navLinks.forEach((link, index) => {
    link.classList.toggle("active", index === currentIndex);
  });
}

prevButton.addEventListener("click", () => {
  currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  updateCarousel();
});

nextButton.addEventListener("click", () => {
  currentIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  updateCarousel();
});

navLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = index;
    updateCarousel();
  });
});

updateCarousel();

function searchAndScroll() {
  const searchInput = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!searchInput) return;

  // Remove destaques de buscas anteriores
  removeHighlights();

  // Seleciona todos os nós de texto no documento
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let found = false;
  let firstHighlight = null;

  // Percorre cada nó de texto
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.toLowerCase();

    // Verifica se o texto do nó contém o termo de busca
    if (text.includes(searchInput)) {
      highlightText(node, searchInput);

      // Armazena o primeiro destaque encontrado para rolar até ele
      if (!found) {
        firstHighlight = node.parentElement.querySelector(".highlight");
        found = true;
      }
    }
  }

  // Se encontrou algum termo, rola até o primeiro destaque
  if (found && firstHighlight) {
    // Centraliza o elemento na tela
    setTimeout(() => {
      firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  } else {
    alert("Texto não encontrado.");
  }
}

// Função para destacar o texto encontrado
function highlightText(textNode, searchText) {
  const parent = textNode.parentNode;
  const text = textNode.nodeValue;
  const index = text.toLowerCase().indexOf(searchText);

  if (index >= 0) {
    // Cria três partes do texto: antes, o termo buscado, e depois
    const before = document.createTextNode(text.slice(0, index));
    const highlight = document.createElement("span");
    highlight.className = "highlight";
    highlight.textContent = text.slice(index, index + searchText.length);
    const after = document.createTextNode(
      text.slice(index + searchText.length)
    );

    // Substitui o nó de texto original pelos novos nós com destaque
    parent.replaceChild(after, textNode);
    parent.insertBefore(highlight, after);
    parent.insertBefore(before, highlight);
  }
}

// Função para remover os destaques anteriores
function removeHighlights() {
  const highlights = document.querySelectorAll(".highlight");
  highlights.forEach((highlight) => {
    const textNode = document.createTextNode(highlight.textContent);
    highlight.parentNode.replaceChild(textNode, highlight);
  });
}
