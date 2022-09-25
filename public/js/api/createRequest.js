/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let url = options.url;
    let formData = null;
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    if(options.data) {
        if(options.method === 'GET') {
            url += '?' + Object.entries(options.data).map(e => e.map(encodeURIComponent).join('=')).join('&');
        }else{
            formData = new FormData();
            Object.entries(options.data).forEach(el => formData.append(...el));
        }
    }

    xhr.onerror = () => {
        alert(`Ошибка соединения`);
    };

    if(options.callback){
        xhr.onload = () => {
            let err = null;
            let response = null;

            try{
                if(xhr.response?.success){
                    response = xhr.response;
                }else{
                    err = xhr.response;
                }
            }catch(e){
                err = e;
            }
            options.callback(err, response);
        }
    }
    
    try{
        xhr.open(options.method, url);
        xhr.send(formData);
    }catch(e){
        callback(e);
    }
};
