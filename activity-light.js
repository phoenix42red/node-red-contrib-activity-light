module.exports = function(RED) {
    function ActivityLightNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Timer from Node-Config (seconds)
        var timeoutSec = Number(config.timeoutSec) || 5;

        var timer = null;

        function updateStatus(isActive) {
            let now = new Date();
            let monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                              "Jul","Aug","Sep","Oct","Nov","Dec"];
            let month = monthNames[now.getMonth()];
            let day = now.getDate();
            let hours = now.getHours().toString().padStart(2,'0');
            let minutes = now.getMinutes().toString().padStart(2,'0');
            let timeStr = `${month} ${day}, ${hours}:${minutes}`;

            if(isActive){
                node.status({fill:"green", shape:"dot", text: timeStr});
            } else {
                node.status({fill:"red", shape:"ring", text: timeStr});
            }

            // show in msg too
            node.msgStatus = timeStr;
        }

        node.on('input', function(msg) {
            updateStatus(true);
            msg.status = node.msgStatus;
            node.send(msg);

            if(timer) clearTimeout(timer);
            timer = setTimeout(function() {
                updateStatus(false);
            }, timeoutSec*1000);
        });

        node.on('close', function() {
            if(timer) clearTimeout(timer);
        });
    }

    RED.nodes.registerType("activity-light", ActivityLightNode);
}
