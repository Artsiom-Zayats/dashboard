function burgerMenu(){
    const buttonClose = document.querySelector('.menu-button');
    const buttonOpen = document.querySelector('.burger-button');
    const burgerMenu = document.querySelector('.burger-menu');

    buttonClose.addEventListener('click',() =>{
        burgerMenu.style.width = '0';
        setTimeout(() => {
            buttonOpen.classList.remove('hidden');
        }, 500);
            
    
  } )

    buttonOpen.addEventListener('click',() =>{
        
        buttonOpen.classList.add('hidden');
          burgerMenu.style.width = '300px';  
    
  } )
}

function selectPage(){
    const selectProject = document.getElementById('projects');
    const selectEmployees = document.getElementById('employees');
    const projectsPage = document.querySelector('.projects-page');
    const projectsEmployees = document.querySelector('.employees-page');
    
    
    selectProject.addEventListener('click',() =>{
        if(projectsPage.classList.contains('hidden')){
            projectsEmployees.classList.add('hidden');
            projectsPage.classList.remove('hidden');
            selectProject.classList.add('list-pages-head-active');
            selectEmployees.classList.remove('list-pages-head-active');
        }
    } )

    selectEmployees.addEventListener('click',() =>{
        if(projectsEmployees.classList.contains('hidden')){
            projectsPage.classList.add('hidden');
            projectsEmployees.classList.remove('hidden');
            selectEmployees.classList.add('list-pages-head-active');
            selectProject.classList.remove('list-pages-head-active');
        }
    } )
}


function openSidePanel(){
    const addProject = document.getElementById('add-project');
    const addEmployee = document.getElementById('add-employee');
    const sideProjet = document.querySelector('.add-project-side');
    const sideEmployee = document.querySelector('.add-employee-side');

    addProject.addEventListener('click', ()=>{
        sideProjet.classList.remove('hidden-side');
    })

    addEmployee.addEventListener('click', ()=>{
        sideEmployee.classList.remove('hidden-side');
    })


}

function closeSidePanel(){
    const sideProjet = document.querySelector('.add-project-side');
    const sideEmployee = document.querySelector('.add-employee-side');
    const closeProject = document.getElementById('cancel-add-project');
    const closeEmployee = document.getElementById('cancel-add-employee');

    closeProject.addEventListener('click', ()=>{
        sideProjet.classList.add('hidden-side');
    })

    closeEmployee.addEventListener('click', ()=>{
        sideEmployee.classList.add('hidden-side');
    })
}


function openSeedDataPopUp(){
    const openSeed = document.getElementById('seed-data');
    const seedContent = document.querySelector('.seed-dada-pop');

    openSeed.addEventListener('click', ()=>{
        seedContent.classList.remove('hidden-pop');
        document.body.classList.add('no-scroll');
    })
}


function closeSeedDataPopUp(){
    const closeButton = document.querySelector('.seed-pop-close');
    const seedContent = document.querySelector('.seed-dada-pop');


    closeButton.addEventListener('click', ()=>{
        seedContent.classList.add('hidden-pop');
    })
    
    seedContent.addEventListener('click',(e)=>{
        if(e.target===seedContent){
                
            seedContent.classList.add('hidden-pop');
        }
    })
    
    document.body.classList.remove('no-scroll');
}


document.addEventListener('DOMContentLoaded', function() {
  burgerMenu();
  selectPage();
  openSidePanel();
  closeSidePanel();
  openSeedDataPopUp();
  closeSeedDataPopUp();
});
