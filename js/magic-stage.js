(() => {
  "use strict";
  const host = document.querySelector(".story-image");
  const stack = document.querySelector("#card-cascade");
  if (!stack) return;

  const suitMarks = {
    SPADES: "♠",
    HEARTS: "♥",
    DIAMONDS: "♦",
    CLUBS: "♣",
    S: "♠",
    H: "♥",
    D: "♦",
    C: "♣",
  };
  const shortRanks = { ACE: "A", KING: "K", QUEEN: "Q", JACK: "J", 10: "10", 9: "9", 8: "8", 7: "7", 6: "6" };
  const fallbackCards = ["ACE", "KING", "QUEEN", "JACK", "10", "9", "8", "7", "6"]
    .flatMap((value) => ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"].map((suit) => ({ value, suit })));

  function svgUrl(svg) {
    return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  }

  function numberPips(count, suit) {
    const layouts = {
      2: [[126, 103], [126, 249]],
      3: [[126, 86], [126, 176], [126, 266]],
      4: [[84, 100], [168, 100], [84, 252], [168, 252]],
      5: [[84, 100], [168, 100], [126, 176], [84, 252], [168, 252]],
      6: [[84, 82], [168, 82], [84, 176], [168, 176], [84, 270], [168, 270]],
      7: [[84, 76], [168, 76], [84, 151], [126, 176], [168, 201], [84, 276], [168, 276]],
      8: [[84, 72], [168, 72], [84, 138], [168, 138], [84, 214], [168, 214], [84, 280], [168, 280]],
      9: [[84, 68], [168, 68], [84, 130], [168, 130], [126, 176], [84, 222], [168, 222], [84, 284], [168, 284]],
      10: [[84, 66], [168, 66], [84, 122], [168, 122], [84, 176], [168, 176], [84, 230], [168, 230], [84, 286], [168, 286]],
    };
    return (layouts[count] || []).map(([x, y]) => {
      const flip = y > 180 ? ` transform="rotate(180 ${x} ${y})"` : "";
      return `<text x="${x}" y="${y + 9}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="27" fill="url(#foil)"${flip}>${suit}</text>`;
    }).join("");
  }

  function courtMedallion(rank, suit) {
    return `<g transform="translate(126 178)">
      <circle r="75" fill="url(#aura)" stroke="#8db9ff" stroke-opacity=".8" stroke-width="1.2"/>
      <circle r="64" fill="none" stroke="#dbe7fb" stroke-opacity=".54"/>
      <circle r="55" fill="none" stroke="#8db9ff" stroke-opacity=".38" stroke-dasharray="1 4"/>
      <path d="M-44-44L44 44M44-44L-44 44M0-59V59M-59 0H59" fill="none" stroke="#8db9ff" stroke-opacity=".55" stroke-width=".8"/>
      <path d="M0-35L30 0 0 35-30 0Z" fill="#081423" stroke="#dbe7fb" stroke-opacity=".84"/>
      <text y="11" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="42" fill="url(#foil)">${rank}</text>
      <text y="78" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="17" fill="#8db9ff">${suit}</text>
    </g>`;
  }

  function frontArt(card) {
    const rawValue = String(card.value ?? card.code?.slice(0, -1) ?? "A").toUpperCase();
    const rank = shortRanks[rawValue] || rawValue;
    const rawSuit = String(card.suit ?? card.code?.slice(-1) ?? "SPADES").toUpperCase();
    const suit = suitMarks[rawSuit] || "♠";
    const numeric = Number(rank);
    const center = Number.isInteger(numeric) && numeric >= 2 && numeric <= 10
      ? numberPips(numeric, suit)
      : rank === "A"
        ? `<g transform="translate(126 178)"><circle r="72" fill="url(#aura)" stroke="#8db9ff" stroke-opacity=".78"/><circle r="60" fill="none" stroke="#dbe7fb" stroke-opacity=".58"/><text y="23" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="96" fill="url(#foil)">${suit}</text><text y="101" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" letter-spacing="4" fill="#8db9ff">SHER</text></g>`
        : courtMedallion(rank, suit);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 352">
      <defs>
        <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101e31"/><stop offset=".48" stop-color="#07101d"/><stop offset="1" stop-color="#030812"/></linearGradient>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dbe7fb"/><stop offset=".48" stop-color="#8db9ff"/><stop offset="1" stop-color="#dbe7fb"/></linearGradient>
        <radialGradient id="aura"><stop stop-color="#315d9e" stop-opacity=".34"/><stop offset="1" stop-color="#07101d" stop-opacity="0"/></radialGradient>
        <pattern id="grain" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 7H14" stroke="#8db9ff" stroke-opacity=".075" stroke-width=".7"/></pattern>
      </defs>
      <rect x="3" y="3" width="246" height="346" rx="18" fill="#030812" stroke="#dbe7fb" stroke-opacity=".8" stroke-width="1.4"/>
      <rect x="9" y="9" width="234" height="334" rx="14" fill="url(#surface)" stroke="#8db9ff" stroke-opacity=".62"/>
      <rect x="15" y="15" width="222" height="322" rx="11" fill="url(#grain)"/>
      <rect x="21" y="21" width="210" height="310" rx="9" fill="none" stroke="#dbe7fb" stroke-opacity=".28"/>
      <path d="M32 69H220M32 283H220" stroke="#8db9ff" stroke-opacity=".42" stroke-width=".8"/>
      <path d="M32 32h14M39 25v14M206 32h14M213 25v14M32 320h14M39 313v14M206 320h14M213 313v14" stroke="#dbe7fb" stroke-opacity=".68" stroke-width="1"/>
      <g fill="url(#foil)" font-family="Georgia,'Times New Roman',serif">
        <text x="31" y="48" font-size="25">${rank}</text><text x="32" y="64" font-size="14">${suit}</text>
        <text x="221" y="304" text-anchor="end" font-size="25" transform="rotate(180 221 304)">${rank}</text>
        <text x="220" y="320" text-anchor="end" font-size="14" transform="rotate(180 220 320)">${suit}</text>
      </g>
      ${center}
    </svg>`;
    return svgUrl(svg);
  }

  const backArt = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 352">
    <defs>
      <linearGradient id="back" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101e31"/><stop offset=".52" stop-color="#07101d"/><stop offset="1" stop-color="#030812"/></linearGradient>
      <pattern id="weave" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 9H18M9 0V18" stroke="#8db9ff" stroke-opacity=".22" stroke-width=".7"/><circle cx="9" cy="9" r="2" fill="none" stroke="#dbe7fb" stroke-opacity=".26" stroke-width=".7"/></pattern>
      <radialGradient id="seal"><stop stop-color="#315d9e" stop-opacity=".42"/><stop offset="1" stop-color="#07101d" stop-opacity="0"/></radialGradient>
    </defs>
    <rect x="3" y="3" width="246" height="346" rx="18" fill="#030812" stroke="#dbe7fb" stroke-opacity=".86" stroke-width="1.4"/>
    <rect x="10" y="10" width="232" height="332" rx="14" fill="url(#back)" stroke="#8db9ff" stroke-opacity=".72"/>
    <rect x="16" y="16" width="220" height="320" rx="11" fill="url(#weave)"/>
    <rect x="23" y="23" width="206" height="306" rx="8" fill="none" stroke="#dbe7fb" stroke-opacity=".54"/>
    <path d="M34 34h24M46 27v24M194 34h24M206 27v24M34 318h24M46 306v24M194 318h24M206 306v24" stroke="#dbe7fb" stroke-opacity=".78" stroke-width="1"/>
    <path d="M126 50L202 176 126 302 50 176Z" fill="url(#seal)" stroke="#dbe7fb" stroke-opacity=".88" stroke-width="1.2"/>
    <path d="M126 70L182 176 126 282 70 176Z" fill="none" stroke="#8db9ff" stroke-opacity=".9" stroke-width="1.2"/>
    <path d="M126 94L161 176 126 258 91 176Z" fill="none" stroke="#dbe7fb" stroke-opacity=".56"/>
    <circle cx="126" cy="176" r="30" fill="#07101d" stroke="#dbe7fb" stroke-opacity=".85"/>
    <text x="126" y="181" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="16" letter-spacing="2" fill="#dbe7fb">SHER</text>
    <path d="M126 110v31M126 211v31M76 176h31M145 176h31" stroke="#8db9ff" stroke-opacity=".65"/>
  </svg>`);

  function appendCards(cards) {
    stack.replaceChildren();
    cards.forEach((card, index) => {
      const cardElement = document.createElement("span");
      cardElement.className = `cascade-card sides-${index + 1}`;
      const front = document.createElement("span");
      front.className = "front";
      front.style.backgroundImage = frontArt(card);
      const back = document.createElement("span");
      back.className = "back";
      back.style.backgroundImage = backArt;
      cardElement.appendChild(front);
      cardElement.appendChild(back);
      stack.appendChild(cardElement);
    });
  }

  async function initializeCards() {
    appendCards(fallbackCards);
    try {
      const deckResponse = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      if (!deckResponse.ok) throw new Error("Could not shuffle a deck");
      const deck = await deckResponse.json();
      const cardsResponse = await fetch(`https://deckofcardsapi.com/api/deck/${encodeURIComponent(deck.deck_id)}/draw/?count=36`);
      if (!cardsResponse.ok) throw new Error("Could not draw cards");
      const data = await cardsResponse.json();
      if (!Array.isArray(data.cards) || data.cards.length !== 36) throw new Error("Incomplete deck response");
      appendCards(data.cards);
    } catch (_) {
      // The local 36-card set is already visible; preserve it if file:// blocks fetch.
    }
  }

  const state = { x: 0, y: 0 };
  const applyAngle = () => {
    stack.style.setProperty("--tilt-x", `${state.x}deg`);
    stack.style.setProperty("--tilt-y", `${state.y}deg`);
  };
  if (host) {
    host.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      state.y = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      state.x = (0.5 - (event.clientY - rect.top) / rect.height) * 8;
      applyAngle();
    });
    host.addEventListener("pointerleave", () => {
      state.x = 0; state.y = 0; applyAngle();
    });
  }

  document.addEventListener("DOMContentLoaded", initializeCards);
})();
