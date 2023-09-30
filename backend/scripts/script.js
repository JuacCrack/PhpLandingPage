document.addEventListener('DOMContentLoaded', function() {
  utilsHtml()
  boxlogin();
});

function utilsHtml() {

  let elemetal = `
    <section class="head"></section>

    <section class="body"></section>

    <section class="foot"></section>
  `;

$("body").append(elemetal);

  let popup = `
    <div class="popup-container" id="popup">
      <div class="popup">
        <a href="#" class="close">X</a>
        <div class="request-content"></div>
      </div>
    </div>
  `;

  let preloader = `
    <div class="popup-container center" id="preloader">
      <div class="spinner"></div>
    </div>
  `;

  $("body").append(preloader);


  $("body").append(popup);
  

}

function mostrarPreloader(display) {

  const hash = window.location.hash;

  if (display) {
    if (hash !== '#preloader') {
      window.location.hash = 'preloader';
    }
  } else {
    if (hash !== '#') {
      window.location.hash = '#';
    }
  }
}

function boxlogin() {

  var loginFormContent = `
    <div class="login-form center">
      <form>
        <h2>Iniciar Sesión</h2>
        <input class="login-value" type="text" name="user" style="text-align: start;" placeholder="Nombre de usuario" required>
        <input class="login-value" type="password" name="pass" placeholder="Contraseña" required>
        <button type="submit" class="submit">Acceder</button>
      </form>
    </div>`;

  $('.body').html(loginFormContent);

  $('.body').addClass('center');

  $('.submit').on('click', async function(event) {
    event.preventDefault();

    const user = $('#user').val();
    const pass = $('#pass').val();

    if (user === '' || pass === '') {
      popup('reply', 'Campos vacíos', 'Por favor, complete todos los campos.', 400);
      return;
    }

    try {

      const response = await bridgeToAjax('POST', 'users', null, 'login');

      if (response) {
        var category = response.category; 
        if (category && typeof window[category] === 'function') {
          window[category]();
        }
      }

    } catch (error) {
      popup('reply', 'Acceso denegado', 'Por favor, verifique los datos', 500);
    } 

  });

}

function home() {

  var navElement = $('<div class="nav"></div>');
  $('.head').append(navElement);

  var homeElement = $('<div class="home"></div>');
  navElement.append(homeElement);

  homeElement.click(function() {

    $('.body').empty();

    boxlogin();

    $('.head').empty();

  });

}

function copyright() {

  $('.foot').addClass('center');

  $('.foot').css('color', 'white');

  $('.foot').append('<h4>&copy;DBManagment 2023</h4>');

}

async function design() {
  try {
    home();
    const response = await bridgeToAjax('GET', null, null, 'GETALL');
    const bodyElement = $('.body');
    bodyElement.html('');
    const designDiv = $('<div>').addClass('design');
    for (const tableName in response) {
      if (response.hasOwnProperty(tableName)) {
        const designHTML = `
          <div class="title-align">
            <h2>${tableName}</h2>
            <button class="btn-post btn-new" data-id="${tableName}">New</button>
          </div>
          <div class="content-table-${tableName} content-table"></div>
        `;
        designDiv.append(designHTML);
      }
    }
    bodyElement.append(designDiv);

    $('.btn-new').on('click', function() {
      const tableName = $(this).data('id');
      const filteredTableInfo = { [tableName]: response[tableName] }; // Encapsular en un objeto con el nombre de la tabla
      popup('post-values-table', `${tableName}`, null, null, null, null, filteredTableInfo);
    });

    getAll();
    copyright();
  } catch (error) {
    popup('reply', 'No se pudieron cargar las tablas', error, 500);
  }
}

async function postValue(dataid, datatable, title) {
  try {
    const imagebool = await checkImageColumn(datatable);
    
    const response = await bridgeToAjax('POST', `${title}`, dataid, null, imagebool);

    if (response) {
      updateTable(datatable);
      popup('reply', 'Categoría agregada con éxito', 'Categoría agregada con éxito', 200);
    }
  } catch (error) {
    popup('reply', 'Error al agregar la categoría', 'Ocurrió un error al agregar la categoría', 500);
  }
}

async function combinedData() {
  const combinedData = {};

  const response = await bridgeToAjax('GET', null, null, 'GETALL');

  for (const tableName in response) {
    if (response.hasOwnProperty(tableName)) {
      const valuesResponse = await bridgeToAjax('GET', tableName);

      combinedData[tableName] = {
        columns: response[tableName],
        values: valuesResponse,
      };
    }
  }

  return generateInputs(combinedData, true);
}

function generateTable(combinedData) {

  const colsvalues = combinedData;

  for (const tableName in colsvalues) {
    if (colsvalues.hasOwnProperty(tableName)) {
      const tableData = colsvalues[tableName];

      if (tableData.length > 0) {

        let boxcontainer = document.querySelector(`.content-table-${tableName}`);
        $(boxcontainer).empty();
        $(boxcontainer).removeClass('center');

        const tableHTML = document.createElement('table');
        tableHTML.className = `content-table-${tableName}`;

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const firstRowData = tableData[0]; 

        for (const columnName in firstRowData) {
          if (firstRowData.hasOwnProperty(columnName)) {
            const th = document.createElement('th');
            th.textContent = columnName;
            headerRow.appendChild(th);
          }
        }

        const actionsTh = document.createElement('th');
        actionsTh.textContent = 'Actions';
        headerRow.appendChild(actionsTh);

        thead.appendChild(headerRow);
        tableHTML.appendChild(thead);

        const tbody = document.createElement('tbody');

        tableData.forEach(rowData => {
          const row = document.createElement('tr');

          for (const columnName in rowData) {
            if (rowData.hasOwnProperty(columnName)) {
              const td = document.createElement('td');
              td.innerHTML = rowData[columnName];
              row.appendChild(td);
            }
          }

          const actionsTd = document.createElement('td');
          actionsTd.className = 'actions';
          actionsTd.innerHTML = `
            <button class="delete-btn red" data-id="${rowData.id}" data-table="${tableName}">❌</button>
            <button class="edit-btn yellow" data-id="${rowData.id}" data-table="${tableName}">📝</button>
          `;
          row.appendChild(actionsTd);

          tbody.appendChild(row);
        });

        tableHTML.appendChild(tbody);

        const container = document.querySelector(`.content-table-${tableName}`);
        container.innerHTML = ""; 
        container.appendChild(tableHTML);
      } else if (tableData.length === 0) {
        const container = document.querySelector(`.content-table-${tableName}`);
        container.innerHTML = ""; 
        container.classList.add('center'); 

        const emptyMessage = document.createElement('h3');
        emptyMessage.textContent = `Tabla "${tableName}" vacía, pulse en "New" para crear un elemento`;
        container.appendChild(emptyMessage);
      }
    }
  }
}

async function checkImageColumn(table) {
  const tableStructure = await bridgeToAjax('GET', null, null, 'GETALL');
  const columnToCheck = {
    "column": "image",
    "type": "longtext",
    "key": ""
  };
  let imagebool = false;

  if (tableStructure.hasOwnProperty(table)) {
    const tableColumns = tableStructure[table];

    for (const column of tableColumns) {
      if (JSON.stringify(column) === JSON.stringify(columnToCheck)) {
        imagebool = true;
        break;
      }
    }
  }

  return imagebool;
}

async function updateTable(table) {
  try {
    const combinedDataValues = await combinedData();
    const filteredData = {};
    
    if (combinedDataValues.hasOwnProperty(table)) {
      filteredData[table] = combinedDataValues[table];
    }

    generateTable(filteredData);
  } catch (error) {
    throw error;
  }
}

async function deleteById(id, table) {
  try {
    const response = await bridgeToAjax('DELETE', table, id);
    await updateTable(table);
    return response;
  } catch (error) {
    throw error;
  }
}

async function putById(id, table) {
  try {
    const imagebool = await checkImageColumn(table);
    const response = await bridgeToAjax('PUT', table, id, null, imagebool);
    await updateTable(table);
    return response;
  } catch (error) {
    throw error;
  }
}

async function getAll() {
  try {
    const combinedDataValues = await combinedData();
    generateTable(combinedDataValues);

    $(document).off('click', `.delete-btn`).on('click', `.delete-btn`, async function () {
      try {
        const id = $(this).data('id');
        const table = $(this).data('table');
        const response = await deleteById(id, table);
        if (response) {
          popup('reply', response.message, response.message, response.status);
        }
      } catch (error) {
        popup('reply', 'No se pudo eliminar el registro', error, 500);
      }
    });

    $(document).off('click', `.edit-btn`).on('click', `.edit-btn`, async function () {
      try {
        const id = $(this).data('id');
        const table = $(this).data('table');
        const response = await putById(id, table);
        if (response) {
          popup('reply', response.message, response.message, response.status);
        }
      } catch (error) {
        popup('reply', 'No se pudo actualizar el registro', error, 500);
      }
    });
  } catch (error) {
    popup('reply', 'No se pudieron cargar los datos de las tablas', error, 500);
  }
}

function smoothScrollAnimation(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

  var href = $(this).attr('href'); // Obtener el valor del atributo href del enlace

  // Animación de desplazamiento suave
  $('html, body').animate({
    scrollTop: $(href).offset().top
  }, 800);
}

function disableBodyOverflow() {
  var hash = window.location.hash;
  var body = document.querySelector('body');
  var closeLink = document.querySelector('.close');

  if (hash === '#popup') {
    body.style.overflow = 'hidden';
    closeLink.setAttribute('href', '#menu'); 
    body.style.overflow = 'auto'; 
    closeLink.setAttribute('href', '#popup'); 
  }
}

function generateInputs(response, alternative) {
  const inputTypes = {
    'varchar(255)': 'text',
    'int': 'number',
    'text': 'text',
    'longtext': 'file',
    'date': 'date',
  };

  const excludedColumns = [
    { column: 'date', type: 'date', key: '' },
    { column: 'category', type: 'varchar(255)', key: '' },
    { column: 'id', type: 'int', key: 'PRI' },
  ];

  const inputElements = {};

  for (const tableName in response) {
    if (response.hasOwnProperty(tableName)) {
      const tableData = response[tableName];

      if (!inputElements[tableName]) {
        inputElements[tableName] = [];
      }

      if (alternative) {
        if (!tableData.values || !Array.isArray(tableData.values)) {
          continue; 
        }
    
        for (const row of tableData.values) {
          const rowElements = {};
    
          for (const columnName in row) {
            if (row.hasOwnProperty(columnName)) {
              const columnValue = row[columnName];
              const columnInfo = tableData.columns.find(col => col.column === columnName);
    
              if (!columnInfo) continue;
    
              const isExcluded = excludedColumns.some(excludedColumn => (
                excludedColumn.column === columnName &&
                excludedColumn.type === columnInfo.type &&
                excludedColumn.key === columnInfo.key
              ));
    
              if (inputTypes.hasOwnProperty(columnInfo.type)) {
                const inputType = inputTypes[columnInfo.type];
                let inputHTML = '';
    
                if (isExcluded) {
                  inputHTML = columnValue; 
                } else if (columnName === 'image') {
                  inputHTML = `
                    <div class="image-box" data-id="${row.id}" style="background-image: url('${columnValue}');">
                      <input type="file" id="file-img-put-${row.id}" name="image" class="none value-${tableName}-${row.id}" data-id="${row.id}">
                      <label for="file-img-put-${row.id}" class="label-put" data-id="${row.id}"></label>
                    </div>
                  `;
                } else {
                  // Generar una ID aleatoria diferente para cada input normal
                  const RandomId = Math.random().toString(36).substring(2); // Convierte a base 36
    
                  inputHTML = `<input type="${inputType}" name="${columnName}" id="${RandomId}" class="input value-${tableName}-${row.id}" placeholder="Enter ${columnName}" value="${columnValue}" data-id="${row.id}">`;
                }
    
                rowElements[columnName] = inputHTML;
              }
            }
          }
    
          inputElements[tableName].push(rowElements);
        }
    }
    
    }
  }

  if (!alternative) {
    const inputElements = {};
    
    const randomDataId = Math.random().toString(36).substring(2); 
  
    for (const tableName in response) {
      if (response.hasOwnProperty(tableName)) {
        const tableInfo = response[tableName];
    
        if (!inputElements[tableName]) {
          inputElements[tableName] = {};
        }
  
        let currentIndex = 0; 
  
        for (const columnInfo of tableInfo) {
          const isExcluded = excludedColumns.some(excludedColumn => (
            excludedColumn.column === columnInfo.column &&
            excludedColumn.type === columnInfo.type &&
            excludedColumn.key === columnInfo.key
          ));
    
          if (!isExcluded && inputTypes.hasOwnProperty(columnInfo.type)) {
            const inputType = inputTypes[columnInfo.type];
            const columnName = columnInfo.column;
    
            const randomId = Math.random().toString(36).substring(2); 
    
            const inputHTML = `<input type="${inputType}" name="${columnName}" id="${randomId}" class="input value-${tableName}-${randomDataId}" placeholder="Enter ${columnName}" required>`;
    
            inputElements[tableName][currentIndex] = inputHTML;
            currentIndex++; 
          }
        }
  
        inputElements[tableName]['data-id'] = randomDataId;
      }
    }
  
    return inputElements;
  }
  
  return inputElements;
}

function popup(type, title, message, status, detailserror, id, response) {
  
  if ($("#popup").length > 0) {
    $('.request-content').empty();
  }
  
  var html = '';

  switch (type) {

    case 'reply':
      html = `
      <h4 id="result">${title}</h4>
      <label for="message" class="view-details">View Details</label>
      <input type="checkbox" id="message" class="hide">
      <div class="details">
        <h5>Details</h5>
        <p id="details-text">${message} [${status}]</p>
        ${detailserror !== undefined && detailserror !== '' ? `
        <h5>More Details</h5>
        <p>${detailserror}</p>
        ` : ''}
      </div>
      `;
    break;

    case 'post-values-table':
      const inputElements = generateInputs(response);
      
      var html = `
        <h4>Create ${title}</h4>
        <div class="input-grid">
      `;
      
      let randomDataId; 
      
      for (const tableName in inputElements) {
        if (inputElements.hasOwnProperty(tableName)) {
          const tableInfo = inputElements[tableName];
      
          for (const columnIndex in tableInfo) {
            if (tableInfo.hasOwnProperty(columnIndex)) {
              const inputHTML = tableInfo[columnIndex];
      
              if (inputHTML.includes('input')) { 
                html += `
                  ${inputHTML}
                `;
              }
            }
          }
      
          if (tableInfo.hasOwnProperty('data-id')) {
            randomDataId = tableInfo['data-id'];
          }
        }
      }
      
      html += `
        </div>
        <button class="btn-post post-${title}" data-id="${randomDataId}" data-table="${title}">Submit</button>
      `;
      
      $(document).off('click', `.post-${title}`).on('click', `.post-${title}`, async function () {
        try {
          const dataid = $(this).data('id');
          const datatable = $(this).data('table');
          await postValue(dataid, datatable, title);
          popup('reply', 'Categoría agregada con éxito', 'Categoría agregada con éxito', 200);
        } catch (error) {
          console.log(error);
        }
      });
      

    
    break;
     


    
      html = `
      <div class="countdown"></div>
      `;
      $('.request-content').css({
        'height': 'auto',
        'width': 'auto'
      });
      
      // Llamar a la función disableBodyOverflow cuando haya un cambio en el hash
      window.addEventListener('hashchange', disableBodyOverflow);

    break;
    
    default:

    html = `<h3>Mensaje Indefinido</h3>`;

    break;

  }

  let content = $('.request-content').html(html);

  if ($(".request-content").length > 0) {
    if (content) {

      window.location.hash = '#popup';
        
    }
  }


}

async function sendAjaxRequest(jsonData) {
  console.log(jsonData);
  return new Promise((resolve, reject) => {
    const url = `backend/php/index.php?table=${jsonData.table_name}&action=${jsonData.action || jsonData.method}`;
    $.ajax({
      url: url,
      type: jsonData.method,
      data: JSON.stringify(jsonData),
      contentType: 'application/json',
      success: function(response, status, xhr) {
        resolve(response);
      },
      error: function(xhr, status, error) {
        const errorMessage = xhr.responseText;
        reject(errorMessage);
      }
    });
  });
}

async function bridgeToAjax(method, table, id, action, image) {
  return new Promise(async (resolve, reject) => {
    try {

      mostrarPreloader(true);

      let jsonData;

      switch (method) {
        case 'GET':
          jsonData = {
            method: method,
            table_name: table,
            id: id,
            action: action || method,
          };
          break;

        case 'POST':
          if (action === 'login') {
            const postData = {};
            $(`.login-value`).each(function () {
              const fieldName = $(this).attr('name');
              const fieldValue = $(this).val();
              postData[fieldName] = fieldValue;
            });
            jsonData = {
              method: method,
              table_name: table,
              id: id,
              action: action || method,
              data: postData
            };
          } else {
            const postData = {};
            $(`.value-${table}-${id}`).each(function () {
              const fieldName = $(this).attr('name');
              const fieldValue = $(this).val();
              postData[fieldName] = fieldValue;
            });

            if (image) {
              const imageFieldName = 'image';
              const imageFile = $(`.value-${table}-${id}[name="${imageFieldName}"]`)[0].files[0];

              if (imageFile) {
                const base64Image = await compressAndConvertToBase64(imageFile);
                postData[imageFieldName] = base64Image;
              }
            }

            jsonData = {
              method: method,
              table_name: table,
              id: id,
              action: action || method,
              data: postData,
            };
          }
          break;

          case 'PUT':
            const putData = {};
            $(`.value-${table}-${id}`).filter(function () {
              return $(this).val().trim() !== '';
            }).each(function () {
              const fieldName = $(this).attr('name');
              const fieldValue = $(this).val();
              putData[fieldName] = fieldValue;
            });
          
            if (image) {
              const imageFieldName = 'image';
              const imageFile = $(`.value-${table}-${id}[name="${imageFieldName}"]`)[0].files[0];
          
              if (imageFile) {
                const base64Image = await compressAndConvertToBase64(imageFile);
                putData[imageFieldName] = base64Image;
              }
            }
          
            jsonData = {
              method: method,
              table_name: table,
              id: id,
              action: action || method,
              data: putData
            };
          break;
  
        case 'DELETE':
          jsonData = {
            method: method,
            table_name: table,
            id: id,
            action: action || method
          };
          break;

        default:
          reject(new Error('Método no válido'));
          return; 
      }

      const sql = isSafeFromSQLInjection(jsonData.data);

      if (sql) {

        const response = await sendAjaxRequest(jsonData);

        setTimeout(() => {
          mostrarPreloader(false); 
          resolve(response); 
        }, 100);

      } else {
        reject(error);
      }

    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
}

function isSafeFromSQLInjection(data) {
  if (!data) {
    return true;
  }

  const sqlKeywords = [
    "select", "insert", "update", "delete", "drop", "union", "alter",
    "from", "where", "or", "and", "into", "values", "execute",
    "exec", "declare", "cast", "convert", "create", "table", "database",
    "truncate", "grant", "revoke", "view", "index", "rename", "modify",
    "having", "execute", "xp_cmdshell", "create", "join", "inner", "outer",
    "exists", "case", "when", "then", "else", "end", "order", "by", "asc",
    "desc", "between", "like", "begin", "commit", "rollback", "cursor",
    "fetch", "open", "close", "top", "limit"
  ];

  const foundKeywords = [];

  for (const key in data) {
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    const item = data[key];

    if (isBase64Image(item)) {
      continue; 
    }

    const itemString = String(item).toLowerCase();

    for (const keyword of sqlKeywords) {
      if (itemString.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }
  }

  if (foundKeywords.length > 0) {
    return false; 
  }

  return true; 
}

function isBase64Image(str) {

  return typeof str === "string" && str.startsWith("data:image/");

}

function compressAndConvertToBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    // Cuando se haya cargado la imagen
    reader.onload = function (event) {
      var img = new Image();

      // Cuando se haya cargado la imagen en el objeto
      img.onload = function () {
        // Crear un canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // Asegúrate de ajustar el tamaño del canvas al tamaño de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Obtener la imagen en formato base64 del canvas
        var base64Image = canvas.toDataURL('image/jpeg', 0.7); // Puedes ajustar la calidad de compresión aquí

        // Resuelve la promesa con la imagen base64
        resolve(base64Image);
      };

      // Establecer la imagen en el objeto
      img.src = event.target.result;
    };

    // Leer el archivo como una URL de datos
    reader.readAsDataURL(file);
  });
}


