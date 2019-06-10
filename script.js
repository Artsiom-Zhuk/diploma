const config = {
  apiKey: 'AIzaSyCRm-aHbaF-cg9nsHNwxyWGdgnUM95VoDc',
  authDomain: 'accounting-technology.firebaseapp.com',
  databaseURL: 'https://accounting-technology.firebaseio.com',
  projectId: 'accounting-technology',
  storageBucket: '',
  messagingSenderId: '1079443672124',
};

firebase.initializeApp(config);
const database = firebase.database();
const inputForm = document.getElementById('inputForm');
const tbody = document.getElementById('tbody');
const inputCategory = document.getElementById('category');
const inputModel = document.getElementById('model');
const inputWeight = document.getElementById('weight');
const inputLength = document.getElementById('length');
const inputWidth = document.getElementById('width');
const inputHeight = document.getElementById('height');
const inputDateOfManufacture = document.getElementById('dateOfManufacture');
const inputCost = document.getElementById('cost');
const submitBtn = document.getElementById('submitBtn');
const searchCategory = document.getElementById('searchCategory');
const searchModel = document.getElementById('searchModel');
const btnCancelChange = document.getElementById('btnCancelChange');
const txtArea = document.getElementById('txtArea');

let isEdit = false;
let editKey = null;
let searchCategoryText = '';
let searchModelText = '';
let currentUser = null;

function isDisabled() {
  btnCancelChange.disabled = true;
}

function isNotDisabled() {
  btnCancelChange.disabled = false;
}

function renderTable() {
  if(window.user){
    currentUser = window.user.email.match(/[0-9A-Za-z]/g).join('');
  }
    
  database
    .ref()
    .once('value')
    .then((e) => {
      const data = e.val();
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      for (const key in data[`technique-${currentUser}`]) {
        const propDataLeadsByKey = data[`technique-${currentUser}`][key];
        if (
          ~propDataLeadsByKey.category.indexOf(searchCategoryText) &&
          ~propDataLeadsByKey.model.indexOf(searchModelText)
        ) {
          const tr = document.createElement('tr');
          const btnDel = document.createElement('input');
          btnDel.setAttribute('type', 'button');
          btnDel.setAttribute('value', 'Удалить');
          btnDel.addEventListener('click', () => {
            database.ref(`technique-${currentUser}/${key}`).remove();
            database.ref(`moreInf-${currentUser}/${key}`).remove();
            alert('Данные были успешно удалены');
            isDisabled();
            renderTable();
          });

          const btnChange = document.createElement('input');
          btnChange.setAttribute('type', 'button');
          btnChange.setAttribute('value', 'Изменить');
          btnChange.addEventListener('click', () => {
            inputCategory.value = propDataLeadsByKey.category;
            inputModel.value = propDataLeadsByKey.model;
            inputWeight.value = propDataLeadsByKey.weight;
            inputLength.value = propDataLeadsByKey.length;
            inputWidth.value = propDataLeadsByKey.width;
            inputHeight.value = propDataLeadsByKey.height;
            inputDateOfManufacture.value = propDataLeadsByKey.dateOfManufacture;
            inputCost.value = propDataLeadsByKey.cost;
            txtArea.value = data[`moreInf-${currentUser}`][key].inf;
            isEdit = true;
            editKey = key;
            submitBtn.setAttribute('value', 'Доб. измен.');
            isNotDisabled();
          });

          const moreInf = document.createElement('input');
          moreInf.setAttribute('type', 'button');
          moreInf.setAttribute('value', 'Смотреть');
          moreInf.addEventListener('click', () => {
            const containerModalWindow = document.createElement('div');
            containerModalWindow.setAttribute('class', 'containerModalWindow');
            document.body.appendChild(containerModalWindow);
            const modalWindow = document.createElement('div');
            modalWindow.setAttribute('class', 'modalWindow');
            containerModalWindow.appendChild(modalWindow);
            const conteinerForContent = document.createElement('div');
            conteinerForContent.setAttribute('class', 'conteinerForContent');
            const textArea = document.createElement('textarea');
            textArea.setAttribute('class', 'textArea');
            textArea.disabled = 'disable';
            textArea.innerHTML = data[`moreInf-${currentUser}`][key].inf;
            conteinerForContent.appendChild(textArea);
            modalWindow.appendChild(conteinerForContent);
            const conteinerForButton = document.createElement('div');
            conteinerForButton.setAttribute('class', 'conteinerForButton');
            modalWindow.appendChild(conteinerForButton);
            const btnExit = document.createElement('input');
            btnExit.setAttribute('type', 'button');
            btnExit.setAttribute('value', 'Закрыть');
            btnExit.setAttribute('class', 'btnExit');
            conteinerForButton.appendChild(btnExit);
            const x = window.scrollX;
            const y = window.scrollY;
            window.onscroll = function(){
              window.scrollTo(x, y);
            };
            btnExit.addEventListener('click', deleteNode);
            function deleteNode(){
              btnExit.removeEventListener('click', deleteNode);
              window.onscroll = null;
              containerModalWindow.remove();
            }  
          });

          btnCancelChange.addEventListener('click', () => {
            submitBtn.setAttribute('value', 'Добавить');
            isEdit = false;
            editKey = null;
            inputCategory.value = '';
            inputModel.value = '';
            inputWeight.value = '';
            inputLength.value = '';
            inputWidth.value = '';
            inputHeight.value = '';
            inputDateOfManufacture.value = '';
            inputCost.value = '';
            txtArea.value = ''; 
            isDisabled();
          });

          const tdCategory = document.createElement('td');
          const tdModel = document.createElement('td');
          const tdWeight = document.createElement('td');
          const tdLength = document.createElement('td');
          const tdWidth = document.createElement('td');
          const tdHeight = document.createElement('td');
          const tdDateOfManufacture = document.createElement('td');
          const tdCost = document.createElement('td');
          const tdDelete = document.createElement('td');
          const tdChange = document.createElement('td');
          const tdMoreInf = document.createElement('td');

          tdCategory.innerHTML = propDataLeadsByKey.category;
          tdModel.innerHTML = propDataLeadsByKey.model;
          tdWeight.innerHTML = propDataLeadsByKey.weight;
          tdLength.innerHTML = propDataLeadsByKey.length;
          tdWidth.innerHTML = propDataLeadsByKey.width;
          tdHeight.innerHTML = propDataLeadsByKey.height;
          tdDateOfManufacture.innerHTML = propDataLeadsByKey.dateOfManufacture;
          tdCost.innerHTML = propDataLeadsByKey.cost;

          tdDelete.appendChild(btnDel);
          tdChange.appendChild(btnChange);
          tdMoreInf.appendChild(moreInf);
          tr.appendChild(tdCategory);
          tr.appendChild(tdModel);
          tr.appendChild(tdWeight);
          tr.appendChild(tdLength);
          tr.appendChild(tdWidth);
          tr.appendChild(tdHeight);
          tr.appendChild(tdDateOfManufacture);
          tr.appendChild(tdCost);
          tr.appendChild(tdDelete);
          tr.appendChild(tdChange);
          tr.appendChild(tdMoreInf);
  
          tbody.appendChild(tr);
        }
      }
    });
}

inputForm.addEventListener('submit', (event) => {
  
  if(!window.user){
    alert('Войдите в аккаунт');
  } else {
    event.preventDefault();
    const category = inputCategory.value;
    const model = inputModel.value;
    const weight = inputWeight.value;
    const length = inputLength.value;
    const width = inputWidth.value;
    const height = inputHeight.value;
    const dateOfManufacture = inputDateOfManufacture.value;
    const cost = inputCost.value;
    const inf = txtArea.value;  
  
    let key;
  
    if (isEdit) {
      key = editKey;
    } else {
      key = database
        .ref()
        .child(`technique-${currentUser}`)
        .push().key;
    }
  
    database.ref(`technique-${currentUser}/${key}/category`).set(category);
    database.ref(`technique-${currentUser}/${key}/model`).set(model);
    database.ref(`technique-${currentUser}/${key}/weight`).set(weight);
    database.ref(`technique-${currentUser}/${key}/length`).set(length);
    database.ref(`technique-${currentUser}/${key}/width`).set(width);
    database.ref(`technique-${currentUser}/${key}/height`).set(height);
    database.ref(`technique-${currentUser}/${key}/dateOfManufacture`).set(dateOfManufacture);
    database.ref(`technique-${currentUser}/${key}/cost`).set(cost);
    database.ref(`moreInf-${currentUser}/${key}/inf`).set(inf);
  
    alert('Данные отправлены на сервер');
    renderTable();
    isEdit = false;
    editKey = null;
    submitBtn.setAttribute('value', 'Добавить');
    isDisabled();
  }

});

renderTable();

searchCategory.addEventListener('input', (event) => {
  searchCategoryText = event.target.value;
  renderTable();
});

searchModel.addEventListener('input', (event) => {
  searchModelText = event.target.value;
  renderTable();
});

const resetCategory = document.getElementById('resetCategory');
resetCategory.addEventListener('click', () => {
  searchCategoryText = '';
  searchCategory.value = '';
  renderTable();
});

const resetModel = document.getElementById('resetModel');
resetModel.addEventListener('click', () => {
  searchModelText = '';
  searchModel.value = '';
  renderTable();
});
