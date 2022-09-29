/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

 class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('element is not exist');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.querySelector('.create-account').onclick = e => {
      App.getModal('createAccount').open();
    }
    this.menuItem = Array.from(this.element.querySelectorAll('.account'));
    this.menuItem.forEach(item => 
      this.element.addEventListener('click', e => {
        e.preventDefault();
        if(item !== e.target.closest('.account')) {
          return;
        }
        this.onSelectAccount(item);
      })
      )
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()) {
      Account.list(User.current(), (err, response) => {
        if(response && response.success) {
          this.clear();
          this.renderItem(response.data);
          this.registerEvents();
        }else{
          console.log(err)
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.menuItem.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    this.menuItem.forEach(item => {
      if(item.classList.contains('active')) { 
        item.classList.remove('active')  
      }
    })

    element.classList.add('active');
    
    App.showPage('transactions', {
      account_id: element.dataset.id
    });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const activeAccountConteiner = document.createElement('li');
    activeAccountConteiner.className = 'account';
    activeAccountConteiner.dataset.id = item.id;
    this.element.append(activeAccountConteiner);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', '#');
    this.element.lastChild.append(linkElement);

    const spanElement = document.createElement('span');
    spanElement.textContent = item.name + ' / ';
    this.element.lastChild.querySelector('a').append(spanElement);

    const spanSumElement = document.createElement('span');
    spanSumElement.textContent = item.sum + ' Р';
    this.element.lastChild.querySelector('a').append(spanSumElement);
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    data.forEach(item => this.getAccountHTML(item))
  }
}