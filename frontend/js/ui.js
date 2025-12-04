export function showNotification(msg, type = "info") {
    const div = document.getElementById("notification");
    div.textContent = msg;
    div.className = `notification ${type}`;
    div.style.display = "block";
    setTimeout(() => div.style.display = "none", 4000);
}

export function showLoading(id, state) {
    document.getElementById(id).style.display = state ? "block" : "none";
}
