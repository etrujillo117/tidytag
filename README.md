# TidyTag

TidyTag is your digital solution for effortless home organization. This application helps you catalog and track your physical items using NFC tags, so you'll never lose anything again.

It's built with Next.js and Tailwind CSS, and it runs entirely in your browser, using local storage to save your data. No account or internet connection is required after the initial page load.

## Key Features

- **Create Virtual Containers:** Organize your items into containers like boxes, drawers, or closets. You can even nest containers within each other.
- **Catalog Your Items:** Add items to your containers with names, quantities, and photos taken directly from your device.
- **Global Item Search:** Instantly find any item across all your containers using the global search bar.
- **NFC Tag Integration:** Link containers to physical NFC tags. Simply scan a tag with your device to instantly pull up its contents.
- **Web NFC Support:** Utilizes your device's built-in NFC reader for a seamless scanning experience on supported browsers (like Chrome on Android). Includes a manual ID entry fallback for other devices.
- **Item Quantity Management:** Easily increase or decrease item quantities right from the item card.
- **Client-Side Storage:** All your data is stored securely and privately in your browser's local storage.
- **Responsive Design:** A clean, modern interface that works beautifully on both desktop and mobile devices.
- **Dark Mode:** Automatically adapts to your system's theme preference.

## How to Use

1.  **Create a Container:** Tap the big `+` button on the homepage to create your first container (e.g., "Attic Storage Box"). Choose whether it will hold items or other containers.
2.  **Add Items:** Open your new container and tap the `+` button again to add items. You can give them a name, set a quantity, and upload a photo.
3.  **Link an NFC Tag (Optional):**
    - On the homepage, use the "More" menu (`...`) on a container card and select "Edit".
    - Enter a unique ID for your physical NFC tag (e.g., `storage-box-01`). This ID is what you'll write to your tag using a separate NFC writer app.
4.  **Find Your Items:**
    - **By Scanning:** Tap the floating NFC button on any page. If your device supports it, hold it near the linked NFC tag to scan it. Otherwise, you can enter the tag ID manually. You'll be instantly redirected to the container's page.
    - **By Searching:** Tap the search icon in the header on any page. Start typing an item's name to see a list of results showing what container it's in.
    - **By Browsing:** Simply navigate through your created containers and sub-containers.

---

This project was generated in **Firebase Studio**.
