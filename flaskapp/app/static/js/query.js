$("#querySubmit")[0].onclick = () => {
    var formdata = JSON.stringify({'query': $("#query").val()});

    $.ajax({
        type: "POST",
        url: "/api/query",
        data: formdata,
        dataType: "text",
        contentType: "application/json",
        success: (data, status, xhr) => {
            // definitely not copied off stackoverflow
            //Convert the Byte Data to BLOB object.
            var blob = new Blob([data], { type: "application/octetstream" });
 
            //Check the Browser type and download the File.
            var isIE = false || !!document.documentMode;
            if (isIE) {
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                var url = window.URL || window.webkitURL;
                link = url.createObjectURL(blob);
                var a = $("<a />");
                a.attr("download", "export.csv");
                a.attr("href", link);
                $("body").append(a);
                a[0].click();
                $("body").remove(a);
            }
        },
        error: (res, status, err) => {
            alert("Error: " + res.responseText);
        }
    })
}

window.onload = () => {
    let params = (new URL(window.location.href)).searchParams;
    query = params.get('query');
    $("#query").text(query); 
}