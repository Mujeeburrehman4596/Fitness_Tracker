document.addEventListener('DOMContentLoaded', () => {
    const workoutForm = document.getElementById('workout-form');
    const goalsForm = document.getElementById('goals-form');
    const workoutList = document.getElementById('workout-list');
    const performanceStats = document.getElementById('performance-stats');

    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let goals = JSON.parse(localStorage.getItem('goals')) || { steps: 0, calories: 0 };

    function renderWorkouts() {
        workoutList.innerHTML = '';
        workouts.forEach((workout, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${workout.name} - ${workout.duration} min - ${workout.calories} kcal
                <button class="btn btn-warning btn-sm ml-2 edit-workout" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm ml-2 delete-workout" data-index="${index}">Delete</button>
            `;
            workoutList.appendChild(li);
        });
        renderStats();
    }

    function renderStats() {
        const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
        const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);

        const goalSteps = goals.steps;
        const goalCalories = goals.calories;

        performanceStats.innerHTML = `
            <h4>Performance Stats</h4>
            <p>Total Workout Duration: ${totalDuration} minutes</p>
            <p>Total Calories Burned: ${totalCalories} kcal</p>
            <p>Daily Steps Goal: ${goalSteps}</p>
            <p>Daily Calories Goal: ${goalCalories} kcal</p>
            <p>Status: ${totalCalories >= goalCalories ? 'Goal Achieved' : 'Goal Not Achieved'}</p>
        `;
    }

    function saveData() {
        localStorage.setItem('workouts', JSON.stringify(workouts));
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    workoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('exercise-name').value;
        const duration = parseFloat(document.getElementById('exercise-duration').value);
        const calories = parseFloat(document.getElementById('exercise-calories').value);
        workouts.push({ name, duration, calories });
        saveData();
        renderWorkouts();
        workoutForm.reset();
    });

    goalsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        goals.steps = parseFloat(document.getElementById('goal-steps').value);
        goals.calories = parseFloat(document.getElementById('goal-calories').value);
        saveData();
        renderStats();
    });

    workoutList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-workout')) {
            const index = e.target.getAttribute('data-index');
            workouts.splice(index, 1);
            saveData();
            renderWorkouts();
        } else if (e.target.classList.contains('edit-workout')) {
            const index = e.target.getAttribute('data-index');
            const workout = workouts[index];
            document.getElementById('exercise-name').value = workout.name;
            document.getElementById('exercise-duration').value = workout.duration;
            document.getElementById('exercise-calories').value = workout.calories;
            workouts.splice(index, 1);
            saveData();
            renderWorkouts();
        }
    });

    // Initial rendering
    renderWorkouts();
    renderStats();
});
