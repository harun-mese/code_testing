
const container = document.querySelector(".stylingBox");
const icon = document.getElementById("stylingHandler");

    document.addEventListener("DOMContentLoaded", function() {
        let isDragging = false;
        let offsetX, offsetY;
    
        icon.addEventListener("mousedown", function(e) {
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;

        });
    
        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                const containerRect = container.getBoundingClientRect();
            
                const newLeft = e.clientX  - 150;
                const newTop = e.clientY - 10 ;
             
                
                    container.style.left = newLeft + "px";
                    container.style.top = newTop + "px";
                
            }
        });
    
        document.addEventListener("mouseup", function() {
            isDragging = false;
        });
    });
    

    const closeStylingBox = document.getElementById('closeStylingBox')
    closeStylingBox.addEventListener('click',()=>{
        container.style.display = 'none'
    })