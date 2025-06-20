const customLogData = [];
const customResolutionLogData = [];

//implement type check with square brackets
const regexNotificationType = /\[(.*?)\]/g;

const regexTitle = /\[FIRING:1\]\s*([\s\S]*?)\s*Firing alerts:/g;
const regexResolutionTitle = /\[RESOLVED\]\s*([\s\S]*?)\s*Resolved alerts:/g;
const regexAlertMessageTime =
  /(?:AM|PM)\s*([\s\S]*?)\s* (?:\[FIRING:1\]|\[RESOLVED\])/g;
const regexAlertTime = /at(.{6})/g;
const regexAlertHostname = "";

let matchNotificationType;
let matchTitle;
let matchResolutionTitle;
let matchAlertMessageTime;
let matchAlertTime;
let matchAlertHostname;

let finalData = "";

while (
  (matchNotificationType = regexNotificationType.exec(
    document.getElementById("logdatadump").innerText
  )) !== null
) {
  console.log(matchNotificationType[1]);

  if (matchNotificationType[1] == "FIRING:1") {
    matchTitle = regexTitle.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchTitle[1]);

    matchAlertMessageTime = regexAlertMessageTime.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchAlertMessageTime[1]);

    matchAlertTime = regexAlertTime.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchAlertTime[1]);

    addLog(matchTitle[1], matchAlertMessageTime[1], matchAlertTime[1], "");
    finalData +=
      matchTitle[1] +
      "   " +
      matchAlertMessageTime[1] +
      "   " +
      matchAlertTime[1] +
      "\n";
  } else {
    matchResolutionTitle = regexResolutionTitle.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchResolutionTitle[1]);

    matchAlertMessageTime = regexAlertMessageTime.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchAlertMessageTime[1]);

    matchAlertTime = regexAlertTime.exec(
      document.getElementById("logdatadump").innerText
    );
    console.log(matchAlertTime[1]);

    addResolutionLog(
      matchResolutionTitle[1],
      matchAlertMessageTime[1],
      matchAlertTime[1]
    );
  }

  // This logs only the content between the two phrases
}

console.log(finalData);
renderTableFromCustomLogData();
renderResolutionTableFromCustomLogData();

// const regex0 = /(?:AM|PM)\s*([\s\S]*?)\s*\[FIRING:1\]/g;
// let match0;
// let finalData0 = '';
// while ((match0 = regex0.exec(document.getElementById("logdatadump").innerText)) !== null) {
//     console.log(match0[1]);
//     finalData0+=match0[1]+'\n';// This logs only the content between the two phrases
// }
// console.log(finalData0);

function addLog(title, alertMessageTime, alertTime, alertHostname) {
  // const title = prompt("Enter fruit name:");
  // const alertMessageTime = prompt("Enter fruit color:");
  // const alertTime = prompt("Enter fruit texture:");
  // const alertHostname = Number(prompt("Enter sweetness index (number):"));

  let matchingTitleRecord = customLogData.find((log) => log.title === title);

  if (matchingTitleRecord) {
    matchingTitleRecord.count += 1;
    matchingTitleRecord.alertTime += `, ${alertTime}`;
    matchingTitleRecord.alertMessageTime += `, ${alertMessageTime}`;
    console.log(
      matchingTitleRecord.minAlertTime,
      matchingTitleRecord.maxAlertTime
    );
    console.log(alertTime);

    if (toMinutes(matchingTitleRecord.minAlertTime) > toMinutes(alertTime)) {
      matchingTitleRecord.minAlertTime = alertTime;
      console.log("minAlertTime updated to:", matchingTitleRecord.minAlertTime);
    }
    if (toMinutes(matchingTitleRecord.maxAlertTime) < toMinutes(alertTime)) {
      matchingTitleRecord.maxAlertTime = alertTime;
      console.log("maxAlertTime updated to:", matchingTitleRecord.maxAlertTime);
    }
  } else {
    const logInput = {
      title,
      alertMessageTime,
      alertTime,
      alertHostname,
      count: 1,
      minAlertTime: alertTime,
      maxAlertTime: alertTime,
    };

    customLogData.push(logInput);
    console.log("Fruit added:", logInput);
    console.log("All fruits:", customLogData);
  }
}

function addResolutionLog(title, alertMessageTime, alertTime) {
  let matchingResolutionTitleRecord = customResolutionLogData.find(
    (log) => log.title === title
  );

  if (matchingResolutionTitleRecord) {
    matchingResolutionTitleRecord.count += 1;
    matchingResolutionTitleRecord.alertTime += `, ${alertTime}`;
    matchingResolutionTitleRecord.alertMessageTime += `, ${alertMessageTime}`;
    console.log(
      matchingResolutionTitleRecord.minAlertTime,
      matchingResolutionTitleRecord.maxAlertTime
    );
    console.log(alertTime);

    if (
      toMinutes(matchingResolutionTitleRecord.minAlertTime) >
      toMinutes(alertTime)
    ) {
      matchingResolutionTitleRecord.minAlertTime = alertTime;
      console.log(
        "minAlertTime updated to:",
        matchingResolutionTitleRecord.minAlertTime
      );
    }
    if (
      toMinutes(matchingResolutionTitleRecord.maxAlertTime) <
      toMinutes(alertTime)
    ) {
      matchingResolutionTitleRecord.maxAlertTime = alertTime;
      console.log(
        "maxAlertTime updated to:",
        matchingResolutionTitleRecord.maxAlertTime
      );
    }
  } else {
    const logResolutionInput = {
      title,
      alertMessageTime,
      alertTime,
      count: 1,
      minAlertTime: alertTime,
      maxAlertTime: alertTime,
    };

    console.log(logResolutionInput);

    customResolutionLogData.push(logResolutionInput);
  }
}

function renderTableFromCustomLogData() {
  if (customLogData.length === 0) {
    document.body.insertAdjacentHTML("beforeend", "<p>No data to display.</p>");
    return;
  }

  let tableHTML = `<div class="container-md p-4"> <h2 class="text-light mb-5">Alert's</h2> <table border="1" cellpadding="5" cellspacing="0" class="table table-bordered border-dark table-striped table-dark table-hover table-hover-color">
        <thead>
            <tr>
                <th>Title</th>
                <th>Alert Message Time</th>
                <th>Alert Times</th>
                <th>Alert Hostname</th>
                <th>Count</th>
                <th>Min Alert Time</th>
                <th>Max Alert Time</th>
            </tr>
        </thead>
        <tbody>`;

  customLogData.forEach((log) => {
    tableHTML += `<tr>
            <td>${log.title}</td>
            <td>${log.alertMessageTime}</td>
            <td>${log.alertTime}</td>
            <td>${log.alertHostname}</td>
            <td>${log.count}</td>
            <td>${log.minAlertTime}</td>
            <td>${log.maxAlertTime}</td>
        </tr>`;
  });

  tableHTML += `</tbody></table></div>`;

  // document.body.insertAdjacentHTML('afterbegin', tableHTML);
  document.getElementById("logtablecontainer").innerHTML = tableHTML;
}

function renderResolutionTableFromCustomLogData() {
  let tableHTML = `<div class="container-md p-3"> <h2 class="text-light mb-5">Resolution's</h2>  <table border="1" cellpadding="5" cellspacing="0" class="table table-striped table-bordered border-success table-dark table-hover table-hover-color">
        <thead>
            <tr>
                <th>Title</th>
                <th>Alert Message Time</th>
                <th>Alert Times</th>
                <th>Count</th>
                <th>Min Alert Time</th>
                <th>Max Alert Time</th>
            </tr>
        </thead>
        <tbody>`;

  customResolutionLogData.forEach((log) => {
    tableHTML += `<tr>
            <td>${log.title}</td>
            <td>${log.alertMessageTime}</td>
            <td>${log.alertTime}</td>
            <td>${log.count}</td>
            <td>${log.minAlertTime}</td>
            <td>${log.maxAlertTime}</td>
        </tr>`;
  });

  tableHTML += `</tbody></table></div>`;

  document.getElementById("logresolutiontablecontainer").innerHTML = tableHTML;
}

function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function produceFinalTable() {
  customResolutionLogData.forEach((resdata) => {
    let matchingTitleRecord = customLogData.find(
      (logdata) => logdata.title === resdata.title
    );
  });
}
