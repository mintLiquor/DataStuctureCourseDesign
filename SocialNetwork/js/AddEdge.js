function AddEdge(){
    for (var i = 0; i < nodes.length - 1; i++) {

        var flag = false;
        var edge = {
            "source": nodes.length - 1, // edge start
            "target": i,                // edge end
            "relation": "",             // edges relationship
            "value": 3                  // edge value for the distance between two nodes
        };

        console.log(edge);

        if (nodes[i].location === nodes[nodes.length - 1].location) {
            flag = true;
            edge.relation = edge.relation + "同城";
            edge.value = edge.value - 0.5;
        }

        if(nodes[i].school1 === nodes[nodes.length - 1].school1){
            flag = true;
            if(edge.relation === "")
                edge.relation = edge.relation + "小学同学";
            // else
            //     edge.relation = edge.relation +" & 同学";

            edge.value = edge.value-0.5;
        }

        if(nodes[i].school2 === nodes[nodes.length - 1].school2){
            flag = true;
            if(edge.relation === "")
                edge.relation = edge.relation + "中学同学";
            else
                edge.relation = edge.relation +" & 中学同学";

            edge.value = edge.value-0.5;
        }

        if(nodes[i].school3 === nodes[nodes.length - 1].school3){
            flag = true;
            if(edge.relation === "")
                edge.relation = edge.relation + "大学同学";
            else
                edge.relation = edge.relation +" & 大学同学";

            edge.value = edge.value-0.5;
        }


        if (nodes[i].workplace === nodes[nodes.length - 1].workplace) {
            flag = true;
            if (edge.relation === "")
                edge.relation = edge.relation + "同事";
            else
                edge.relation = edge.relation + " & 同事";
            edge.value = edge.value - 0.5;
        }
        if (flag)
            edges.push(edge);
    }
}