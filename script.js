// 🔥 Firebase-konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyDfDFaw8CsYiubp-m7tKZ1vpqYr-HXtvMg",
    authDomain: "dragdrop-project.firebaseapp.com",
    databaseURL: "https://dragdrop-project-default-rtdb.firebaseio.com",
    projectId: "dragdrop-project",
    storageBucket: "dragdrop-project.appspot.com",
    messagingSenderId: "873434336262",
    appId: "1:873434336262:web:4d5e0a7d82225bbaf54787"
};

// 🔥 Initiera Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 DOM laddad!");

    const grid = document.querySelector(".image-grid");

    if (!grid) {
        console.error("❌ image-grid hittades inte i HTML!");
        return;
    }

    // 🔥 Standardbildlänkar
    const imageSources = [
        "https://i.postimg.cc/vm3j97Jg/1.jpg",
        "https://i.postimg.cc/fLqG475n/10.jpg",
        "https://i.postimg.cc/Y0fQGRPT/11.jpg",
        "https://i.postimg.cc/FRHMnCyV/12.jpg",
        "https://i.postimg.cc/SKd0dbMK/13.jpg",
        "https://i.postimg.cc/q74V2vgY/14.png",
        "https://i.postimg.cc/YCcwq37t/15.jpg",
        "https://i.postimg.cc/zGnYLgDK/16.jpg",
        "https://i.postimg.cc/CLngg2Wv/17.jpg",
        "https://i.postimg.cc/gcTW1pBX/18.png",
        "https://i.postimg.cc/D08Kmpmw/19.jpg",
        "https://i.postimg.cc/SKy3J1vb/2.jpg",
        "https://i.postimg.cc/wMZYN5sc/20.jpg",
        "https://i.postimg.cc/k4jmJPJH/21.jpg",
        "https://i.postimg.cc/xCjQV12H/22.jpg",
        "https://i.postimg.cc/rpNTHtvM/23.jpg",
        "https://i.postimg.cc/dVdw8f67/24.jpg",
        "https://i.postimg.cc/9FDWf0qY/25.jpg",
        "https://i.postimg.cc/9Fscw2d5/26.jpg",
        "https://i.postimg.cc/fbNZ5vq8/27.png",
        "https://i.postimg.cc/sxNscdbW/28.jpg",
        "https://i.postimg.cc/7h6q0YtD/29.jpg",
        "https://i.postimg.cc/LX5WVYSy/3.jpg",
        "https://i.postimg.cc/NGJsYmL0/30-SELL.jpg",
        "https://i.postimg.cc/fL5wV0KB/31.jpg",
        "https://i.postimg.cc/d02QKfTM/32.jpg",
        "https://i.postimg.cc/W4LpCVz6/33.jpg",
        "https://i.postimg.cc/zGRXxvzG/34.jpg",
        "https://i.postimg.cc/SscM3Vmj/35.jpg",
        "https://i.postimg.cc/YCyYWhX2/36.jpg",
        "https://i.postimg.cc/N09T7BV6/37.png",
        "https://i.postimg.cc/MZy7FZGt/38.jpg",
        "https://i.postimg.cc/fTCxMHm9/39.png",
        "https://i.postimg.cc/cL7P1GTc/4.jpg",
        "https://i.postimg.cc/L5Mz8wxz/40.png",
        "https://i.postimg.cc/mDTLZSQP/41.png",
        "https://i.postimg.cc/qMq7CQWn/42.jpg",
        "https://i.postimg.cc/MKLp0V8L/43.jpg",
        "https://i.postimg.cc/7Pm66jtw/44.jpg",
        "https://i.postimg.cc/cC94b8tr/45.jpg"
    ];

    async function loadImages() {
        grid.innerHTML = "";

        try {
            const snapshot = await db.ref("imageOrder").once("value");
            let savedOrder = snapshot.val();

            // 🟢 Om Firebase-data är null, spara och använd standardbilder
            if (!savedOrder) {
                console.warn("⚠️ Ingen sparad bildordning hittades, använder standardbilder.");
                savedOrder = imageSources;
                await db.ref("imageOrder").set(imageSources);
            }

            // 🟢 Om Firebase-data är ett objekt, konvertera till array
            if (typeof savedOrder === "object" && !Array.isArray(savedOrder)) {
                savedOrder = Object.values(savedOrder);
            }

            savedOrder.forEach((src) => {
                const wrapper = document.createElement("div");
                wrapper.classList.add("image-wrapper");
                wrapper.setAttribute("draggable", "true");
                wrapper.style.cursor = "grab";

                const img = document.createElement("img");
                img.src = src;
                img.alt = "Projektbild";
                img.loading = "lazy";
                img.onerror = () => console.error(`❌ Bilden kunde inte laddas: ${src}`);

                wrapper.appendChild(img);
                grid.appendChild(wrapper);
            });

            addDragAndDropListeners();
        } catch (error) {
            console.error("❌ Fel vid hämtning av bilder:", error);
        }
    }

    function addDragAndDropListeners() {
        let draggedItem = null;

        document.querySelectorAll(".image-wrapper").forEach((item) => {
            item.addEventListener("dragstart", (e) => {
                draggedItem = item;
                setTimeout(() => item.classList.add("hidden"), 0);
            });

            item.addEventListener("dragend", () => {
                draggedItem.classList.remove("hidden");
                saveImageOrder();
            });

            item.addEventListener("dragover", (e) => e.preventDefault());

            item.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedItem === item) return;

                const allItems = [...grid.querySelectorAll(".image-wrapper")];
                const droppedIndex = allItems.indexOf(item);
                grid.insertBefore(draggedItem, droppedIndex < allItems.indexOf(draggedItem) ? item : item.nextSibling);
                saveImageOrder();
            });
        });
    }

    async function saveImageOrder() {
        const newOrder = [...document.querySelectorAll(".image-wrapper img")].map(img => img.src);

        try {
            await db.ref("imageOrder").set(newOrder);
            console.log("✅ Bildordning sparad i Firebase!");
        } catch (error) {
            console.error("❌ Fel vid sparning:", error);
        }
    }

    // 🔥 Kortkommando för att aktivera Admin-läge (Ctrl + H / Cmd + H)
    document.addEventListener("keydown", async function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "h") {
            event.preventDefault();

            try {
                const snapshot = await db.ref("isAdmin").once("value");
                let currentAdminStatus = snapshot.val() || false; // Om inget finns, börja med false

                currentAdminStatus = !currentAdminStatus; // Växla mellan true/false

                await db.ref("isAdmin").set(currentAdminStatus);
                alert(`Adminläge ${currentAdminStatus ? "aktiverat" : "avaktiverat"}! Ladda om sidan.`);
                location.reload();
            } catch (error) {
                console.error("❌ Fel vid uppdatering av adminläge:", error);
            }
        }
    });

    loadImages();
});