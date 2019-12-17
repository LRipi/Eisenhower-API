import cluster = require("cluster");
import * as os from "os";
import {CpuInfo} from "os";

const CPUS: CpuInfo[] = os.cpus();
if (cluster.isMaster) {
    CPUS.forEach(function() {
        cluster.fork()
    });
    cluster.on("listening", function(worker: cluster.Worker) {
        console.log("Cluster %d connected", worker.process.pid);
    });
    cluster.on("disconnect", function(worker: cluster.Worker) {
        console.log("Cluster %d disconnected", worker.process.pid);
    });
    cluster.on("exit", function(worker: cluster.Worker) {
        console.log("Cluster %d is dead", worker.process.pid);
        cluster.fork();
    });
} else {
    require("./www");
}
