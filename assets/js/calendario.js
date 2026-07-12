(function () {
  var raiz = document.getElementById('calendario');
  if (!raiz) return;

  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
               'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  var posts = {};        // 'AAAA-MM-DD' -> {url, title}
  var hoje = new Date();
  var ano = hoje.getFullYear();
  var mes = hoje.getMonth();

  function chave(a, m, d) {
    return a + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  function render() {
    var primeiro = new Date(ano, mes, 1).getDay();
    var totalDias = new Date(ano, mes + 1, 0).getDate();
    var hojeChave = chave(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    var html = '<div class="cal-topo">' +
      '<button class="cal-seta" data-dir="-1" aria-label="Mês anterior">‹</button>' +
      '<span class="cal-mes">' + MESES[mes] + ' ' + ano + '</span>' +
      '<button class="cal-seta" data-dir="1" aria-label="Mês seguinte">›</button>' +
      '</div><table class="cal"><thead><tr>';

    for (var i = 0; i < 7; i++) html += '<th scope="col">' + DIAS[i] + '</th>';
    html += '</tr></thead><tbody><tr>';

    for (var v = 0; v < primeiro; v++) html += '<td></td>';

    for (var d = 1; d <= totalDias; d++) {
      var col = (primeiro + d - 1) % 7;
      if (col === 0 && d !== 1) html += '</tr><tr>';
      var k = chave(ano, mes, d);
      var classes = k === hojeChave ? ' class="hoje"' : '';
      if (posts[k]) {
        html += '<td' + classes + '><a href="' + posts[k].url + '" title="' + posts[k].title.replace(/"/g, '&quot;') + '">' + d + '</a></td>';
      } else {
        html += '<td' + classes + '><span>' + d + '</span></td>';
      }
    }
    html += '</tr></tbody></table>';
    raiz.innerHTML = html;

    raiz.querySelectorAll('.cal-seta').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mes += parseInt(btn.dataset.dir, 10);
        if (mes < 0) { mes = 11; ano--; }
        if (mes > 11) { mes = 0; ano++; }
        render();
      });
    });
  }

  fetch(raiz.dataset.feed)
    .then(function (r) { return r.json(); })
    .then(function (lista) {
      lista.forEach(function (p) { posts[p.date] = p; });
      render();
    })
    .catch(render);
})();

(function () {
  var box = document.getElementById('cal-box');
  if (box && window.matchMedia('(max-width: 760px)').matches) box.removeAttribute('open');
})();
