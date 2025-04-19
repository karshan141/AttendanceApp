const employees = [
    "Raj", "Meena", "Amit", "Sneha", "Karan",
    "Pooja", "Vikas", "Neha", "Ravi", "Simran",
    "Anil", "Tina", "Manoj", "Rina", "Vivek",
    "Sonal", "Arvind", "Priya", "Nikhil", "Geeta"
  ];
  
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const weeklyOffs = {
    "Raj": "Sunday",
    "Meena": "Monday",
    "Amit": "Tuesday",
    "Sneha": "Wednesday",
    "Karan": "Thursday",
    "Pooja": "Friday",
    "Vikas": "Saturday",
    "Neha": "Sunday",
    "Ravi": "Monday",
    "Simran": "Tuesday",
    "Anil": "Wednesday",
    "Tina": "Thursday",
    "Manoj": "Friday",
    "Rina": "Saturday",
    "Vivek": "Sunday",
    "Sonal": "Monday",
    "Arvind": "Tuesday",
    "Priya": "Wednesday",
    "Nikhil": "Thursday",
    "Geeta": "Friday"
  };
  
  // 🟡 Pending OFFs
  let pendingOffs = JSON.parse(localStorage.getItem("pendingOffs")) || {
    "Raj": ["2025-03-30", "2025-03-23", "2025-03-16", "2025-03-09", "2025-03-02"],
    "Priya": ["2025-03-26", "2025-03-19", "2025-03-12", "2025-03-05"],
    "Sneha": ["2025-03-26"],
    "Vikas": ["2025-03-29"],
    "Tina": ["2025-03-27"],
    "Ravi": ["2025-03-24"]
  };
  
  // Save default pendingOffs to localStorage if not already present
  if (!localStorage.getItem("pendingOffs")) {
    localStorage.setItem("pendingOffs", JSON.stringify(pendingOffs));
  }
  
  // 🔧 Get all dates between two dates
  function getDateRange(from, to) {
    const dates = [];
    let current = new Date(from);
    const end = new Date(to);
    while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
  }
  
  function isSameWeek(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
  
    const startOfWeek1 = new Date(date1);
    startOfWeek1.setDate(date1.getDate() - date1.getDay()); // Get the Sunday of the week
  
    const startOfWeek2 = new Date(date2);
    startOfWeek2.setDate(date2.getDate() - date2.getDay()); // Get the Sunday of the week
  
    return startOfWeek1.toDateString() === startOfWeek2.toDateString();
  }
  
  function createTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
  
    employees.forEach((employee) => {
        const weeklyOff = weeklyOffs[employee];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee} <br><small>🛑 ${weeklyOff}</small></td>
            <td>
                <label><input type="radio" name="status-${employee}" value="P" checked> Present</label>
                <label><input type="radio" name="status-${employee}" value="A"> Absent</label>
            </td>
        `;
        tbody.appendChild(row);
    });
  }
  
  function saveAttendance() {
    const date = document.getElementById("date").value;
    if (!date) {
        alert("Please select a date!");
        return;
    }
  
    const selectedDay = weekdays[new Date(date).getDay()];
    const thisWeekKeys = Object.keys(localStorage).filter(key =>
        key.startsWith("attendance-") &&
        isSameWeek(key.replace("attendance-", ""), date)
    );
  
    const weeklyData = {};
    thisWeekKeys.forEach(key => {
        const records = JSON.parse(localStorage.getItem(key));
        records.forEach((rec) => {
            if (!weeklyData[rec.employee]) weeklyData[rec.employee] = [];
            weeklyData[rec.employee].push(rec.status);
        });
    });
  
    const todayRecord = employees.map((employee) => {
        const radios = document.getElementsByName("status-" + employee);
        let selected = "P";
        radios.forEach(r => {
            if (r.checked) selected = r.value;
        });
  
        let finalStatus = selected;
        const isWeeklyOff = selectedDay === weeklyOffs[employee];
        const hasPendingOffs = pendingOffs[employee] && pendingOffs[employee].length > 0;
  
        if (isWeeklyOff) {
            if (selected === "P") {
                if (!pendingOffs[employee]) pendingOffs[employee] = [];
                pendingOffs[employee].push(date);
                finalStatus = "P"; // Report में सिर्फ "P" दिखाएगा
            } else if (selected === "A") {
                finalStatus = `OFF<br>(${selectedDay})`;
            }
        } else if (selected === "A") {
            if (hasPendingOffs) {
                if (pendingOffs[employee].length > 1) {
                    pendingOffs[employee].sort((a, b) => new Date(a) - new Date(b));
                }
                const usedDate = pendingOffs[employee][0];
                finalStatus = `OFF (Used Pending)<br>${usedDate}`;
                pendingOffs[employee].shift();
                if (pendingOffs[employee].length === 0) delete pendingOffs[employee];
            } else {
                finalStatus = "A"; // Simply mark as 'A'
            }
            // The 'alreadyOneA' check and alert are removed here
        }
  
        return { employee, status: finalStatus };
    });
  
    localStorage.setItem("attendance-" + date, JSON.stringify(todayRecord));
    localStorage.setItem("pendingOffs", JSON.stringify(pendingOffs));
    alert("Attendance saved for " + date);
    showReport();
    updateDashboard(); // Update dashboard after saving attendance
  }
  
  function showReport() {
    const reportDiv = document.getElementById("report");
    reportDiv.innerHTML = "";
  
    const keys = Object.keys(localStorage).filter(key => key.startsWith("attendance-")).sort();
    keys.forEach((key) => {
        const date = key.replace("attendance-", "");
        const records = JSON.parse(localStorage.getItem(key));
        let html = `<h4>📅 ${date}</h4><ul>`;
        records.forEach((rec) => {
            let icon = rec.status.includes("P") ? "✔️" :
                rec.status.includes("A") ? "❌" :
                rec.status.includes("Used Pending") ? "🔁" : "💤";
            html += `<li><strong>${rec.employee}</strong>: ${icon} ${rec.status}</li>`;
        });
        html += "</ul>";
        reportDiv.innerHTML += html;
    });
  }
  
  function showPendingOffs() {
    const div = document.getElementById("pendingOffReport");
    div.innerHTML = "";
    const offs = JSON.parse(localStorage.getItem("pendingOffs") || "{}");
    if (Object.keys(offs).length === 0) {
        div.innerHTML = "<p>✅ No pending offs currently.</p>";
        return;
    }
    let html = "<ul>";
    for (const emp in offs) {
        const employeeOffs = JSON.parse(localStorage.getItem("pendingOffs"))[emp] || [];
        employeeOffs.forEach(date => {
            html += `<li><strong>${emp}</strong> → 📌 ${date}</li>`;
        });
    }
    html += "</ul>";
    div.innerHTML = html;
  }
  
  function generateMatrix() {
    const from = document.getElementById("fromDate").value;
    const to = document.getElementById("toDate").value;
    if (!from || !to) return alert("Please select both dates!");
  
    const dates = getDateRange(from, to);
    const matrixData = {};
    employees.forEach(emp => (matrixData[emp] = {}));
  
    dates.forEach(date => {
        const data = JSON.parse(localStorage.getItem("attendance-" + date) || "[]");
        data.forEach(d => {
            matrixData[d.employee][date] = d.status;
        });
    });
  
    let html = `<table border="1" style="min-width:100%; border-collapse:collapse;"><thead><tr><th>Employee</th>`;
    dates.forEach(d => html += `<th>${d}</th>`);
    html += `</tr></thead><tbody>`;
    employees.forEach(emp => {
        html += `<tr><td><strong>${emp}</strong></td>`;
        dates.forEach(date => {
            const value = matrixData[emp][date] || "-";
            html += `<td>${value}</td>`;
        });
        html += `</tr>`;
    });
    html += "</tbody></table>";
  
    document.getElementById("matrixReport").innerHTML = html;
  }
  
  // ✅ EXPORT TO EXCEL
  function exportMatrixToExcel() {
    const table = document.querySelector("#matrixReport table");
    if (!table) return alert("Please generate the matrix report first!");
    let wb = XLSX.utils.table_to_book(table, { sheet: "Attendance Matrix" });
    XLSX.writeFile(wb, "attendance-matrix.xlsx");
  }
  
  // ✅ EXPORT TO PDF
  function exportMatrixToPDF() {
    const table = document.querySelector("#matrixReport table");
    if (!table) return alert("Please generate the matrix report first!");
    const win = window.open("", "", "width=900,height=700");
    win.document.write("<html><head><title>Matrix PDF</title></head><body>");
    win.document.write(table.outerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  }
  
  function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = JSON.parse(localStorage.getItem(`attendance-${today}`) || '[]');
  
    let presentToday = 0;
    let absentToday = 0;
    let onLeave = 0;
  
    attendanceToday.forEach(record => {
        if (record.status === 'P') {
            presentToday++;
        } else if (record.status === 'A') {
            absentToday++;
        } else if (record.status.includes('OFF (Used Pending)')) {
            onLeave++; // Consider 'Used Pending' as on leave for dashboard
        } else if (record.status.includes('OFF<br>')) {
            onLeave++; // Consider weekly offs as on leave for dashboard
        }
    });
  
    const totalEmployees = employees.length;
    let pendingOffsCount = 0;
    const currentPendingOffs = JSON.parse(localStorage.getItem("pendingOffs")) || {};
    for (const emp in currentPendingOffs) {
        if (currentPendingOffs.hasOwnProperty(emp)) {
            pendingOffsCount += currentPendingOffs[emp].length;
        }
    }
  
    const todayDayIndex = new Date().getDay();
    const todayDayName = weekdays[todayDayIndex];
    let weeklyOffsToday = 0;
    for (const emp in weeklyOffs) {
        if (weeklyOffs.hasOwnProperty(emp) && weeklyOffs[emp] === todayDayName) {
            weeklyOffsToday++;
        }
    }
  
    document.querySelector('.total-employees .card-body').textContent = totalEmployees;
    document.querySelector('.present-today .card-body').textContent = presentToday;
    document.querySelector('.absent-today .card-body').textContent = absentToday;
    document.querySelector('.on-leave .card-body').textContent = onLeave;
    document.querySelector('.pending-offs-count .card-body').textContent = pendingOffsCount;
    document.querySelector('.weekly-offs-today .card-body').textContent = weeklyOffsToday;
  }
  
  window.onload = () => {
    // Save default pendingOffs on page load if not present
    if (!localStorage.getItem("pendingOffs")) {
        localStorage.setItem("pendingOffs", JSON.stringify(pendingOffs));
    }
    createTable();
    showReport();
    updateDashboard(); // Call updateDashboard on page load
  };