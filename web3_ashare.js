//initialize web3 and connect metamask
var web3, account, fund; 
$('#loader').hide();

window.addEventListener('load', function() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    account = web3.currentProvider.selectedAddress;
    console.log("connected with: "+account);
    fund = new web3.eth.Contract(fundABI,'0x29d6145d6F3DA561de42E413048EB0dFAE11D9b0');
    getFundName();
  }
  else {
    console.log('Error: web3 provider not found... Make sure metamask or the wallet is configured properly.');
    $('#result').html('<p>Error: web3 provider not found... Make sure metamask or the wallet is configured properly.</p>');
  }
});



//write to BSC and do something with event
function writeMessage(){
  var input = $('#messageInput').val();
  theContract.methods.writeMessage(input)
  .send({ from: account, gas: 3000000, gasPrice: 30*1000000000, value:100000000000000000 })

  .on('transactionHash', function (txHash) {
    console.log("Txn sent. Please wait for confirmation.");
    $('#myBtn').hide();
    $('#loader').show();
    console.log(txHash);
  })
  .once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status == true){

      $('#loader').hide();
      $('#myBtn').show();
      console.log("Txn successful: "+receipt.status);
      //grab message from event
      var message = receipt.events.messageWrite.returnValues['_text'];
      console.log(`new message is: ${message}`);
      $('#message').html(message);
    }
    else{
      console.log("there was an error");
    } 
  }).once('error', function(error){console.log(error);});
}

//read
function getFundName(){
  fund.methods.name()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
        $('#message').html(result);
      }
      else
      console.error(error);
    }
  );
}

function getFundSymbol(){
  fund.methods.symbol()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
        $('#message').html(result);
      }
      else
      console.error(error);
    }
  );
}

function getFundTotalSupply(){
  fund.methods.totalSupply()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
        $('#message').html(result);
      }
      else
      console.error(error);
    }
  );
}