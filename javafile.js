(() => {
  /** @type {{url: string, thumbnail: string, tags: string[], original: string}[]} */
  let art = undefined;

  window.addEventListener('load', () => {

    document.querySelector('#lightbox > .close').addEventListener('click',() => showSlide());
    fetchArt().then(d => {
      art = JSON.parse(d);
      initFilters();
      initArt();
    });
    //filterSlides();
  });

  function fetchArt() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('load',() => resolve(xhr.response));
      xhr.open('GET','art.json');
      xhr.send();
    });
  }

  function initFilters() {
    let filters = document.querySelectorAll('#art-list > .filters > .filter');
    for (var filter of filters) {
      filter.addEventListener('click', (e) => {
        if (e.target.hasAttribute('selected')) e.target.removeAttribute('selected');
        else e.target.setAttribute('selected','');
        filterArt();
      });
    }
  }

  function initArt() {
    let artlist = document.querySelector('#art-list > .view')
    art.forEach((a,i) => {
      let dom = document.createElement('div');
      let domThumbn = document.createElement('img');
      domThumbn.src = a.thumbnail;
      dom.setAttribute('art-id',i.toString());
      dom.classList.add('entry');
      dom.addEventListener('click', () => showSlide(i));
      dom.append(domThumbn);
      artlist.append(dom);
    });
  }

  function filterArt(inclusive = true) {
    let filters = Array.from(document.querySelectorAll('#art-list > .filters > .filter').values()).map(f => f.hasAttribute('selected')?f.getAttribute('filterid'):undefined).filter(f => f);
    let artdoms = document.querySelectorAll('#art-list > .view > .entry');
    for (var a of artdoms) {
      let tags = art[parseInt(a.getAttribute('art-id'))].tags;
      if (filters.length < 1 || (inclusive?filters.some(f => tags.includes(f)):filters.every(f => tags.includes(f)))) a.style.display = 'block';
      else a.style.display = 'none';
    }
  }

  function showSlide(i) {
    let modalc = document.querySelector('#lightbox > .modal-content')
    modalc.innerHTML = "";
    if (i === undefined) {
      document.getElementById('lightbox').style.display = 'none';
      return;
    }
    let maxi = art.length;
    let domHead = document.createElement('div');
    domHead.classList.add('modal-head');
    let domIndex = document.createElement('div');
    domIndex.innerText = `${i+1} / ${maxi}`;
    let domLink = document.createElement('a');
    domLink.innerText = `Open original`;
    domLink.href = art[i].original;
    domLink.target = '_blank';
    let domImg = document.createElement('div');
    domImg.classList.add('modal-img');
    let domImgs = document.createElement('img');
    domImgs.src = art[i].url;
    domImgs.alt = 'checkme';
    domImg.append(domImgs);
    domHead.append(domIndex,domLink);
    modalc.append(domHead,domImg);
    document.getElementById('lightbox').style.display = 'block';
  }
})();