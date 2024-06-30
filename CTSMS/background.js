chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  function sendEmailToSMS(email) {
    const smsContent = `From: ${email.sender}\nSubject: ${email.subject}\nMessage: ${email.body}`;
    
    fetch('https://api.twilio.com/2010-04-01/Accounts/AC0dbdc503904d3064e97d3268f0c12067/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('AC0dbdc503904d3064e97d3268f0c12067:51960db233a0e420e99c6f0aa0be3f33'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'From': '+18446059432',
        'To': '+3147280143',
        'Body': smsContent
      })
    }).then(response => response.json()).then(data => {
      console.log('SMS sent:', data);
    }).catch(error => {
      console.error('Error sending SMS:', error);
    });
  }
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError || !token) {
        console.error(chrome.runtime.lastError);
        return;
      }
  
      fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        const messageId = data.messages[0].id;
        return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      })
      .then(response => response.json())
      .then(message => {
        const email = {
          sender: message.payload.headers.find(header => header.name === 'From').value,
          subject: message.payload.headers.find(header => header.name === 'Subject').value,
          body: message.snippet
        };
        sendEmailToSMS(email);
      })
      .catch(error => {
        console.error('Error fetching email:', error);
      });
    });
  });
  