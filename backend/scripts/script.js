document.addEventListener('DOMContentLoaded', function() {
  new Components();
  Pages.BoxLogin();
});

class Components {
  constructor() {
    this.init();
  }

  init() {
    window.location.href = "#";
    this.createHtmlStructure();
    this.createPreloader();
    this.createPopup();
  }

  createHtmlStructure() {
    const element = `
      <section class="head"></section>
      <section class="body"></section>
      <section class="foot"></section>
    `;

    $("body").append(element);
  }

  createPreloader() {
    const preloader = `
      <div class="popup-container center" id="preloader">
        <div class="spinner"></div>
      </div>
    `;

    $("body").append(preloader);
  }

  createPopup() {
    const popup = `
      <div class="popup-container" id="popup">
        <div class="popup">
          <a href="#" class="close">X</a>
          <div class="request-content"></div>
        </div>
      </div>
    `;

    $("body").append(popup);
  }

  static initHome() {
    const navElement = $('<div class="nav"></div>');
    $('.head').append(navElement);

    const homeElement = $('<div class="home"></div>');
    navElement.append(homeElement);

    homeElement.click(function () {
      $('.body').empty();
      $('.foot').empty();
      $('.head').empty();
      Pages.BoxLogin();
    });
  }

  static initCopyright() {
    $('.foot').addClass('center');
    $('.foot').css('color', 'white');
    $('.foot').html('<h4>&copy;DBManagment 2023</h4>');
  }
}

class Utils {
  static mostrarPreloader(display) {
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

  static popup(type, title, message, status, detailserror, id, response) {

    window.location.href = "#";

    if ($("#popup").length > 0) {
      $('.request-content').empty();
    }

    let html = '';

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
        const inputElements = TableUtils.generateInputs(response);

        html = `
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

        $(document)
          .off('click', `.post-${title}`)
          .on('click', `.post-${title}`, async function () {
            try {
              const dataid = $(this).data('id');
              const datatable = $(this).data('table');
              await APIMethods.postValue(dataid, datatable, title);
              Utils.popup('reply', 'Categoría agregada con éxito', 'Categoría agregada con éxito', 200);
            } catch (error) {
              console.log(error);
            }
          });

        break;

      default:
        html = `<h3>Mensaje Indefinido</h3>`;
        break;
    }

    let content = $('.request-content').html(html);

    if ($('.request-content').length > 0) {
      if (content) {
        window.location.hash = '#popup';
      }
    }
  }

  static smoothScrollAnimation(event) {
    event.preventDefault(); 
  
    var href = $(this).attr('href'); 
  
    $('html, body').animate({
      scrollTop: $(href).offset().top
    }, 800);
  }

}

class Pages {
  static BoxLogin() {

    const loginFormContainer = document.createElement('div');
    loginFormContainer.classList.add('login-form', 'center');

    const formElement = document.createElement('form');

    const h2Element = document.createElement('h2');
    h2Element.textContent = 'Iniciar Sesión';

    const userInputElement = document.createElement('input');
    userInputElement.classList.add('login-value');
    userInputElement.type = 'text';
    userInputElement.name = 'user';
    userInputElement.style.textAlign = 'start';
    userInputElement.placeholder = 'Nombre de usuario';
    userInputElement.required = true;

    const passInputElement = document.createElement('input');
    passInputElement.classList.add('login-value');
    passInputElement.type = 'password';
    passInputElement.name = 'pass';
    passInputElement.placeholder = 'Contraseña';
    passInputElement.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('submit');
    submitButton.textContent = 'Acceder';

    formElement.appendChild(h2Element);
    formElement.appendChild(userInputElement);
    formElement.appendChild(passInputElement);
    formElement.appendChild(submitButton);

    loginFormContainer.appendChild(formElement);

    const bodyElement = document.querySelector('.body');
    bodyElement.classList.add('center');
    bodyElement.innerHTML = ''; 
    bodyElement.appendChild(loginFormContainer);

    submitButton.addEventListener('click', async function (event) {
      event.preventDefault();
      const user = userInputElement.value;
      const pass = passInputElement.value;

      if (user === '' || pass === '') {
        Utils.popup('reply', 'Campos vacíos', 'Por favor, complete todos los campos.', 400);
        return;
      }

      try {
        const response = await APIrequest.bridgeToAjax('POST', 'users', null, 'login');

        if (response) {
          const category = response.category;
          if (category && typeof Pages[category] === 'function') {
            Pages[category]();
          }
        }
      } catch (error) {
        Utils.popup('reply', 'Acceso denegado', 'Por favor, verifique los datos', 500);
      }
    });
  }

  static async Design() {
    try {
      Components.initHome();
      Components.initCopyright();
      const response = await APIrequest.bridgeToAjax('GET', null, null, 'GETALL');
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

      $('.btn-new').on('click', function () {
        const tableName = $(this).data('id');
        const filteredTableInfo = { [tableName]: response[tableName] };
        Utils.popup('post-values-table', `${tableName}`, null, null, null, null, filteredTableInfo);
      });

      APIMethods.getAll();
    } catch (error) {
      Utils.popup('reply', 'No se pudieron generar las tablas', error, 500);
    }
  }
}

class APIMethods {
  static async postValue(dataid, datatable, title) {
    try {
      const imagebool = await APIMethods.checkImageColumn(datatable);
      
      const response = await APIrequest.bridgeToAjax('POST', `${title}`, dataid, null, imagebool);

      if (response) {
        TableUtils.updateTable(datatable);
        Utils.popup('reply', 'Categoría agregada con éxito', 'Categoría agregada con éxito', 200);
      }
    } catch (error) {
      Utils.popup('reply', 'Error al agregar la categoría', 'Ocurrió un error al agregar la categoría', 500);
    }
  }

  static async deleteById(id, table) {
    try {
      const response = await APIrequest.bridgeToAjax('DELETE', table, id);
      await TableUtils.updateTable(table);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async putById(id, table) {
    try {
      const imagebool = await APIMethods.checkImageColumn(table);
      const response = await APIrequest.bridgeToAjax('PUT', table, id, null, imagebool);
      await TableUtils.updateTable(table);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const combinedDataValues = await TableUtils.combinedData();
      TableUtils.generateTable(combinedDataValues);

      $(document).off('click', `.delete-btn`).on('click', `.delete-btn`, async function () {
        try {
          const id = $(this).data('id');
          const table = $(this).data('table');
          const response = await APIMethods.deleteById(id, table);
          if (response) {
            Utils.popup('reply', response.message, response.message, response.status);
          }
        } catch (error) {
          Utils.popup('reply', 'No se pudo eliminar el registro', error, 500);
        }
      });

      $(document).off('click', `.edit-btn`).on('click', `.edit-btn`, async function () {
        try {
          const id = $(this).data('id');
          const table = $(this).data('table');
          const response = await APIMethods.putById(id, table);
          if (response) {
            Utils.popup('reply', response.message, response.message, response.status);
          }
        } catch (error) {
          Utils.popup('reply', 'No se pudo actualizar el registro', error, 500);
        }
      });
    } catch (error) {
      Utils.popup('reply', 'No se pudieron cargar los datos de las tablas', error, 500);
    }
  }

  static async checkImageColumn(table) {
    const tableStructure = await APIrequest.bridgeToAjax('GET', null, null, 'GETALL');
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
}

class TableUtils {
  static generateInputs(response, alternative) {
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

  static async combinedData() {
    const combinedData = {};

    const response = await APIrequest.bridgeToAjax('GET', null, null, 'GETALL');

    for (const tableName in response) {
      if (response.hasOwnProperty(tableName)) {
        const valuesResponse = await APIrequest.bridgeToAjax('GET', tableName);

        combinedData[tableName] = {
          columns: response[tableName],
          values: valuesResponse,
        };
      }
    }

    return TableUtils.generateInputs(combinedData, true);
  }

  static async updateTable(table) {
    try {
      const combinedDataValues = await TableUtils.combinedData();
      const filteredData = {};

      if (combinedDataValues.hasOwnProperty(table)) {
        filteredData[table] = combinedDataValues[table];
      }

      TableUtils.generateTable(filteredData);
    } catch (error) {
      throw error;
    }
  }

  static generateTable(combinedData) {

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

}

class APIrequest {
  static async sendAjaxRequest(jsonData) {
    return new Promise((resolve, reject) => {
      const url = `backend/php/index.php?table=${jsonData.table_name}&action=${jsonData.action || jsonData.method}`;
      $.ajax({
        url: url,
        type: jsonData.method,
        data: JSON.stringify(jsonData),
        contentType: 'application/json; charset=utf-8',
        success: function (response, status, xhr) {
          resolve(response);
        },
        error: function (xhr, status, error) {
          const errorMessage = xhr.responseText;
          reject(errorMessage);
        },
      });
    });
  }

  static async bridgeToAjax(method, table, id, action, image) {
    return new Promise(async (resolve, reject) => {
      try {
        Utils.mostrarPreloader(true);

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
                data: postData,
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
                  const base64Image = await APIUtils.compressAndConvertToBase64(imageFile);
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
                const base64Image = await APIUtils.compressAndConvertToBase64(imageFile);
                putData[imageFieldName] = base64Image;
              }
            }

            jsonData = {
              method: method,
              table_name: table,
              id: id,
              action: action || method,
              data: putData,
            };
            break;

          case 'DELETE':
            jsonData = {
              method: method,
              table_name: table,
              id: id,
              action: action || method,
            };
            break;

          default:
            reject(new Error('Método no válido'));
            return;
        }

        const sql = APIUtils.isSafeFromSQLInjection(jsonData.data);

        if (sql) {
          const response = await this.sendAjaxRequest(jsonData);

          setTimeout(() => {
            Utils.mostrarPreloader(false);
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
}

class APIUtils {
  static isSafeFromSQLInjection(data) {
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

      if (this.isBase64Image(item)) {
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

  static isBase64Image(str) {
    return typeof str === "string" && str.startsWith("data:image/");
  }

  static compressAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.onload = function (event) {
        var img = new Image();

        img.onload = function () {
          // Crear un canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, img.width, img.height);

          var base64Image = canvas.toDataURL('image/jpeg', 0.7);

          resolve(base64Image);
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });
  }
}