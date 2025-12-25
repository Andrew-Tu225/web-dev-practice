function dragElement(terrariumElement){

    let prevX = 0; //change of x position from last move
        prevY = 0; //change of y position from last move
        currX = 0;
        currY = 0;

    terrariumElement.onpointerdown = pointerDrag;

    function pointerDrag(e) {
        e.preventDefault();

        currX = e.clientX;
        currY = e.clientY;

        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e){
        prevX = currX - e.clientX;
        prevY = currY - e.clientY;

        currX = e.clientX;
        currY = e.clientY;

        terrariumElement.style.top = (terrariumElement.offsetTop - prevY) + "px";
        terrariumElement.style.left = (terrariumElement.offsetLeft - prevX) + "px";
    }

    function stopElementDrag() {
        // Remove the document-level event listeners
        document.onpointerup = null;
        document.onpointermove = null;
    }
}



// Enable drag functionality for all 14 plants
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));