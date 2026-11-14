
/* =========================================
   RESUME RENDERER
========================================= */

const ICONS = {

    summary:
        '<circle cx="12" cy="12" r="8"/>' +
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',

    education:
        '<path d="M2 9l10-5 10 5-10 5z"/>' +
        '<path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',

    projects:
        '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',

    skills:
        '<path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z"/>'
};


/* =========================================
   ESCAPE USER DATA
========================================= */

const esc = value =>
    String(value ?? "").replace(/[&<>"]/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
    })[char]);


/* =========================================
   LIST ITEMS
========================================= */

const points = list => {

    if (!Array.isArray(list) || !list.length) {
        return "";
    }

    return "<ul>" +
        list.map(point =>
            "<li>" + esc(point) + "</li>"
        ).join("") +
        "</ul>";

};


/* =========================================
   ORGANIZATION AND LOCATION
========================================= */

const orgLine = item =>
    [item.org, item.place]
        .filter(Boolean)
        .map(esc)
        .join(" | ");


/* =========================================
   EDUCATION AND PROJECT HISTORY
========================================= */

const items = list => {

    if (!Array.isArray(list) || !list.length) {
        return "<p>No information added yet.</p>";
    }

    return list.map(item =>

        '<div class="item">' +

            '<div class="head">' +

                '<span class="title">' +
                    esc(item.title) +
                '</span>' +

                '<span class="date">' +
                    esc(item.date) +
                '</span>' +

            '</div>' +

            '<div class="org">' +
                orgLine(item) +
            '</div>' +

            points(item.points) +

        '</div>'

    ).join("");

};


/* =========================================
   SECTION GENERATOR
========================================= */

const section = (icon, name, content) =>

    '<section class="sec">' +

        '<h2>' +

            '<span class="ic">' +

                '<svg viewBox="0 0 24 24"' +
                     ' xmlns="http://www.w3.org/2000/svg"' +
                     ' width="22" height="22"' +
                     ' fill="none"' +
                     ' stroke="#ffffff"' +
                     ' stroke-width="1.7"' +
                     ' stroke-linecap="round"' +
                     ' stroke-linejoin="round"' +
                     ' aria-hidden="true">' +

                    ICONS[icon] +

                '</svg>' +

            '</span>' +

            esc(name) +

        '</h2>' +

        content +

    '</section>';


/* =========================================
   RENDER RESUME
========================================= */

function renderResume(resume) {

    document.title = resume.name + " - Resume";

    const skills = Array.isArray(resume.skills)
        ? resume.skills
        : [];

    document.getElementById("paper").innerHTML =

        '<h1>' +
            esc(resume.name) +
        '</h1>' +

        '<dl class="contact">' +

            '<div>' +
                '<dt>Address</dt>' +
                '<dd>' + esc(resume.address) + '</dd>' +
            '</div>' +

            '<div>' +
                '<dt>Phone</dt>' +
                '<dd>' + esc(resume.phone) + '</dd>' +
            '</div>' +

            '<div>' +
                '<dt>E-mail</dt>' +
                '<dd>' + esc(resume.email) + '</dd>' +
            '</div>' +

        '</dl>' +

        '<div class="tl">' +

            section(
                "summary",
                "Professional Summary",
                "<p>" + esc(resume.summary) + "</p>"
            ) +

            section(
                "education",
                "Education",
                items(resume.education)
            ) +

            section(
                "projects",
                "Project History",
                items(resume.projectHistory)
            ) +

            section(
                "skills",
                "Technical Skills",

                '<ul class="skills">' +

                    skills.map(skill =>
                        "<li>" + esc(skill) + "</li>"
                    ).join("") +

                '</ul>'
            ) +

        '</div>';

}


/* =========================================
   INITIALIZE
========================================= */

const paper = document.getElementById("paper");
const downloadButton = document.getElementById("dl");

if (typeof RESUME !== "undefined") {
    renderResume(RESUME);
} else {
    paper.textContent = "Unable to load resume information.";
}


/* =========================================
   DOWNLOAD EXACTLY ONE A4 PAGE
========================================= */

downloadButton.addEventListener("click", async function () {

    if (
        typeof window.html2canvas !== "function" ||
        !window.jspdf ||
        typeof window.jspdf.jsPDF !== "function"
    ) {
        alert("PDF libraries are not loaded. Please refresh the page.");
        return;
    }

    downloadButton.disabled = true;
    downloadButton.textContent = "Preparing PDF...";

    let canvas;

    try {

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Capture the full paper, including content below its visible area
        canvas = await window.html2canvas(paper, {

            scale: 2,

            useCORS: true,

            backgroundColor: "#ffffff",

            logging: false,

            scrollX: 0,
            scrollY: 0,

            windowWidth: Math.max(
                document.documentElement.clientWidth,
                paper.scrollWidth
            ),

            windowHeight: Math.max(
                document.documentElement.clientHeight,
                paper.scrollHeight
            )

        });

        if (!canvas.width || !canvas.height) {
            throw new Error("Unable to capture resume.");
        }

        // Create exactly one A4 portrait page
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4",

            compress: true

        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Fit the entire captured resume inside A4
        const ratio = Math.min(
            pageWidth / canvas.width,
            pageHeight / canvas.height
        );

        const imageWidth = canvas.width * ratio;
        const imageHeight = canvas.height * ratio;

        const x = (pageWidth - imageWidth) / 2;
        const y = (pageHeight - imageHeight) / 2;

        const imageData = canvas.toDataURL("image/jpeg", 0.98);

        pdf.addImage(
            imageData,
            "JPEG",
            x,
            y,
            imageWidth,
            imageHeight,
            undefined,
            "FAST"
        );

        // Save one-page PDF
        pdf.save("My-Resume.pdf");

        downloadButton.textContent = "Downloaded!";

    } catch (error) {

        console.error("PDF download error:", error);

        alert(
            "PDF generation failed: " +
            (error.message || "Unknown error")
        );

        downloadButton.textContent = "Download PDF";

    } finally {

        downloadButton.disabled = false;

        setTimeout(() => {
            downloadButton.textContent = "Download PDF";
        }, 1500);

        if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
        }

    }

});
