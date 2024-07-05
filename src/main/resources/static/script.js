var stompClient = null;

function sendMessage() {
    let jsonOb = {
        name: localStorage.getItem("name"),
        content: $("#message-value").val()
    };

    console.log("Sending message:", jsonOb);
    stompClient.send("/app/message", {}, JSON.stringify(jsonOb));
}

function connect() {
    let socket = new SockJS("/server1");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Connected: " + frame);
        $("#name-form").addClass('d-none');
        $("#chat-room").removeClass('d-none');

        // Subscribe
        stompClient.subscribe("/topic/return-to", function (response) {
            console.log("Message received:", response.body);
            showMessage(JSON.parse(response.body));
        });
    }, function (error) {
        console.log("Connection error: " + error);
    });
}

function showMessage(message) {
    console.log("Displaying message:", message);
    $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`);
}

$(document).ready(e => {
    $("#login").click(() => {
        let name = $("#name-value").val();
        localStorage.setItem("name", name);
        console.log("Connecting as:", name);
        connect();
    });

    $("#send-btn").click(() => {
        sendMessage();
    });

    $("#logout").click(() => {
        if (stompClient !== null) {
            stompClient.disconnect();
            console.log("Disconnected");
        }
        localStorage.removeItem("name");
        $("#chat-room").addClass('d-none');
        $("#name-form").removeClass('d-none');
    });
});
