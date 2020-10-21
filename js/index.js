(function () {
  // var testTool = window.testTool;
  // if (testTool.isMobileDevice()) {
  //   vConsole = new VConsole();
  // }
  // console.log("checkSystemRequirements");
  // console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();

  const API_KEY = "qGDr8lXeTeKsnMF_1hWlTQ";

  const params = new URLSearchParams(window.location.search);
  let mn = params.get("mn");
  let pw = params.get("pw");
  let name = params.get("name");

  if (name !== null) {
    $("#display_name").val(name);
  }

  document.getElementById("join_meeting").addEventListener("click", (e) => {
    e.preventDefault();

    let apiKey = API_KEY;
    let sign = "";
    // let role = document.getElementById("meeting_role").value;
    let role = 0;

    let userName = document.getElementById("display_name").value;

    if (userName !== "") {
      document.getElementById("join_meeting").style.display = "none";
      document.getElementById("loader").style.display = "block";
    }

    // replace with App url
    fetch("https://sas.salonvirtuel.space/api/zoom/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
      body: JSON.stringify({
        meeting_number: mn,
        role: role,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // GOT SIGNATURE
        sign = data;

        // INIT and Join Meeting
        ZoomMtg.init({
          leaveUrl: "./",
          isSupportAV: true,
          success: function () {
            $.i18n.reload("fr-FR");

            ZoomMtg.join({
              signature: sign,
              meetingNumber: mn,
              userName: userName,
              apiKey: apiKey,
              userEmail: "Admin@SAS.com",
              passWord: pw,
              success: (success) => {
                document.getElementById("connexion").style.display = "none";
                document.getElementById("nav-tool").style.background = "none";
                $("#nav-tool").css("background", "none !important");
                $("#nav-tool").css("height", "0");
                //
                setTimeout(function () {
                  $("#join-pc-audio-btn").html(
                    "Activer l'audio du Périphérique"
                  );
                }, 500);
              },
              error: (error) => {
                console.log(error);

                setTimeout(function () {
                  if (error) {
                    $(".zm-modal-footer").css("display", "none");
                  }

                  $(".ReactModal__Overlay").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (name == null) {
                      location.replace(window.location + "&name=" + userName);
                    } else {
                      location.reload();
                    }
                  });
                }, 300);
              },
            });
          },
        });
      });
  });
})();
