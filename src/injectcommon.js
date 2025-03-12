const extensionElement = document.getElementById('ipo_extension_id');

window.IPO_extension_id = extensionElement.getAttribute('ipo_extension_id');
window.IPO_extension_version = extensionElement.getAttribute('ipo_extension_version');

extensionElement.parentNode.removeChild(extensionElement);
