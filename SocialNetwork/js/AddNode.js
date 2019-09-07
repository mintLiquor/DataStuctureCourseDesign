function AddNode(){
    var person = {};
    person.name = document.getElementById("input1").value;
    person.location = document.getElementById("input2").value;
    person.school1 = document.getElementById("input3").value;
    person.school2 = document.getElementById("input4").value;
    person.school3 = document.getElementById("input5").value;
    person.workplace = document.getElementById("input6").value;
    document.getElementById("input1").value = '';
    document.getElementById("input2").value = '';
    document.getElementById("input3").value = '';
    document.getElementById("input4").value = '';
    document.getElementById("input5").value = '';
    document.getElementById("input6").value = '';
    nodes.push(person);
}