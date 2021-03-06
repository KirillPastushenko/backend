const tinymceConfig = {
  selector: 'textarea',
  height: 200,
  setup: editor => editor.on('change', () => editor.save()),
  theme: 'modern',
  plugins: [
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools'
  ]
};

document.addEventListener('readystatechange', ev => {
  if (document.readyState === 'complete') {
    tinymce.init(tinymceConfig);
  }
});

document.querySelector('#add-task').addEventListener('submit', ev => {
  ev.preventDefault();
  //const data = {};
  //$(ev.target).serializeArray().map(x => data[x.name] = x.value);
  const el = $('#message');
  const body = el.find('#message-body');
  body.html('Lodaing...');
  el.modal();
  fetch('/api/task', {
    body: new FormData(ev.target),
    method: 'post'
  }).then(res => !res.ok
      ? Promise.reject(new Error(res.statusText))
      : res.json()
    ).then(data => body.html(data.message))
    .catch(err => body.html(err.message));
  return false;
});
