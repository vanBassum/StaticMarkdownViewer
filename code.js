
$(document).ready(function () {
    const fileList = $("#file-list");
    const cardContainer = $("#fileContent");

    // Fetch markdown files
    fetchMarkdownFiles();

    // Fetch markdown files
    function fetchMarkdownFiles() {
        jsonFiles.forEach(function (file) {
            const fileNameWithoutExtension = file.replace(/\.md$/, "");
            const listItem = $("<a></a>").addClass("list-group-item list-group-item-action").attr("href", "?doc=" + fileNameWithoutExtension).text(fileNameWithoutExtension);
            fileList.append(listItem);
        });
    }

    // Fetch content of a markdown file
    function fetchMarkdownContent(filePath) {
        console.log("Fetch " + filePath);
        $.get(filePath, function (data) {
            // Replace Obsidian-style internal links with anchor tags
            const markdownWithLinks = replaceObsidianLinks(data);

            // Render markdown content
            const markdownHTML = marked.parse(markdownWithLinks);

            // Sanitize HTML content using DOMPurify
            const sanitizedHTML = DOMPurify.sanitize(markdownHTML);

            // Display sanitized markdown content in card container
            cardContainer.html(sanitizedHTML);

            // Initialize Mermaid diagrams after rendering the sanitized markdown content
            Prism.highlightAll();

            // Render Mermaid diagrams
            renderMermaidDiagrams();

        })
        .fail(function (error) {
            console.error("Error fetching markdown content:", error);
        });
    }

    // Function to replace Obsidian-style internal links with anchor tags
    function replaceObsidianLinks(data) {
        return data.replace(/\[\[(.*?)\]\]/g, function (match, noteTitle) {
            // Assuming your Obsidian notes have a specific path or URL
            return '<a href="?doc=' + noteTitle + '">' + noteTitle + '</a>';
        });
    }

    // Function to render Mermaid diagrams
    function renderMermaidDiagrams() {
         mermaid.run({
            querySelector: 'code.language-mermaid',
          });
    }

    // Function to load document based on URL parameter
    function loadDocumentFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const docName = urlParams.get('doc');
        if (docName) {
            const filePath = "docs/" + docName + ".md"; // Construct file path
            fetchMarkdownContent(filePath);
        }
    }

    // Load document from URL if parameter is present
    loadDocumentFromUrl();
});
