let teachers = [];
let subjects = [];
const classTimes = [
    "07:00 - 07:50",
    "07:50 - 08:40",
    "08:40 - 09:30",
    "09:50 - 10:40",
    "10:40 - 11:30"
];
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const grades = ["6º ano", "7º ano", "8º ano", "9º ano"];

function addTeacher() {
    const name = document.getElementById('teacherName').value;
    if (!name) {
        showError("Por favor, insira o nome do professor.");
        return;
    }

    const teacherSubjects = Array.from(document.querySelectorAll('input[name="teacherSubject"]:checked'))
        .map(input => input.value);

    if (teacherSubjects.length === 0) {
        showError("Por favor, selecione pelo menos uma disciplina.");
        return;
    }

    teachers.push({
        name,
        subjects: teacherSubjects
    });

    document.getElementById('teacherName').value = '';
    updateTeacherList();
    showError("");
}

function addSubject() {
    const name = document.getElementById('subjectName').value;
    const weeklyClasses = parseInt(document.getElementById('weeklyClasses').value);
    const restrictions = getRestrictions();

    if (!name || !weeklyClasses) {
        showError("Por favor, preencha todos os campos.");
        return;
    }

    subjects.push({
        name,
        weeklyClasses,
        restrictions
    });

    document.getElementById('subjectName').value = '';
    document.getElementById('weeklyClasses').value = '';
    document.getElementById('restrictions').innerHTML = '';
    updateSubjectsList();
    updateTeacherSubjectsSelect();
    showError("");
}

function addRestriction() {
    const restrictionsDiv = document.getElementById('restrictions');
    const restrictionDiv = document.createElement('div');
    restrictionDiv.className = 'restriction';
    
    restrictionDiv.innerHTML = `
        <select class="day">
            ${weekDays.map(day => `<option value="${day}">${day}</option>`).join('')}
        </select>
        <input type="time" class="start-time">
        <input type="time" class="end-time">
        <button onclick="this.parentElement.remove()">Remover</button>
    `;
    
    restrictionsDiv.appendChild(restrictionDiv);
}

function getRestrictions() {
    return Array.from(document.querySelectorAll('.restriction')).map(r => ({
        day: r.querySelector('.day').value,
        startTime: r.querySelector('.start-time').value,
        endTime: r.querySelector('.end-time').value
    }));
}

function generateSchedule() {
    if (subjects.length === 0 || teachers.length === 0) {
        showError("Por favor, adicione pelo menos uma disciplina e um professor.");
        return;
    }

    const schedules = {};
    grades.forEach(grade => {
        schedules[grade] = generateGradeSchedule(grade);
    });

    displaySchedules(schedules);
    showError("");
}

function generateGradeSchedule(grade) {
    const schedule = Array(weekDays.length).fill().map(() => 
        Array(classTimes.length).fill(null)
    );

    subjects.forEach(subject => {
        let classesLeft = subject.weeklyClasses;
        while (classesLeft > 0) {
            const dayIndex = Math.floor(Math.random() * weekDays.length);
            const timeIndex = Math.floor(Math.random() * classTimes.length);

            if (!schedule[dayIndex][timeIndex] && !hasRestriction(subject, dayIndex, timeIndex)) {
                schedule[dayIndex][timeIndex] = subject.name;
                classesLeft--;
            }
        }
    });

    return schedule;
}

function hasRestriction(subject, dayIndex, timeIndex) {
    return subject.restrictions.some(r => 
        r.day === weekDays[dayIndex] &&
        classTimes[timeIndex].split(' - ')[0] >= r.startTime &&
        classTimes[timeIndex].split(' - ')[1] <= r.endTime
    );
}

function displaySchedules(schedules) {
    const container = document.getElementById('schedules');
    container.innerHTML = '';

    Object.entries(schedules).forEach(([grade, schedule]) => {
        const table = document.createElement('table');
        table.className = 'schedule-table';
        
        let header = '<tr><th>Horário</th>';
        weekDays.forEach(day => {
            header += `<th>${day}</th>`;
        });
        header += '</tr>';
        
        let body = '';
        classTimes.forEach((time, timeIndex) => {
            body += `<tr><td>${time}</td>`;
            weekDays.forEach((_, dayIndex) => {
                const subject = schedule[dayIndex][timeIndex];
                body += `<td>${subject || '-'}</td>`;
            });
            body += '</tr>';
        });

        table.innerHTML = `
            <caption><h3>${grade}</h3></caption>
            ${header}
            ${body}
        `;
        
        container.appendChild(table);
    });
}

function showError(message) {
    document.getElementById('error').textContent = message;
}

function updateTeacherList() {
    // Placeholder para atualização da lista de professores
}

function updateSubjectsList() {
    // Placeholder para atualização da lista de disciplinas
}

function updateTeacherSubjectsSelect() {
    const container = document.getElementById('teacherSubjects');
    container.innerHTML = subjects.map(subject => `
        <div>
            <input type="checkbox" name="teacherSubject" value="${subject.name}" id="subject_${subject.name}">
            <label for="subject_${subject.name}">${subject.name}</label>
        </div>
    `).join('');
}
