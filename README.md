# TidyTag

TidyTag is your digital solution for effortless home organization. This application helps you catalog and track your physical items using NFC tags or QR codes, so you'll never lose anything again.

It's built with Next.js and Tailwind CSS, and it runs entirely in your browser, using local storage to save your data. No account or internet connection is required after the initial page load.

## Key Features

- **Create Virtual Containers:** Organize your items into containers like boxes, drawers, or closets. You can even nest containers within each other.
- **Catalog Your Items:** Add items to your containers with names, quantities, and photos taken directly from your device.
- **Global Item Search:** Instantly find any item across all your containers using the global search bar.
- **NFC & QR Code Integration:** Link containers to physical NFC tags or scannable QR codes.
- **Web NFC Support:** Utilizes your device's built-in NFC reader for a seamless scanning experience on supported browsers (like Chrome on Android). Includes a manual ID entry fallback for other devices.
- **QR Code Generation & Printing:** Generate and print unique QR codes for any container. Stick them on your boxes and scan them with any smartphone camera to instantly pull up its contents.
- **Item Quantity Management:** Easily increase or decrease item quantities right from the item card.
- **Client-Side Storage:** All your data is stored securely and privately in your browser's local storage.
- **Responsive Design:** A clean, modern interface that works beautifully on both desktop and mobile devices.
- **Dark Mode:** Automatically adapts to your system's theme preference.

## How to Use

1.  **Create a Container:** Tap the big `+` button on the homepage to create your first container (e.g., "Attic Storage Box"). Choose whether it will hold items or other containers.
2.  **Add Items:** Open your new container and tap the `+` button again to add items. You can give them a name, set a quantity, and upload a photo.
3.  **Get a Tag:**
    - On the homepage or container page, use the "More" menu (`...`) on a container card and select "Show QR Code" to generate a printable QR code.
    - To use an NFC tag, select "Edit" from the same menu and enter a unique ID for your physical tag (e.g., `storage-box-01`). This is the ID you'll write to your tag using a separate NFC writer app.
4.  **Find Your Items:**
    - **By Scanning a Tag:** For NFC, tap the floating NFC button and hold your device near the tag. For QR codes, just open your phone's camera and point it at the code. You'll be instantly redirected to the container's page.
    - **By Searching:** Tap the search icon in the header on any page. Start typing an item's name to see a list of results showing what container it's in.
    - **By Browsing:** Simply navigate through your created containers and sub-containers.

---

This project was generated in **Firebase Studio**.
