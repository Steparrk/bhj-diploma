/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
      if(response.success) {
        let selectLink = this.element.querySelector('select');
          selectLink.innerHTML = '';
          response.data.forEach((item) => {
            selectLink.add(new Option(item.name, item.id));
          });
      }else{
        console.log(err)
    }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if(response && response.success) {
        App.update();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
      }else{
        console.log(err)
      }
    })
  }
}