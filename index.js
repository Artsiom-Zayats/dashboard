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
let currentEmployees = [];
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

        clone.querySelector('tr').setAttribute('data-id', project.id);

        table.appendChild(clone);
    }

}

//заполнение таблицы сотрудников

function renderEmployeesTable(employees){
    const table = document.querySelector('.employees-tbody');
    const tempalte = document.getElementById('employee-row-template');
    table.innerHTML = '';

    for(const employee of employees){
        const clone = tempalte.content.cloneNode(true);

        clone.querySelector('.employee-name').textContent = employee.name;
        clone.querySelector('.employee-surname').textContent = employee.surname;
        clone.querySelector('.employee-age').textContent = ageEmployee(employee.dateOfBirth);
        clone.querySelector('.employee-position').textContent = employee.position;
        clone.querySelector('.employee-salary').textContent = employee.salary;
        clone.querySelector('.employee-estimated-payment').textContent = '0';
        clone.querySelector('.projected-income').textContent = '0';

         clone.querySelector('tr').setAttribute('data-id', employee.id);

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
    saveCurrentPeriodData(currentProjects, currentEmployees);
    renderProjectsTable(currentProjects);

    document.querySelector('.add-project-side').classList.add('hidden-side');
    document.getElementById('project-name').value = '';
    document.getElementById('company-name').value = '';
    document.getElementById('budget').value = '';
    document.getElementById('employee-capacity').value = '';
    })
    
};


//добавление сотрудника из формы

function addEmployeeFromForm(){
    const addButton = document.getElementById('add-button-employee');

    addButton.addEventListener('click', (e)=>{
        e.preventDefault();

        const name = document.getElementById('employee-name').value.trim();
        const surname = document.getElementById('employee-surname').value.trim();
        const dateOfBirth = document.getElementById('employee-date-birth').value;
        const position = document.getElementById('employee-position').value;
        const salary = parseFloat(document.getElementById('employee-salary').value);

        showEmployeeErrors({});
        const errors = validateEmployeeForm(name, surname, dateOfBirth, position, salary);
        if (Object.keys(errors).length > 0) {
            showEmployeeErrors(errors);
            return; 
        }


        const newEmployee = {
            id: Date.now(),
            name: name,
            surname: surname,
            dateOfBirth: dateOfBirth,
            position: position,
            salary: salary,
            projects: [] 
        }

        currentEmployees.push(newEmployee);
        saveCurrentPeriodData(currentProjects, currentEmployees);
        renderEmployeesTable(currentEmployees);

        document.querySelector('.add-employee-side').classList.add('hidden-side');
        document.getElementById('employee-name').value = '';
        document.getElementById('employee-surname').value = '';
        document.getElementById('employee-date-birth').value = '';
        document.getElementById('employee-position').value = '';
        document.getElementById('employee-salary').value = '';
    })
}



    
function saveCurrentPeriodData(projects, employees) {
    const periodKey = getCurrentPeriodKey();
    const rawData = localStorage.getItem('monthlyData');
    const allData = JSON.parse(rawData);
    if (!allData[periodKey]) {
        allData[periodKey] = { projects: [], employees: [] };
    }
    allData[periodKey].projects = projects;
    allData[periodKey].employees = employees;
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

function validateEmployeeForm(name, surname, dateOfBirth, position, salary){
    let errors = {};

    if (!name || name.length < 3) {
        errors.name = 'Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        errors.name = 'Only letters and spaces allowed.';
    }

    if (!surname || surname.length < 2) {
        errors.surname = 'Surname must be at least 3 characters and contain only letters.';
    } else if (!/^[a-zA-Z\s]+$/.test(surname)) {
        errors.surname = 'Only letters, numbers and spaces allowed.';
    } 

    if (!dateOfBirth){
        errors.dateOfBirth = 'Date of birth is required.';
    } else if (ageEmployee(dateOfBirth) === '-' || isNaN(ageEmployee(dateOfBirth))){
        errors.dateOfBirth = 'Invalid date.';
    } else if (ageEmployee(dateOfBirth)<18){
        errors.dateOfBirth = 'Employee must be at least 18 years old.';
    }

    if (!position){
        errors.position = 'Please select a position.';
    }

    if (salary === '' || isNaN(salary) || salary <= 0){
        errors.salary = 'Salary must be a positive number.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(salary)){
        errors.salary = 'Salary can have up to 2 decimal places.';
    }

    return errors;
}

function showErrors(errors) {
    document.getElementById('project-name-error').textContent = errors.projectName || '';
    document.getElementById('company-name-error').textContent = errors.companyName || '';
    document.getElementById('project-budget-error').textContent = errors.budget || '';
    document.getElementById('employee-capacity-error').textContent = errors.capacity || '';
}

function showEmployeeErrors(errors){
    document.getElementById('employee-name-error').textContent = errors.name || '';
    document.getElementById('employee-surname-error').textContent = errors.surname || '';
    document.getElementById('employee-dob-error').textContent = errors.dateOfBirth || '';
    document.getElementById('employee-position-error').textContent = errors.position || '';
    document.getElementById('employee-salary-error').textContent = errors.salary || '';
}

function changePeriod() {
    const year = document.getElementById('year-select');
    const month = document.getElementById('month-select');

    function updateData() {
        const periodKey = getCurrentPeriodKey();
        const periodData = loadDataForPeriod(periodKey);
        currentProjects = periodData.projects;
        currentEmployees = periodData.employees;
        renderProjectsTable(currentProjects);
        renderEmployeesTable(currentEmployees);
    }

    year.addEventListener('change', updateData);
    month.addEventListener('change', updateData);
}


function deleteProject(){
    const tBody = document.querySelector('.projects-tbody');
    
    tBody.addEventListener('click', (e) =>{
        const deleteButton = e.target.closest('.delete-project');
        if (!deleteButton){
             return; 
        }
        const row = deleteButton.closest('tr');
        const projectId = row.getAttribute('data-id');
        
        //удалим и изменим исходный массив обьектов
        const index = currentProjects.findIndex(project => project.id == projectId);
        if(index !== -1){
            currentProjects.splice(index,1);
        }
        saveCurrentPeriodData(currentProjects, currentEmployees);
        renderProjectsTable(currentProjects);
   
    })
}


function deleteEmployee(){
    const tBody = document.querySelector('.employees-tbody');

    tBody.addEventListener('click', (e) =>{
        const deleteButton = e.target.closest('.delete-employee');
        if(!deleteButton){
            return;
        }
        const row = deleteButton.closest('tr');
        const employeeId = row.getAttribute('data-id');

        const index = currentEmployees.findIndex(employee => employee.id == employeeId);
        if(index !== -1){
            currentEmployees.splice(index,1);
        }
        saveCurrentPeriodData(currentProjects, currentEmployees);
        renderEmployeesTable(currentEmployees);
    })
}

function ageEmployee(birthDate){
    if(birthDate === ''){
        return '-';
    }
    
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const month = now.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    return age;

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
  currentEmployees = periodData.employees;
  renderEmployeesTable(currentEmployees);

  renderProjectsTable(currentProjects);
    addProjectFromForm();
    addEmployeeFromForm();
    changePeriod() ;
    deleteProject();
     deleteEmployee();
   
});
