firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.user = user;
    database.ref().once('value').then((e) => {
      database.ref(`users/${user.email.match(/[0-9A-Za-z]/g).join('')}`).set(user.email.match(/[0-9A-Za-z]/g).join(''));
    });  
    renderTable();
    document.getElementById('admin').style.display = 'block';
    document.getElementById('login_div').style.display = 'none';
    document.body.style.backgroundColor = 'white';
    document.getElementById('email_field').value = '';
    document.getElementById('password_field').value = '';
  } else {
    document.getElementById('admin').style.display = 'none';
    document.getElementById('login_div').style.display = 'block';
  }
});

function login() {
  const userEmail = document.getElementById('email_field').value;
  const userPass = document.getElementById('password_field').value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch((error) => {
    alert(`Вы ввели неверные данные`);
  });
}

function logout() {
  document.body.style.backgroundColor = 'cornflowerblue';
  window.user = null;
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  document.getElementById('resetForm').click();
  firebase.auth().signOut();
}
