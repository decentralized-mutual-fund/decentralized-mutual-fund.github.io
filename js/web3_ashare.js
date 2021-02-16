//initialize web3 and connect metamask
var web3, account, fund, newFund; 
$('#loader').hide();

window.addEventListener('load', function() {
  if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' });
	getSelectedAccount();
	
    //fund = new web3.eth.Contract(fundABI, fundMgr);
    //getFundName();
  }
  else {
    console.log('Error: web3 provider not found. Make sure Metamask or the wallet is configured properly. Otherwise, download and install Metamask: <a href="https://metamask.io/">https://metamask.io/</a>');
    $('#result').html('<div class="alert alert-danger alert-dismissible fade show" role="alert"><p>Error: Make sure your Metamask configured correctly. You may download and install Metamask here: <a href="https://metamask.io/">https://metamask.io/</a></p></div>');
  }
});

async function getSelectedAccount(){
	// "currently selected" address is the first item in the array returned by eth_accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
	account = accounts[0];
    console.log("connected with: "+account);
}

//write to BSC and do something with event
function createFund(){
  var _initialAmountInput = $('#initialAmountInput').val();
  var _fundNameInput = $('#fundNameInput').val();
  var _fundSymbolInput = "A" + $('#fundSymbolInput').val();
  var _fundTypeInput = $('#fundTypeInput').val();
  
  newFund = new web3.eth.Contract(fundABI)
  .deploy({
	  data: fundContractBytecode,
	  arguments: [_initialAmountInput, _fundNameInput, _fundSymbolInput, _fundTypeInput]
  })
  .send({ from: account, gas: 3000000, gasPrice: 30*1000000000 , to: fundMgr, value: 1*100000000000000000})

  .on('transactionHash', function (txHash) {
    console.log("Txn sent. Please wait for confirmation.");
    $('#createFundBtn').hide();
    $('#loader').show();
	$('#result').html('<div class="alert alert-primary alert-dismissible fade show" role="alert"><p>Txn sent and pending confirmation. Check your transaction status <a href="'+bscScanURL+'/tx/'+txHash+'">here</a></p></div>');
    console.log(txHash);
  })
  .once('confirmation', function(confNumber, receipt){ 
    console.log(receipt.status);
    if(receipt.status == true){

      $('#loader').hide();
      $('#createFundBtn').show();
      $('#result').html('<div class="alert alert-success alert-dismissible fade show" role="alert"><p>Mutual fund successfully created. Check your transaction status <a href="'+bscScanURL+'/tx/'+receipt.status+'">here</a></p></div>');
	  console.log("Txn successful: "+receipt.status);
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