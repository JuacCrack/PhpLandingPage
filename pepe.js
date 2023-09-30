async function getAll() {
    try {
      const combinedDatavalues = await combinedData();
      generateTable(combinedDatavalues);
  
      $(document).off('click', `.delete-btn`).on('click', `.delete-btn`, async function () {
        try {
          const id = $(this).data('id');
          const table = $(this).data('table');
          const response = await bridgeToAjax('DELETE', table, id);
          if (response) {
            getAll();
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
          const imagebool = await checkImageColumn(table);
          const response = await bridgeToAjax('PUT', table, id, null, imagebool);
          if (response) {
            getAll();
            popup('reply', response.message, response.message, response.status);
          }
        } catch (error) {
          popup('reply', 'No se pudo actualizar el registro', error, 500);
        }
      });
    } catch (error) {
      console.log(error);
      popup('reply', 'No se pudieron cargar los datos de las tablas', error, 500);
    }
}