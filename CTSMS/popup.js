document.addEventListener('DOMContentLoaded', (event) => {
    const sendSMSButton = document.getElementById('sendSMSButton');
    
    if (sendSMSButton) {
      sendSMSButton.addEventListener('click', () => {
        console.log('Send SMS button clicked');
       ////What comes next??///
      });
    } else {
      console.error('Element with ID "sendSMSButton" not found.');
    }
  });
  