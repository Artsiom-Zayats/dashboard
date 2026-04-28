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



//Реализация side панели добавления проектов
let currentProjects = [];
//ключ
function getCurrentPeriodKey(){
    const year = document.getElementById('year-select');
    const month = document.getElementById('month-select');
    return year.value+'-'+month.value;
}


//проверяем обекты 
function checkData(){
let monthlyData = localStorage.getItem('monthlyData');
if (!monthlyData) {
   
    const emptyData = {};
    
    localStorage.setItem('monthlyData', JSON.stringify(emptyData));
   
} 
}


//Проверяем есть ли данные за определенный период и загружаем
function loadDataForPeriod(periodKey){
    const rawData = localStorage.getItem('monthlyData');
    const data = JSON.parse(rawData);
    if(!data[periodKey]){
        data[periodKey] = { projects: [], employees: [] };
        localStorage.setItem('monthlyData',JSON.stringify(data));
    }
    return data[periodKey];
}

//заполнение таблицы проектами

function renderProjectsTable(projects){
    const table = document.querySelector('.projects-tbody');
    const template = document.getElementById('project-row-template');
    table.innerHTML = '';
    for(const project of projects){
        const clone = template.content.cloneNode(true);
        clone.querySelector('.company-name').textContent = project.company;
        clone.querySelector('.project-name').textContent = project.name;
        clone.querySelector('.budget').textContent = project.budget;
        clone.querySelector('.employee-capacity').textContent = project.employeeCapacity;
        clone.querySelector('.estimated-income').textContent = '0';
        table.appendChild(clone);
    }

}


//добавление проекат из формы
function addProjectFromForm(){
    const addButton = document.getElementById('add-button-project');
    addButton.addEventListener('click', (e)=>{
          e.preventDefault();

           

    

    
        const name = document.getElementById('project-name').value.trim();
        const company = document.getElementById('company-name').value.trim();
        const budget = parseFloat(document.getElementById('budget').value);
        const employeeCapacity = parseInt(document.getElementById('employee-capacity').value,10);

        showErrors({});
        const errors = validateProjectForm(name, company, budget, employeeCapacity);
        if (Object.keys(errors).length > 0) {
            showErrors(errors);
            return; 
        }

    const newProject = {
        id: Date.now(),
        name: name,
        company: company,
        budget: budget,
        employeeCapacity: employeeCapacity,
        employees: [] 
    }

    currentProjects.push(newProject);
    saveCurrentPeriodData(currentProjects);
    renderProjectsTable(currentProjects);

    document.querySelector('.add-project-side').classList.add('hidden-side');
    document.getElementById('project-name').value = '';
    document.getElementById('company-name').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('employee-capacity').value = '';
    })
    
};
    
function saveCurrentPeriodData(projects) {
    const periodKey = getCurrentPeriodKey();
    const rawData = localStorage.getItem('monthlyData');
    const allData = JSON.parse(rawData);
    if (!allData[periodKey]) {
        allData[periodKey] = { projects: [], employees: [] };
    }
    allData[periodKey].projects = projects;
    localStorage.setItem('monthlyData', JSON.stringify(allData));
}

function validateProjectForm(name, company, budget, capacity) {
    let errors = {};

    if (!name || name.length < 3) {
        errors.projectName = 'Project name must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
        errors.projectName = 'Only letters, numbers and spaces allowed.';
    }

    if (!company || company.length < 2) {
        errors.companyName = 'Company name must be at least 2 characters.';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(company)) {
        errors.companyName = 'Only letters, numbers and spaces allowed.';
    }

    if (isNaN(budget) || budget <= 0) {
        errors.budget = 'Budget must be a positive number.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(budget.toString())) {
        
        errors.budget = 'Budget can have up to 2 decimal places.';
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
        errors.capacity = 'Employee capacity must be an integer >= 1.';
    }

    return errors;
}

function showErrors(errors) {
    document.getElementById('project-name-error').textContent = errors.projectName || '';
    document.getElementById('company-name-error').textContent = errors.companyName || '';
    document.getElementById('project-budget-error').textContent = errors.budget || '';
    document.getElementById('employee-capacity-error').textContent = errors.capacity || '';
}

function changePeriod() {
    const year = document.getElementById('year-select');
    const month = document.getElementById('month-select');

    function updateData() {
        const periodKey = getCurrentPeriodKey();
        const periodData = loadDataForPeriod(periodKey);
        currentProjects = periodData.projects;
        renderProjectsTable(currentProjects);
        
    }

    year.addEventListener('change', updateData);
    month.addEventListener('change', updateData);
}



document.addEventListener('DOMContentLoaded', function() {
  burgerMenu();
  selectPage();
  openSidePanel();
  closeSidePanel();
  openSeedDataPopUp();
  closeSeedDataPopUp();
  checkData();  
  const periodData = loadDataForPeriod(getCurrentPeriodKey());
  currentProjects = periodData.projects;
 
  renderProjectsTable(currentProjects);
    addProjectFromForm();
    changePeriod() ;

});
