// Basic interactive behavior: likes & replies & search filter

// Likes toggle
document.querySelectorAll('.like-btn').forEach(btn => {
    // initialize displayed count
    const count = parseInt(btn.dataset.likes || "0", 10);
    btn.querySelector('.likes-count').textContent = count;
    btn.addEventListener('click', () => {
    const liked = btn.classList.toggle('liked');
    let current = parseInt(btn.querySelector('.likes-count').textContent, 10);
    current = liked ? current + 1 : Math.max(0, current - 1);
    btn.querySelector('.likes-count').textContent = current;
    });
});

// Replies button increments (simulates new reply)
document.querySelectorAll('.replies-btn').forEach(btn => {
    btn.querySelector('.replies-count').textContent = btn.dataset.replies || "0";
    btn.addEventListener('click', () => {
    let current = parseInt(btn.querySelector('.replies-count').textContent, 10);
    current++;
    btn.querySelector('.replies-count').textContent = current;
    });
});

// Search filtering posts by title/body/tags
const searchInput = document.getElementById('searchInput');
const posts = Array.from(document.querySelectorAll('.post'));
function filterPosts(){
    const q = searchInput.value.trim().toLowerCase();
    posts.forEach(p => {
    const title = p.dataset.title.toLowerCase();
    const body = p.dataset.body.toLowerCase();
    const tags = p.dataset.tags.toLowerCase();
    const match = !q || title.includes(q) || body.includes(q) || tags.includes(q);
    p.style.display = match ? '' : 'none';
    });
}
searchInput.addEventListener('input', filterPosts);

// Small UX nicety: press ENTER in top search to focus feed search
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if(e.key === 'Escape') e.target.value = '', filterPosts();
});

// make avatars initials from name if empty (example)
// (no-op here as we set initials inline)