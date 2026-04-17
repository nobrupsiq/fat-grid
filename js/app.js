document.addEventListener("DOMContentLoaded", () => {
  const simulator = new GridSimulator(
    "grid-container",
    "generated-css",
    "controls-container",
  );

  const navList = document.getElementById("topic-nav-list");
  const topicTitle = document.getElementById("topic-title");
  const topicDescription = document.getElementById("topic-description");
  const topicExplanation = document.getElementById("topic-explanation");
  const copyBtn = document.getElementById("copy-code");
  const layoutModeSelect = document.getElementById("layout-mode");

  let activeTrack = "grid";
  let activeTopicKey = "";

  const renderTopic = (trackKey, topicKey) => {
    const track = learningTracks[trackKey];
    const topic = track.topics[topicKey];
    if (!topic) return;

    activeTopicKey = topicKey;
    topicTitle.textContent = topic.title;
    topicDescription.textContent = topic.description;
    topicExplanation.innerHTML = topic.explanation;
    simulator.loadTopic(topic);

    navList.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.topic === topicKey);
    });
  };

  const renderNav = (trackKey) => {
    const track = learningTracks[trackKey];
    navList.innerHTML = "";

    track.order.forEach((topicKey, index) => {
      const topic = track.topics[topicKey];
      const li = document.createElement("li");
      li.className = "nav-item";
      li.dataset.topic = topicKey;
      li.innerHTML = `
                <span class="nav-dot"></span>
                <span class="nav-text">${topic.navLabel || topic.title}</span>
            `;

      li.addEventListener("click", () => renderTopic(trackKey, topicKey));
      navList.appendChild(li);

      if (index === 0) {
        renderTopic(trackKey, topicKey);
      }
    });
  };

  layoutModeSelect.addEventListener("change", (event) => {
    activeTrack = event.target.value;
    renderNav(activeTrack);
  });

  copyBtn.addEventListener("click", () => {
    const code = document.getElementById("generated-css").textContent;
    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "Copiado!";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  });

  layoutModeSelect.value = activeTrack;
  renderNav(activeTrack);
});
