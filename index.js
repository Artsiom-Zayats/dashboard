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
let assignEmployeeId = null;
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

        const usedCapacity = getEmployeeCapacity(project);
        clone.querySelector('.employee-capacity').textContent = `${usedCapacity.toFixed(2)} / ${project.employeeCapacity}`;
        if(usedCapacity>project.employeeCapacity){
            clone.querySelector('.employee-capacity').classList.add('attention');
        }

        const estimatedIncome = getEstimatedIncome(project);
        clone.querySelector('.estimated-income').textContent = estimatedIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        if(estimatedIncome>=0){
            clone.querySelector('.estimated-income').classList.add('positive-estimated');
        }else{
            clone.querySelector('.estimated-income').classList.add('negative-estimated');
        }
        
        clone.querySelector('tr').setAttribute('data-id', project.id);

        clone.querySelector('.show-employees').textContent = `Show Employees (${project.employees.length})`;

        table.appendChild(clone);
    }

}

function getEstimatedIncome(project){
    const usedCapacity = getEmployeeCapacity(project);
    const capacityForRevenue = Math.max(usedCapacity,project.employeeCapacity);
    if(capacityForRevenue === 0){
        return 0;
    }
    const revenuePerEffectiveCapacity = project.budget/capacityForRevenue;
    const totalRevenue = revenuePerEffectiveCapacity*usedCapacity;
    let totalCost = 0;
    const arrEmployees = project.employees;

    for(const employee of arrEmployees){

        const emp = currentEmployees.find(e=> e.id == employee.employeeId );
       
            if(emp){
                totalCost +=emp.salary*Math.max(0.5, employee.capacity);
            }
    
    }
    return (totalRevenue - totalCost);

}

function getEmployeeCapacity(project){
    let total = 0;
    const arrEmployes = project.employees;

    for(const employee of arrEmployes){
        total = total + employee.capacity*employee.fit;
    }

    return total;
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

        const ep = getEstimatedPayment(employee);
        clone.querySelector('.employee-estimated-payment').textContent = ep.toLocaleString('en-US', { style: 'currency', currency: 'USD' });;


        const pi = getProjectedIncome(employee);
        clone.querySelector('.projected-income').textContent = pi.toLocaleString('en-US', { style: 'currency', currency: 'USD' });;
        if(pi>=0){
            clone.querySelector('.projected-income').classList.add('positive-estimated');
        }else{
            clone.querySelector('.projected-income').classList.add('negative-estimated');
        }

         clone.querySelector('tr').setAttribute('data-id', employee.id);

         table.appendChild(clone);
    }

}

function getEstimatedPayment(employee){
    let total = 0;
    for (const project of currentProjects) {
        for (const assignment of project.employees) {
            if (assignment.employeeId == employee.id) {
                total += employee.salary * Math.max(0.5, assignment.capacity);
            }
        }
    }
    if (total === 0) {
        total = employee.salary * 0.5;
    }
    return total;
}

function getProjectedIncome(employee){
    let totalProfit = 0;
    for(const project of currentProjects){
        const totalUsedCapacity = getEmployeeCapacity(project);
        const capacityForRevenue = Math.max(project.employeeCapacity, totalUsedCapacity);
        const revenuePerEffectiveCapacity = capacityForRevenue > 0 ? project.budget / capacityForRevenue : 0;

        const emp = project.employees.find(e=> e.employeeId == employee.id)
        if(emp){
           const effective = emp.capacity * emp.fit;

          const  revenue = revenuePerEffectiveCapacity * effective;

          const  cost = employee.salary * Math.max(0.5, emp.capacity)

           const profit = revenue - cost;
           totalProfit += profit;
        }
    }
    return totalProfit;
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
        currentProjects.forEach(project => {
            project.employees = project.employees.filter(assignment => 
            assignment.employeeId != employeeId 
            );
        });
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


function assignEmploye(){
    const tBody = document.querySelector('.employees-tbody');
    const popup = document.querySelector('.assign-popup');
    tBody.addEventListener('click', (e) =>{
        const assign = e.target.closest('.assign-employee');
        if(!assign){
            return;
        }
        const row = assign.closest('tr');
        const employeeId = row.getAttribute('data-id');
        const employee = currentEmployees.find(emp => emp.id == employeeId);
        assignEmployeeId = employeeId;
        const select = document.getElementById('assign-project-select');
        select.innerHTML = '';

        currentProjects.forEach(project=>{
            const option = document.createElement('option');
            option.value = project.id;

            option.textContent = project.name;
            select.appendChild(option);
        })

        popup.classList.remove('hidden-pop');
     })
}

function initAssignPopup(){
    const capacitySlider = document.getElementById('assign-capacity');
    const fitSlider = document.getElementById('assign-fit');
    const capacitySpan = document.getElementById('capacity-value');
    const fitSpan = document.getElementById('fit-value');
    const effectiveSpan = document.getElementById('effective-capacity');

    function updateEffective(){
        const cap = parseFloat(capacitySlider.value);
        const fit = parseFloat(fitSlider.value);
        capacitySpan.textContent = cap.toFixed(1);
        fitSpan.textContent = fit.toFixed(1);
        effectiveSpan.textContent = (cap * fit).toFixed(2);
    }

    capacitySlider.addEventListener('input', updateEffective);
    fitSlider.addEventListener('input', updateEffective);
    updateEffective();

    const popup = document.getElementById('assign-popup');
    const saveBtn = document.getElementById('assign-save');
    const cancelBtn = document.getElementById('assign-cancel');
    const projectSelect = document.getElementById('assign-project-select');

    function closePopup(){
        popup.classList.add('hidden-pop');
        assignEmployeeId = null; 
    }

    cancelBtn.addEventListener('click', closePopup);

    saveBtn.addEventListener('click', ()=>{
        if (!assignEmployeeId){
            return;
        }
            

        const projectId = parseInt(projectSelect.value, 10);
        const capacity = parseFloat(capacitySlider.value);
        const fit = parseFloat(fitSlider.value);

        const project = currentProjects.find(p => p.id === projectId);
        if (!project){
          return  
        } ;

        
        const already = project.employees.some(e => e.employeeId === assignEmployeeId);
        if (already){
            alert('Сотрудник уже назначен на этот проект');
            return;
        }

        project.employees.push({
            employeeId: assignEmployeeId,
            capacity: capacity,
            fit: fit
    });

    saveCurrentPeriodData(currentProjects, currentEmployees);
    renderProjectsTable(currentProjects);
    renderEmployeesTable(currentEmployees);

    closePopup();
});
}


function showEmployees(){
    const tBodyProject = document.querySelector('.projects-tbody');

    tBodyProject.addEventListener('click', (e) =>{
        const showEmp = e.target.closest('.show-employees');
        if (!showEmp) return;
        
        const row = showEmp.closest('tr');
        const projectId = row.getAttribute('data-id');
        const project = currentProjects.find(p => p.id === Number(projectId));
        if (!project) return;

        const totalUsedCapacity = getEmployeeCapacity(project);
        const capacityForRevenue = Math.max(project.employeeCapacity, totalUsedCapacity);
        let revenuePerEffectiveCapacity = 0;
        if (capacityForRevenue > 0){
           revenuePerEffectiveCapacity = project.budget / capacityForRevenue; 
        } 
        
        const titleEl = document.getElementById('popup-project-title');
        titleEl.textContent = `Employees in "${project.name}"`;

        const assignments = project.employees;
        const tBodyEmp = document.getElementById('project-employees-list');
        const template = document.getElementById('project-employee-row-template');
        tBodyEmp.innerHTML = '';

        const assignedList = [];
        assignments.forEach(assignment => {
            const employee = currentEmployees.find(emp => emp.id == assignment.employeeId);
            if (employee) assignedList.push({ employee, assignment });
        });
        assignedList.sort((a, b) => a.employee.name.localeCompare(b.employee.name));

        if (assignedList.length === 0) {
           
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="10" style="text-align:center;">No employees assigned to this project</td>`;
            tBodyEmp.appendChild(emptyRow);
        } else {
            assignedList.forEach(({ employee, assignment }) => {
                const clone = template.content.cloneNode(true);
                clone.querySelector('.emp-name').textContent = employee.name;
                clone.querySelector('.emp-surname').textContent = employee.surname;
                clone.querySelector('.emp-capacity').textContent = assignment.capacity.toFixed(2);
                clone.querySelector('.emp-fit').textContent = assignment.fit.toFixed(2);
                
                clone.querySelector('.emp-vacation').textContent = '-';
                const effective = assignment.capacity * assignment.fit;
                clone.querySelector('.emp-effective').textContent = effective.toFixed(3);

                const employeeRevenue = revenuePerEffectiveCapacity * effective;
                const employeeCost = employee.salary * Math.max(0.5, assignment.capacity);
                const employeeProfit = employeeRevenue - employeeCost;

                clone.querySelector('.emp-revenue').textContent = employeeRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                clone.querySelector('.emp-cost').textContent = employeeCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                clone.querySelector('.emp-profit').textContent = employeeProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

                if (employeeProfit >= 0){
             
                clone.querySelector('.emp-profit').classList.add('positive-estimated');

                     
                }else {
               
                clone.querySelector('.emp-profit').classList.add('negative-estimated');
                    
                }
                
                tBodyEmp.appendChild(clone);
            });
        }
        document.getElementById('project-employees-popup').classList.remove('hidden-pop');
    });
}

function initEmployeesPopup() {
    const popup = document.getElementById('project-employees-popup');
    const closeBtn = document.getElementById('close-project-employees');

    function closePopup() {
        popup.classList.add('hidden-pop');
    }
    closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
}


function showAssignment(){
    const tBody = document.querySelector('.employees-tbody');

    tBody.addEventListener('click', (e)=>{
        const show = e.target.closest('.show-assignments');
        if(!show){
            return;
        }

        const row = show.closest('tr');
        const employeeId = row.getAttribute('data-id');
        const employee = currentEmployees.find(e => e.id === Number(employeeId));
        if (!employee) return;

        const popup = document.getElementById('employee-assignments-popup');
        const tBodyPop = document.getElementById('assignments-list');
        const template = document.getElementById('assignment-row-template');
        tBodyPop.innerHTML = '';

        document.getElementById('assignments-popup-title').textContent = `Assignments for ${employee.name} ${employee.surname}`;

        const assignmentsData = [];

        for (const project of currentProjects){
            const assignment = project.employees.find(a => a.employeeId == employee.id);

            if(!assignment){
                continue;
            }

            const totalUsedCapacity = getEmployeeCapacity(project);
            const capacityForRevenue = Math.max(project.employeeCapacity, totalUsedCapacity);
            const revenuePerEffectiveCapacity = capacityForRevenue > 0 ? project.budget / capacityForRevenue : 0;
            const effective = assignment.capacity * assignment.fit;
            const revenue = revenuePerEffectiveCapacity * effective;
            const cost = employee.salary * Math.max(0.5, assignment.capacity);
            const profit = revenue - cost;

            assignmentsData.push({
                project,
                assignment,
                revenue,
                cost,
                profit,
                effective
            })

        }

        assignmentsData.sort((a, b) => a.project.name.localeCompare(b.project.name));

        if (assignmentsData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="9" style="text-align:center;">No assignments found</td>`;
            tBodyPop.appendChild(emptyRow);
        } else {
   


        for(const ass of assignmentsData){
            const clone = template.content.cloneNode(true);
            clone.querySelector('.project-name-link a').textContent = ass.project.name;
            clone.querySelector('.assignment-capacity').textContent = ass.assignment.capacity.toFixed(2);
            clone.querySelector('.assignment-fit').textContent = ass.assignment.fit.toFixed(2);
            clone.querySelector('.assignment-vacation').textContent = '-';
            clone.querySelector('.assignment-effective').textContent = ass.effective.toFixed(3);
            clone.querySelector('.assignment-revenue').textContent = ass.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            clone.querySelector('.assignment-cost').textContent = ass.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            clone.querySelector('.assignment-profit').textContent = ass.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

           if (ass.profit >= 0){
             
                clone.querySelector('.assignment-profit').classList.add('positive-estimated');

                     
                }else {
               
                clone.querySelector('.assignment-profit').classList.add('negative-estimated');
                    
                }
                

            tBodyPop.appendChild(clone);
        }
        }
        popup.classList.remove('hidden-pop');
    })
}

function initAssignmentsPopup() {
    const popup = document.getElementById('employee-assignments-popup');
    const closeBtn = document.getElementById('close-assignments-popup');
    function closePopup() {
        popup.classList.add('hidden-pop');
    }
    closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
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
     assignEmploye();
   initAssignPopup();
    showEmployees();
    initEmployeesPopup();
    showAssignment();
     initAssignmentsPopup();
});
