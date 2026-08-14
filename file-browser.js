const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4000;

// Main project folder
const ROOT = __dirname;

// Public folder containing HTML and CSS
const PUBLIC = path.join(ROOT, "public");


// ==================================================
// FUNCTION: Serve HTML / CSS files
// ==================================================

function servePublicFile(filePath, contentType, res) {

    fs.readFile(filePath, (error, data) => {

        if (error) {

            res.writeHead(404, {
                "Content-Type": "text/plain"
            });

            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
}


// ==================================================
// FUNCTION: Create Lab Page
// ==================================================

function createLabPage(labName, files) {

    let fileCards = "";

    files.forEach(file => {

        let icon = "📄";

        // JavaScript file
        if (file.endsWith(".js")) {
            icon = "🟨";
        }

        // JSON file
        else if (file.endsWith(".json")) {
            icon = "⚙️";
        }

        // Markdown file
        else if (file.endsWith(".md")) {
            icon = "📝";
        }

        // Image files
        else if (
            file.endsWith(".png") ||
            file.endsWith(".jpg") ||
            file.endsWith(".jpeg")
        ) {
            icon = "🖼️";
        }


        fileCards += `

            <div
                class="file-card"
                onclick="openFile(
                    '${encodeURIComponent(labName)}',
                    '${encodeURIComponent(file)}'
                )"
            >

                <div class="file-icon">
                    ${icon}
                </div>

                <div class="file-info">

                    <h3>${file}</h3>

                    <p>Click to open file</p>

                </div>

            </div>

        `;
    });


    // ==================================================
    // LAB PAGE HTML
    // ==================================================

    return `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>${labName} - NodeJS Lab</title>

    <link rel="stylesheet" href="/style.css">


    <style>

        /* Lab page */

        .lab-page {

            width: 84%;

            max-width: 1100px;

            margin: auto;

            padding: 45px 0;
        }


        /* Back button */

        .back-button {

            display: inline-block;

            margin-bottom: 25px;

            color: #6366f1;

            text-decoration: none;

            font-weight: bold;
        }


        /* Lab heading */

        .lab-header {

            margin-bottom: 30px;
        }


        .lab-header h1 {

            font-size: 38px;

            margin-bottom: 8px;
        }


        .lab-header p {

            color: #6b7280;
        }


        /* Search */

        .search-box {

            position: relative;

            margin-bottom: 30px;
        }


        .search-box input {

            width: 100%;

            padding: 17px 20px 17px 50px;

            border: 1px solid #e5e7eb;

            border-radius: 14px;

            font-size: 16px;

            outline: none;

            background: white;
        }


        .search-box input:focus {

            border-color: #6366f1;

            box-shadow:
                0 0 0 4px
                rgba(99,102,241,0.1);
        }


        .search-icon {

            position: absolute;

            left: 18px;

            top: 15px;

            font-size: 20px;
        }


        /* File grid */

        .file-grid {

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            gap: 20px;
        }


        /* File card */

        .file-card {

            background: white;

            border: 1px solid #e5e7eb;

            border-radius: 18px;

            padding: 22px;

            display: flex;

            align-items: center;

            gap: 15px;

            transition: 0.25s;

            box-shadow:
                0 5px 18px
                rgba(0,0,0,0.04);

            cursor: pointer;
        }


        .file-card:hover {

            transform: translateY(-5px);

            border-color: #a5b4fc;

            box-shadow:
                0 12px 25px
                rgba(99,102,241,0.12);
        }


        /* File icon */

        .file-icon {

            width: 52px;

            height: 52px;

            background: #eef2ff;

            border-radius: 13px;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 25px;

            flex-shrink: 0;
        }


        /* File information */

        .file-info {

            min-width: 0;
        }


        .file-info h3 {

            font-size: 15px;

            word-break: break-word;
        }


        .file-info p {

            color: #9ca3af;

            font-size: 12px;

            margin-top: 5px;
        }


        /* Responsive */

        @media(max-width: 800px) {

            .file-grid {

                grid-template-columns: 1fr 1fr;
            }

        }


        @media(max-width: 550px) {

            .file-grid {

                grid-template-columns: 1fr;
            }

        }

    </style>

</head>


<body>


    <!-- HEADER -->

    <header class="header">

        <div class="logo">

            <div class="logo-icon">
                JS
            </div>

            <div>

                <h2>NodeJS Lab Explorer</h2>

                <p>Student Lab Management</p>

            </div>

        </div>

    </header>



    <!-- MAIN -->

    <main class="lab-page">


        <!-- BACK BUTTON -->

        <a
            href="/"
            class="back-button"
        >
            ← Back to Labs
        </a>



        <!-- LAB TITLE -->

        <div class="lab-header">

            <p class="small-title">
                LAB ASSIGNMENT
            </p>

            <h1>
                📁 ${labName}
            </h1>

            <p>
                Explore files and assignments
                inside this laboratory.
            </p>

        </div>



        <!-- SEARCH BAR -->

        <div class="search-box">

            <span class="search-icon">
                🔍
            </span>

            <input
                type="text"
                id="search"
                placeholder="Search files..."
                onkeyup="searchFiles()"
            >

        </div>



        <!-- FILE CARDS -->

        <div
            class="file-grid"
            id="fileGrid"
        >

            ${fileCards}

        </div>


    </main>



    <!-- FOOTER -->

    <footer>

        NodeJS Lab Explorer • BCA Lab Work

    </footer>



    <!-- JAVASCRIPT -->

    <script>

        // =========================================
        // SEARCH FILES
        // =========================================

        function searchFiles() {

            const searchText =
                document
                .getElementById("search")
                .value
                .toLowerCase();


            const files =
                document
                .querySelectorAll(".file-card");


            files.forEach(function(file) {

                const name =
                    file
                    .innerText
                    .toLowerCase();


                if (name.includes(searchText)) {

                    file.style.display = "flex";

                }

                else {

                    file.style.display = "none";

                }

            });

        }



        // =========================================
        // OPEN FILE
        // =========================================

        function openFile(labName, fileName) {

            window.location.href =
                "/file/" +
                labName +
                "/" +
                fileName;

        }

    </script>


</body>

</html>

`;
}


// ==================================================
// SERVER
// ==================================================

const server = http.createServer((req, res) => {

    const url =
        new URL(
            req.url,
            `http://localhost:${PORT}`
        );


    // ==================================================
    // CSS FILE
    // ==================================================

    if (url.pathname === "/style.css") {

        servePublicFile(
            path.join(PUBLIC, "style.css"),
            "text/css",
            res
        );

        return;
    }



    // ==================================================
    // HOME PAGE
    // ==================================================

    if (url.pathname === "/") {

        servePublicFile(
            path.join(PUBLIC, "index.html"),
            "text/html",
            res
        );

        return;
    }



    // ==================================================
    // LAB PAGE
    // ==================================================

    if (url.pathname.startsWith("/lab/")) {

        const labName =
            decodeURIComponent(
                url.pathname
                .replace("/lab/", "")
            );


        const labPath =
            path.join(
                ROOT,
                labName
            );


        // Check folder exists

        if (
            !labPath.startsWith(ROOT) ||
            !fs.existsSync(labPath)
        ) {

            res.writeHead(404);

            res.end("Lab not found");

            return;
        }


        try {

            const entries =
                fs.readdirSync(
                    labPath,
                    {
                        withFileTypes: true
                    }
                );


            const files =
                entries
                .filter(entry => entry.isFile())
                .map(entry => entry.name);


            res.writeHead(200, {

                "Content-Type":
                    "text/html"

            });


            res.end(
                createLabPage(
                    labName,
                    files
                )
            );


        }

        catch (error) {

            res.writeHead(500);

            res.end(
                "Unable to open lab"
            );

        }

        return;
    }



    // ==================================================
    // OPEN FILE
    // ==================================================

    if (url.pathname.startsWith("/file/")) {

        const parts =
            url.pathname
            .replace("/file/", "")
            .split("/");


        const labName =
            decodeURIComponent(parts[0]);


        const fileName =
            decodeURIComponent(
                parts.slice(1).join("/")
            );


        const filePath =
            path.join(
                ROOT,
                labName,
                fileName
            );


        // Security check

        if (
            !filePath.startsWith(ROOT) ||
            !fs.existsSync(filePath)
        ) {

            res.writeHead(404);

            res.end(
                "File not found"
            );

            return;
        }


        const extension =
            path.extname(
                fileName
            ).toLowerCase();



        // ==================================================
        // IMAGE FILE
        // ==================================================

        if (
            extension === ".png" ||
            extension === ".jpg" ||
            extension === ".jpeg"
        ) {

            fs.readFile(
                filePath,
                (error, data) => {

                    if (error) {

                        res.writeHead(500);

                        res.end(
                            "Unable to open image"
                        );

                        return;
                    }


                    let contentType =
                        "image/png";


                    if (
                        extension === ".jpg" ||
                        extension === ".jpeg"
                    ) {

                        contentType =
                            "image/jpeg";
                    }


                    res.writeHead(200, {

                        "Content-Type":
                            contentType

                    });


                    res.end(data);

                }
            );

            return;
        }



        // ==================================================
        // TEXT / CODE FILES
        // ==================================================

        fs.readFile(
            filePath,
            "utf8",
            (error, data) => {

                if (error) {

                    res.writeHead(500);

                    res.end(
                        "Unable to read file"
                    );

                    return;
                }


                res.writeHead(200, {

                    "Content-Type":
                        "text/plain; charset=utf-8"

                });


                res.end(data);

            }
        );

        return;
    }



    // ==================================================
    // PAGE NOT FOUND
    // ==================================================

    res.writeHead(404);

    res.end(
        "Page not found"
    );

});



// ==================================================
// START SERVER
// ==================================================

server.listen(
    PORT,
    () => {

        console.log(
            `NodeJS Lab Explorer running at http://localhost:${PORT}`
        );

    }
);