const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const logoImg = document.getElementById("logo");
const downloadLink = document.getElementById("download");
const resultDiv = document.getElementById("result");

// Hide result initially
resultDiv.style.display = "none";

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert("Please enter a prompt!");

  generateBtn.disabled = true; // Disable button while loading
  generateBtn.textContent = "Generating...";

  try {
    const res = await fetch("/generate-logo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (data.image) {
      logoImg.src = `data:image/png;base64,${data.image}`;
      downloadLink.href = logoImg.src;
      resultDiv.style.display = "block";
    } else {
      alert("Failed to generate logo.");
    }
  } catch (err) {
    console.error(err);
    alert("Error generating logo. Check server logs.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Logo";
  }
});
