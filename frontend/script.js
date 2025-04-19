// File: frontend/script.js
async function addEmployee() {
    const employeeNameInput = document.getElementById("employeeName");
    const employeeIdInput = document.getElementById("employeeId");
    const weeklyOffSelect = document.getElementById("weeklyOff");
    const employeeAddMessage = document.getElementById("employeeAddMessage");
  
    const name = employeeNameInput.value.trim();
    const employeeId = employeeIdInput.value.trim();
    const weeklyOffDay = weeklyOffSelect.value;
  
    if (!name || !employeeId || !weeklyOffDay) {
      employeeAddMessage.textContent = "Please fill in all employee details.";
      employeeAddMessage.style.color = "red";
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/employees', { // Explicitly use localhost:3000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, employeeId, weeklyOffDay }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Failed to fetch http://localhost:3000/api/employees:', response.status, errorMessage);
        employeeAddMessage.textContent = `Failed to add employee. Status: ${response.status} - ${errorMessage}`;
        employeeAddMessage.style.color = "red";
        return;
      }
  
      const newEmployee = await response.json();
      employeeNameInput.value = "";
      employeeIdInput.value = "";
      weeklyOffSelect.value = "";
      employeeAddMessage.textContent = `Employee "${newEmployee.name}" added successfully.`;
      employeeAddMessage.style.color = "green";
  
    } catch (error) {
      console.error('Error sending request to http://localhost:3000/api/employees:', error);
      employeeAddMessage.textContent = "Failed to add employee due to a network error. Ensure the backend server is running.";
      employeeAddMessage.style.color = "red";
    }
  }