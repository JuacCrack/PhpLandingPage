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
      console.error('Error:', error);
    } 

  });

}

$(function() {
  boxlogin();
});

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

  $('.foot').append('<h4>&copy;Dafood 2023</h4>');

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

    categoriesGet();
    copyright();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function categoriesGet() {


  try {

    const combinedData = {};

    const response = await bridgeToAjax('GET', null, null, 'GETALL');
    console.log(response);

    for (const tableName in response) {
      if (response.hasOwnProperty(tableName)) {
        const valuesResponse = await bridgeToAjax('GET', tableName);
        console.log(valuesResponse);

        combinedData[tableName] = {
          columns: response[tableName],
          values: valuesResponse,
        };
      }
    }

    console.log(combinedData);
    
  var colsvalues = generateInputs(combinedData, true);

  console.log(colsvalues);

  for (const tableName in colsvalues) {
    if (colsvalues.hasOwnProperty(tableName)) {
      const tableInfo = colsvalues[tableName];

      // Crear la tabla HTML
      const tableHTML = `
        <table>
          <thead>
            <tr>
              ${Object.keys(tableInfo).map(columnName => `<th>${columnName}</th>`).join('')}
            </tr>
          </thead>
          <tbody id="tbody-${tableName}">
            ${tableInfo.id.map((value, index) => {
              const rowData = Object.keys(tableInfo).map(columnName => {
                if (tableInfo[columnName][index]?.inputHTML) {
                  return `<td>${tableInfo[columnName][index].inputHTML}</td>`;
                } else {
                  return `<td>${tableInfo[columnName][index]}</td>`;
                }
              }).join('');

              return `<tr>${rowData}</tr>`;
            }).join('')}
          </tbody>
        </table>
      `;

      // Colocar la tabla en su div correspondiente
      const tableContainer = document.querySelector(`.content-table-${tableName}`);
      if (tableContainer) {
        tableContainer.innerHTML = tableHTML;
      }
    }
  }

  } catch (error) {
    console.error('Error:', error);
  }

  $('.delete-btn').click(async function () {

    try {

      const id = $(this).data('id');
  
      const response = await bridgeToAjax('DELETE', 'categories', id);

      console.log(response);
  
      if (response) {
        categoriesGet();
        popup('reply', response.message, response.message, response.status, additionalMessage);
      }

    } catch (error) {
      console.error('Error:', error);
    }

  });

}

function user_front() {
  $('.body').empty();
  $('.head, .foot').css('display', 'none');
  $('.body').removeClass('center').css('height', '100vh');
  $('.head, .foot').css('display', 'none');

  container_home();
  container_menu();
  container_about();
  container_contact();
}

function smoothScrollAnimation(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del enlace

  var href = $(this).attr('href'); // Obtener el valor del atributo href del enlace

  // Animación de desplazamiento suave
  $('html, body').animate({
    scrollTop: $(href).offset().top
  }, 800);
}

function changeBackgroundRandomly() {
  // Lista de imágenes de fondo disponibles
  var backgrounds = ['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg'];

  // Función para cambiar el fondo de .container-home
  function changeBackground() {
    var randomIndex = Math.floor(Math.random() * backgrounds.length); // Obtener un índice aleatorio
    var randomBg = backgrounds[randomIndex]; // Obtener la imagen de fondo aleatoria
    var imagePath = `frontend/img/background/${randomBg}`; // Ruta completa de la imagen
      // Aplicar el fondo aleatorio a .container-home mediante CSS
      $('.container-home').css('background-image', `url(${imagePath})`);
  }

  // Cambiar el fondo cada 3 segundos
  setInterval(changeBackground, 5500);
}

function preloadImages() {
  var backgrounds = ['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg'];
  var images = [];

  for (var i = 0; i < backgrounds.length; i++) {
    images[i] = new Image();
    images[i].src = `frontend/img/background/${backgrounds[i]}`;
  }
}

function container_home() {
  var container_home = `
    <div class="container-home center">
      <div class="main-content">
        <nav class="main-nav">
          <a class="main-btn" href="#about">Nosotros</a>
          <a class="main-btn" href="#menu">Menú</a>
          <a class="main-btn" href="#contact">Contacto</a>
        </nav>
        <h2>Dafood Buffet</h2>
      </div>
    </div>
  `;
  $('.body').append(container_home);

  // Agregar el evento de clic a los enlaces de navegación para llamar a la función de animación
  $('.main-nav a').on('click', smoothScrollAnimation);

  preloadImages();

  // Llamar a la función para cambiar el fondo de .container-home
  changeBackgroundRandomly();

}

function getMenuCategories() {
  return $.ajax({
    url: 'backend/php/backend.php?app=categories&table=categories&method=GET',
    method: 'POST',
    dataType: 'json',
  });
}

function updateMenuCategories(response) {
  console.log(response);

  if (response && response.data && response.data.length > 0) {
    var categoryContent = $('.category-content');
    var html = ''; // Variable para almacenar el HTML de los elementos .category-item

    // Generar dinámicamente los elementos .category-item con el nombre de cada categoría
    for (var i = 0; i < response.data.length; i++) {
      var category = response.data[i];
      var categoryName = category.name;
      var categoryId = category.id;
      var categoryImg = category.image;
      var categoryItem = `
        <div class="category-item" id="${categoryId}" onclick="product_item(${categoryId})" style="background-image: url(frontend/img/compress_img/categories/${categoryImg});">
          <div class="blur"><h1>${categoryName}</h1></div>
        </div>
      `;
      html += categoryItem;
    }

    categoryContent.html(html); // Agregar el HTML generado al contenedor .category-content
  }
}

function container_menu() {
  var container_menu = `
    <div class="container-menu" id="menu">
      <div class="title-align fix">
        <h2>MENÚ</h2>
        <button class="btn-post m-y" id="random">Aleatorio</button>
      </div>
      <div class="category-content">
      </div>
    </div>
  `;
  $('.body').append(container_menu);

  // Realizar la solicitud AJAX para obtener las categorías y actualizar el front-end
  getMenuCategories()
    .done(function (response) {
      updateMenuCategories(response);
    })
    .fail(function (xhr, status, error) {
      var errorMessage = '';
      var statusCode = 500;
      var additionalMessage = '';

      try {
        var response = xhr.responseJSON; // Obtener el objeto de respuesta JSON

        // Verificar si el JSON de error está presente y tiene propiedades accesibles
        if (response && response.error && response.status) {
          errorMessage = response.error; // Acceder al mensaje de error del JSON
          statusCode = response.status; // Acceder al código de estado del JSON
          additionalMessage = response.message; // Acceder al mensaje adicional del JSON
        } else {
          errorMessage = JSON.stringify(xhr); // Mostrar el JSON completo como texto plano
        }
      } catch (err) {
        errorMessage = 'Error en la respuesta del servidor';
      }

      popup('reply', 'Algo salió mal', errorMessage, statusCode, additionalMessage);
    });
}

function product_item(categoryId) {
  // Realizar la solicitud AJAX para obtener los productos relacionados a la categoría
  $.ajax({
    url: 'backend/php/backend.php?app=products&table=products&method=GET',
    method: 'POST',
    data: {
      id: categoryId
    },
    dataType: 'json',
    success: function(response) {
      console.log(response);
      if (response && response.data && response.data.length > 0) {
        popup('item-product', '', '', '', '', '', response);
      } else {
        popup('item-product', '', '', '', '', '', '');
      }
    },
    error: function(xhr, status, error) {
      var errorMessage = '';
      var statusCode = 500;
      var additionalMessage = '';

      try {
        var response = xhr.responseJSON; // Obtener el objeto de respuesta JSON

        // Verificar si el JSON de error está presente y tiene propiedades accesibles
        if (response && response.error && response.status) {
          errorMessage = response.error; // Acceder al mensaje de error del JSON
          statusCode = response.status; // Acceder al código de estado del JSON
          additionalMessage = response.message; // Acceder al mensaje adicional del JSON
        } else {
          errorMessage = JSON.stringify(xhr); // Mostrar el JSON completo como texto plano
        }
      } catch (err) {
        errorMessage = 'Error en la respuesta del servidor';
      }

      popup('reply', 'Algo salió mal', errorMessage, statusCode, additionalMessage);
    }
  });
}

$(document).on('click', '#random', btn_random);

function btn_random() {
  get_random(function(response) {

    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      var randomIndex = Math.floor(Math.random() * response.data.length);
      var randomProduct = response.data[randomIndex];
    
      var alteredResponse = {
        status: response.status,
        data: [randomProduct]
      };
    
      popup('countdown', '', '', '', '', '', '');
    
      setTimeout(function() {
        popup('item-product', '', '', '', '', '', alteredResponse);
      }, 4000); // 4 segundos (4000 milisegundos)
    } else {
      popup('reply', '', '', '', '', '', 'No hay productos disponibles');
    }
  });
}

function get_random(callback) {
  $.ajax({
    url: 'backend/php/backend.php?app=products&table=products&method=GET',
    method: 'POST',
    data: {
      random: true
    },
    dataType: 'json',
    success: function(response) {
      if (typeof callback === 'function') {
        callback(response);
      }
    },
    error: function(xhr, status, error) {
      var errorMessage = '';

      try {
        var response = xhr.responseJSON;
        if (response && response.error && response.status) {
          errorMessage = response.error;
        } else {
          errorMessage = JSON.stringify(xhr);
        }
      } catch (err) {
        errorMessage = 'Error en la respuesta del servidor';
      }

      popup('reply', 'Algo salió mal', errorMessage, 500);
    }
  });
}

function container_about() {
  var container_about = `
    <div class="container-about" id="about">
      <div class="section">
        <div class="section-content">
          <h2 class="section-title">Experiencia culinaria de primera clase</h2>
          <p class="section-description">En nuestra empresa de catering, nos enorgullece ofrecer una experiencia culinaria de primera clase para todo tipo de eventos. Nuestro equipo de chefs expertos utiliza ingredientes frescos y de alta calidad para crear platos deliciosos y visualmente impresionantes.</p>
          <img class="section-image" src="frontend/img/background/bg-1.jpg" alt="Experiencia culinaria">
        </div>
      </div>
      <div class="section">
        <div class="section-content">
          <h2 style="color:black;" class="section-title">Servicio personalizado</h2>
          <p style="color:black;" class="section-description">Entendemos que cada evento es único y especial. Es por eso que ofrecemos un servicio personalizado para satisfacer las necesidades y preferencias de nuestros clientes. Desde menús personalizados hasta opciones dietéticas especiales, nos aseguramos de que cada detalle sea atendido con atención y cuidado.</p>
          <img class="section-image" src="frontend/img/background/bg-2.jpg" alt="Servicio personalizado">
        </div>
      </div>
      <div class="section">
        <div class="section-content">
          <h2 class="section-title">Creatividad en cada plato</h2>
          <p class="section-description">Nuestro equipo de chefs se destaca por su creatividad en cada plato. Desde presentaciones únicas hasta combinaciones de sabores inesperados, cada bocado es una experiencia culinaria emocionante. Nos esforzamos por sorprender y deleitar a nuestros clientes con opciones culinarias innovadoras.</p>
          <img class="section-image" src="frontend/img/background/bg-3.jpg" alt="Creatividad en cada plato">
        </div>
      </div>
    </div>
  `;
  $('.body').append(container_about);
}

function container_contact() {
  var container_home = `
  <div class="container-contact" id="contact">
    <div class="contact-info">
      <div class="contact-item">
        <i class="material-icons">email</i>
        <p>info@dafood.com</p>
      </div>
      <div class="contact-item">
        <i class="material-icons">phone</i>
        <p>+1 123 456 7890</p>
      </div>
      <div class="contact-item">
        <i class="material-icons">location_on</i>
        <p>Ciudad, País</p>
      </div>
      <div class="contact-copyright">
      <p>&copy;Dafood 2023</p>
      </div>
    </div>
  </div>
  `;
  $('.body').append(container_home);

}

function disableBodyOverflow() {
  var hash = window.location.hash;
  var body = document.querySelector('body');
  var closeLink = document.querySelector('.close');

  if (hash === '#popup') {
    body.style.overflow = 'hidden'; // Desactivar el desbordamiento del cuerpo
    closeLink.setAttribute('href', '#menu'); // Cambiar el href de .close a #menu
  } else {
    body.style.overflow = 'auto'; // Restaurar el desbordamiento del cuerpo
    closeLink.setAttribute('href', '#popup'); // Restaurar el href original de .close
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

      if (!alternative) {
        for (const row of tableData) {
          const rowElements = {};

          for (const columnInfo of row) {
            const isExcluded = excludedColumns.some(excludedColumn => (
              excludedColumn.column === columnInfo.column &&
              excludedColumn.type === columnInfo.type &&
              excludedColumn.key === columnInfo.key
            ));

            if (!isExcluded && inputTypes.hasOwnProperty(columnInfo.type)) {
              const inputType = inputTypes[columnInfo.type];
              const columnName = columnInfo.column;

              const inputHTML = `<input type="${inputType}" name="${columnName}" class="input value-${tableName}" placeholder="Enter ${columnName}" required>`;

              rowElements[columnName] = { inputHTML };
            }
          }

          inputElements[tableName].push(rowElements);
        }
     // Resto del código de la función generateInputs...

// Resto del código de la función generateInputs...

// Resto del código de la función generateInputs...

} else {
  for (const tableName in response) {
    if (response.hasOwnProperty(tableName)) {
      const tableData = response[tableName];

      if (!inputElements[tableName]) {
        inputElements[tableName] = [];
      }

      // Verificar si tableData.values no es null ni undefined
      if (tableData.values && tableData.values.length > 0) {
        for (const row of tableData.values) {
          const rowObject = {};

          // Iterar sobre las columnas y sus valores
          for (const columnName in row) {
            if (row.hasOwnProperty(columnName)) {
              const columnValue = row[columnName];
              rowObject[columnName] = columnValue;

              // Verificar si la columna no está excluida
              const isExcluded = excludedColumns.some(excludedColumn => (
                excludedColumn.column === columnName &&
                excludedColumn.type === tableData.columns[columnName].type
              ));

              if (!isExcluded) {
                // Obtener el tipo de input
                const inputType = inputTypes[tableData.columns[columnName].type];

                // Crear el input HTML
                const inputValue = columnValue || ''; // Valor por defecto si es nulo o indefinido
                const inputHTML = `<input type="${inputType}" name="${columnName}" class="input value-${tableName}-${row.id}" placeholder="Enter ${columnName}" value="${inputValue}" data-id="${row.id}">`;

                // Agregar el inputHTML al objeto de la fila
                rowObject[`${columnName}_input`] = inputHTML;
              }
            }
          }

          inputElements[tableName].push(rowObject);
        }
      }
    }
  }
}

// Resto del código de la función generateInputs...


// Resto del código de la función generateInputs...



    }
  }

  return inputElements;
}



function popup(type, title, message, status, detailserror, id, response) {

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
      console.log(response);

      const inputElements = generateInputs(response);
      
      console.log(inputElements);
      
      var html = `
        <h4>Create ${title}</h4>
        <div class="input-grid">
      `;
      
      for (const tableName in inputElements) {
        if (inputElements.hasOwnProperty(tableName)) {
          const tableInfo = inputElements[tableName];
      
          for (const columnName in tableInfo) {
            if (tableInfo.hasOwnProperty(columnName)) {
              const elements = tableInfo[columnName];
      
              elements.forEach(element => {
                if (element.inputHTML) {
                  html += `
                      ${element.inputHTML}
                  `;
                }
              });
            }
          }
        }
      }
      
      html += `
        </div>
        <button class="btn-post post-${title}">Submit</button>
      `;
      
      $('body').on('click', `.post-${title}`, async function () {

          try {
            const response = await bridgeToAjax('POST', `${title}`, null, null, true);
      
            console.log(response);
      
            if (response) {
              categoriesGet();
              popup('reply', 'Categoría agregada con éxito', 'Categoría agregada con éxito', 200);
            }
          } catch (error) {

            console.error('Error al agregar la categoría:', error);
            popup('reply', 'Error al agregar la categoría', 'Ocurrió un error al agregar la categoría', 500);
          }
        });
    
    break;    

    case 'item-product':
    
      if (response === "") {
        html = `<h3>¡Categoría sin productos!</h3>`;
        $('.request-content').css({
          'height': 'auto',
          'width': 'auto'
        });
      } else {
        response.data.forEach(function(product) {
    
          // Obtener los elementos de variety y garrison separados por coma
          var varietyArray = product.variety.split(',').map(function(item) {
            return item.trim(); // Eliminar espacios en blanco alrededor de cada elemento
          });
    
          var garrisonArray = product.garrison.split(',').map(function(item) {
            return item.trim(); // Eliminar espacios en blanco alrededor de cada elemento
          });
    
          // Generar las opciones para variety y garrison
          var varietyOptions = '';
          var garrisonOptions = '';
    
          // Generar opciones para variety
          varietyArray.forEach(function(item) {
            varietyOptions += `<option value="${item}">${item}</option>`;
          });
    
          // Generar opciones para garrison
          garrisonArray.forEach(function(item) {
            garrisonOptions += `<option value="${item}">${item}</option>`;
          });
    
          // Insertar las opciones en los select correspondientes
          var cardHtml = `
            <div class="pc">
                <div class="pi" style="background-image: url(frontend/img/compress_img/products/${product.image});"></div>
              <div class="pd">
                <h3 class="pn">${product.name}</h3>
                <p class="pd">${product.description}</p>
                <div class="ps">
                  <label for="variedad">Variedad:</label>
                  <select id="variedad">
                    ${varietyOptions}
                  </select>
                </div>
                <div class="ps">
                  <label for="guarnicion">Guarnición:</label>
                  <select id="guarnicion">
                    ${garrisonOptions}
                  </select>
                </div>
                <div class="ps">
                  <label for="cantidad">Cantidad:</label>
                  <select id="cantidad">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div class="ps">
                  <label for="bebida">Bebida:</label>
                  <select id="bebida">
                    <option value="Con Bebida">Con Bebida</option>
                    <option value="Sin Bebida">Sin Bebida</option>
                  </select>
                </div>
                <div class="pp">
                  <button class="pr ppr">$${product.price1}</button>
                  <button class="pr apr">$${product.price2}</button>
                </div>
              </div>
            </div>
          `;
    
          html += cardHtml;
        });

        $('.request-content').css({
          'height': '30rem',
          'width': '20rem'
        });

        // Llamar a la función disableBodyOverflow cuando haya un cambio en el hash
        window.addEventListener('hashchange', disableBodyOverflow);

      }

    break;

    case 'countdown':
    
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

  // Limpiar el contenido del elemento con la clase "request-content"
$('.request-content').empty();

// Colocar el nuevo contenido HTML en el elemento deseado
$('.request-content').html(html);

  // Hacer un enlace hash a #popup
  window.location.hash = '#popup';

}

async function sendAjaxRequest(jsonData) {
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
            $(`.value-${table}`).each(function () {
              const fieldName = $(this).attr('name');
              const fieldValue = $(this).val();
              postData[fieldName] = fieldValue;
            });

            if (image) {
              const imageFieldName = 'image';
              const imageFile = $(`.value-${table}[name="${imageFieldName}"]`)[0].files[0];

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
              return $(this).val().trim() !== ''; // Verificar si el valor del campo no está vacío
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
          return; // Importante: salir de la función si el método no es válido
      }

      if (!isSafeFromSQLInjection(jsonData)) {
        console.error('Error: Los datos contienen posibles intentos de inyección SQL.');
        reject('Error de seguridad');
        return;
      }
      const response = await sendAjaxRequest(jsonData);
      resolve(response);

    } catch (error) {
      reject(error);
    }
  });
}

function isSafeFromSQLInjection(jsonData) {
  // Obtener todos los valores del objeto jsonData y mapearlos a cadenas de texto
  const dataArray = Object.values(jsonData).map(value => String(value));

  console.log ()

  // Lista de palabras clave SQL potencialmente peligrosas
  const sqlKeywords = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "UNION", "ALTER",
    "FROM", "WHERE", "OR", "AND", "INTO", "VALUES", "EXECUTE",
    "EXEC", "DECLARE", "xp_", ";", "--", "/*", "*/", "@@", "CHAR(", "NCHAR(",
    "CAST(", "CONVERT(", "CREATE", "TABLE", "DATABASE", "TRUNCATE", "GRANT",
    "REVOKE", "VIEW", "INDEX", "RENAME", "MODIFY", "HAVING", "EXEC sp_", "xp_cmdshell"
  ];

  // Convertir cada elemento del array a minúsculas y verificar si contiene palabras clave SQL
  for (const item of dataArray) {
    const itemString = item.toLowerCase();
    for (const keyword of sqlKeywords) {
      if (itemString.includes(keyword)) {
        return false; // Al menos un elemento contiene una palabra clave SQL peligrosa
      }
    }
  }

  return true; // Ningún elemento del array contiene una palabra clave SQL peligrosa
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


