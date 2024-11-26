function scrollToSection(sectionId) {
    const container = document.getElementById('horizontal-container');
    const target = document.getElementById(sectionId);
    if (container && target) {
        container.scrollLeft = target.offsetLeft;
    }
}
