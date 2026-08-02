function pad(n){ return n.toString().padStart(2,'0'); }

function makeOrderId(prefix){
  var d = new Date();
  var datePart = pad(d.getDate()) + pad(d.getMonth()+1) + d.getFullYear().toString().slice(-2);
  var num = Math.floor(Math.random()*900 + 100);
  return prefix + '-' + datePart + '-' + num;
}

function initOrderPage(config){
  // config: { prefix, serviceLabel, mailTo, fields: [{id, label}] }
  var orderIdEl = document.getElementById('orderIdText');
  var orderId = makeOrderId(config.prefix);
  if(orderIdEl){ orderIdEl.textContent = orderId; }

  var payCheckbox = document.getElementById('paidConfirm');
  var submitBtn = document.getElementById('submitOrderBtn');
  if(payCheckbox && submitBtn){
    submitBtn.disabled = true;
    payCheckbox.addEventListener('change', function(){
      submitBtn.disabled = !payCheckbox.checked;
    });
  }

  var form = document.getElementById('orderForm');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();

    if(payCheckbox && !payCheckbox.checked){
      payCheckbox.focus();
      return;
    }

    var lines = ['Order ID: ' + orderId, 'Service: ' + config.serviceLabel];
    config.fields.forEach(function(f){
      var el = document.getElementById(f.id);
      var val = el ? el.value : '';
      lines.push(f.label + ': ' + (val || '-'));
    });

    lines.push('');
    lines.push('Payment: Confirmed by customer via UPI/cash before sending');
    lines.push('');
    lines.push('(Attach the file in Gmail before sending this email — PDF, JPG or PNG)');

    var body = lines.join('\n');
    var subject = 'New Order ' + orderId + ' — ' + config.serviceLabel;

    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(config.mailTo)
      + '&su=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    window.open(url, '_blank');
  });
}
