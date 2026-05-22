(function () {
  const widget = document.getElementById("chat-widget");
  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  const typing = document.getElementById("chat-typing");
  const openHero = document.getElementById("open-chat-hero");

  const avatarBot = `<span class="msg-avatar msg-avatar-bot" aria-hidden="true">
    <svg viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="10" rx="2" fill="#5b9bd5"/><circle cx="9.5" cy="11" r="1.2" fill="#fff"/><circle cx="14.5" cy="11" r="1.2" fill="#fff"/></svg>
  </span>`;

  const avatarUser = `<span class="msg-avatar msg-avatar-user" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
  </span>`;

  function setOpen(open) {
    widget.classList.toggle("is-open", open);
    panel.hidden = !open;
    if (toggle) {
      toggle.hidden = open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup chat" : "Buka chat");
    }
    if (open) input.focus();
  }

  toggle?.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn?.addEventListener("click", () => setOpen(false));
  openHero?.addEventListener("click", () => setOpen(true));

  function appendMessage(text, role) {
    const row = document.createElement("div");
    row.className = `message-row message-row-${role}`;
    const avatar = role === "bot" ? avatarBot : avatarUser;
    row.innerHTML = `${avatar}<div class="message message-${role}"><p>${escapeHtml(text)}</p></div>`;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function setLoading(loading) {
    typing.hidden = !loading;
    form.querySelector("button").disabled = loading;
    input.disabled = loading;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan");

      await delay(400);
      appendMessage(data.reply, "bot");
    } catch {
      appendMessage(
        "Sorry, something went wrong. Make sure the server is running (npm start).",
        "bot"
      );
    } finally {
      setLoading(false);
      input.focus();
    }
  });

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
})();
