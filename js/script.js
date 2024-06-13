document.addEventListener("DOMContentLoaded", function () {
  getLinks();
  showChageLog();

  document.addEventListener("keydown", function (event) {
    if (event.altKey) {
      event.preventDefault(); // Prevent the default action of the key combination
      document.getElementById("searchDialog").classList.toggle("visible"); // Toggle the dialog visibility
      document.getElementById("searchInputFilter").focus();
    }
  });
  document
    .getElementById("searchInputFilter")
    .addEventListener("keydown", function (event) {
      var searchResults = document.getElementById("searchResults");
      var items = Array.from(searchResults.getElementsByTagName("li"));
      var currentIndex = Array.from(items).findIndex((item) =>
        item.classList.contains("selectedresult")
      );
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault(); // Prevent the default scrolling behavior

        if (event.key === "ArrowDown") {
          if (currentIndex < items.length - 1) {
            currentIndex++;
          }
        } else if (event.key === "ArrowUp") {
          if (currentIndex > 0) {
            currentIndex--;
          }
        }

        items.forEach((item) => item.classList.remove("selectedresult"));
        items[currentIndex].classList.add("selectedresult");
        items[currentIndex].focus();
      } else if (event.key === "Enter") {
        var selectedLink = items[currentIndex].querySelector("a");
        if (selectedLink) {
          selectedLink.click();
        }
      }
    });
  document
    .getElementById("searchInputFilter")
    .addEventListener("input", function () {
      searchFunction();
    });
});

async function showChageLog() {
  try {
    const response = await fetch("manifest.json");
    const data = await response.json();
    const oldversion = localStorage.getItem("version");
    const version = data.version;
    console.log(oldversion, version);
    if (oldversion < version) {
      const response = await fetch("changelog/updates.json");
      const data = await response.json();
      displayData(data, oldversion, version);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayData(changelog, oldversion, newversion) {
  console.log(changelog);
  Object.keys(changelog)
    .filter((change) => change > oldversion && change <= newversion)
    .forEach((version) => {
      const v = document.createElement("h1");
      v.textContent = "v" + version;
      document.getElementById("changelog").appendChild(v);
      changelog[version].forEach((update) => {
        const u = document.createElement("li");
        u.textContent = update;
        document.getElementById("changelog").appendChild(u);
      });
      document.getElementById("changelog").showModal();
      document.getElementById("changelogDismiss").onclick = function () {
        localStorage.setItem("version", version);
        document.getElementById("changelog").close();
      };
    });
}

function addCustomLink() {
  const dialog = document.getElementById("customLink");
  const id = dialog.componentId;
  var link = document.getElementById("clink").value;
  var text = document.getElementById("ctext").value;

const components = JSON.parse(localStorage.getItem("components"));
 if(dialog.type=="link") {
   const new_link = {
     link: link,
     text: text,
     icon: getImageUrl(link),
   };
   components[id].items.push(new_link);
} else if(dialog.type=="panel") {
	const new_link = {
		link: link,
		title: text,
		gridItems: 1,
		items: [],
	};
	components.push(new_link);
}

	localStorage.setItem("components", JSON.stringify(components));
  getLinks();
}

async function getDefaultConfig() {
  try {
    const defaultLinks = await fetch("/js/components.json");
    const components = await defaultLinks.json();
    return components;
  } catch (error) {
    return [];
  }
}

function downloadConfig() {
  // give the localstorage json
  const components = JSON.parse(localStorage.getItem("components"));
  const linkconfig = JSON.parse(localStorage.getItem("linkconfig"));

  const config = {
    linkconfig,
    components,
  };

  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(config));
  var dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "config.json");
  dlAnchorElem.click();

  // Save the configration file
}

function removeItem() {
  debugger;
  const componentId = event.target.getAttribute("componentId");

  const subId = event.target.getAttribute("subId");
  console.log(componentId, subId);
}

function openUploadConfig() {
  document.getElementById("uploader").showModal();
}

function uploadConfig() {
  const input = document.getElementById("fileInput");
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const config = JSON.parse(reader.result);
    if (!config.components || !config.linkconfig)
      return alert("Invalid config");
    // localStorage.setItem('config', reader.result);
    localStorage.setItem("linkconfig", JSON.stringify(config.linkconfig));
    localStorage.setItem("components", JSON.stringify(config.components));
    getLinks();
  };
  reader.readAsText(file);
}

function loadDefaults() {
  localStorage.clear("components");
  localStorage.clear("linkconfig");
  getLinks();
}

async function getLinks() {
  document.getElementById("placeholder").innerHTML = "";
  // get the components.json
  if (!localStorage.getItem("components")) {
    const configration = await getDefaultConfig();
    localStorage.setItem("components", JSON.stringify(configration.components));
  }

  if (!localStorage.getItem("linkconfig")) {
    const configration = await getDefaultConfig();
    localStorage.setItem("linkconfig", JSON.stringify(configration.linkconfig));
  }

  const components = JSON.parse(localStorage.getItem("components")) || [];
  components.forEach((component, index) => {
    const col = document.createElement("custom-column");
    col.title = component.title;
    col.link = component.link;
    col.icon = getImageUrl(component.link);
    col.items = component.items;
    col.gridItems = component.gridItems;
    col.componentId = index;
    document.getElementById("placeholder").appendChild(col);
  });
}

const html = document.querySelector("html");
html.classList.add("dark-theme");

const themePreference = localStorage.getItem("theme");

if (themePreference === "light-theme") {
  html.classList.remove("dark-theme");
  html.classList.add("light-theme");
}

function toggleTheme() {
  html.classList.toggle("dark-theme");
  html.classList.toggle("light-theme");

  // Store theme preference in local storage
  if (html.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark-theme");
  } else {
    localStorage.setItem("theme", "light-theme");
  }
}

function showAddLink(componentId) {
  const dialog = document.getElementById("customLink");
  dialog.type="link"
  dialog.componentId = componentId;
  dialog.showModal();
}

function showAddPanel() {
  const dialog = document.getElementById("customLink");
  // dialog.componentId = componentId;
  dialog.type="panel"
  dialog.querySelector("#dialtitle").textContent = "Add Panel";
  dialog.showModal();
}

function getImageUrl(link) {
  const config = JSON.parse(localStorage.getItem("linkconfig")) || [];
  for (const keyword in config) {
    if (link?.includes(keyword)) {
      return config[keyword];
    }

    return "fa-link";
  }

  return config.default;
}

function toggleRemoveButtons() {
  var elements = document.getElementsByClassName("buttonCustom");
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.toggle("buttonCustomVisible");
  }
}

function searchFunction() {
  var keyword = document
    .getElementById("searchInputFilter")
    .value.toLowerCase();
  const components = JSON.parse(localStorage.getItem("components")) || [];

  // flatten
  const links = components.reduce((acc, component) => {
    const items = component.items.map((item) => {
      return {
        text: item.text,
        link: item.link,
      };
    });
    return acc.concat(items);
  }, []);

  var filteredLinks = links.filter(function (link) {
    return (
      link?.text?.toLowerCase()?.includes(keyword?.toLowerCase()) && keyword
    );
  });

  var searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Clear previous search results

  filteredLinks.forEach(function (link) {
    searchResults.innerHTML += `<custom-item text="${link.text}" link="${
      link.link
    }" icon="${getImageUrl(link.link)}"></custom-item>`;
  });
}
