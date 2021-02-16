//initialize web3 and connect metamask
var web3, account, fund, newFund; 
$('#loader').hide();

window.addEventListener('load', function() {
  if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' });
	getSelectedAccount();
	
    //fund = new web3.eth.Contract(fundABI, fundMgr);
    //populateFundDetails(fundMgr);
  }
  else {
    console.log('Error: web3 provider not found. Make sure Metamask or the wallet is configured properly. Otherwise, download and install Metamask: https://metamask.io/');
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
  //validate form before submission of contract
  //var form = $('#launchFundForm');
  //if (!form.checkValidity()) {
    //return;
  //}

  //form.classList.add('was-validated');
  
  var _initialAmountInput = $('#initialAmountInput').val();
  var _fundNameInput = $('#fundNameInput').val();
  var _fundSymbolInput = "A" + $('#fundSymbolInput').val();
  var _fundTypeInput = $('#fundTypeInput').val();
  
  newFund = new web3.eth.Contract(fundABI)
  .deploy({
	  data: fundContractBytecode,
	  arguments: [_initialAmountInput, _fundNameInput, _fundSymbolInput, _fundTypeInput]
  })
  .send({ from: account, gas: 3000000, gasPrice: 30*1000000000 })
  //.send({ from: account, gas: 3000000, gasPrice: 30*1000000000 , to: fundMgr, value: 1*100000000000000000})

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
	  populateFundDetails(receipt.status);
	  console.log("Txn successful: "+receipt.status);
    }
    else{
      console.log("there was an error");
    } 
  }).once('error', function(error){console.log(error);});
}

//read
function populateFundDetails(_contractAddress){
  var _fund = new web3.eth.Contract(fundABI, _contractAddress);
  
  $("#fundListing").append("<tr id='"+_contractAddress+"'></tr>");
  
  populateFundName(_fund, _contractAddress);
  populateFundSymbol(_fund, _contractAddress);
  populateBaseCurrency(_fund, _contractAddress)
  //populateFundType(_fund, _contractAddress);
  populateFundTotalSupply(_fund, _contractAddress);
}

function populateFundName(_fund, _contractAddress){
  var _tblHeader = $("#" + _contractAddress).append("<th scope='row'></th>");
  
  _fund.methods.name()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
		_tblHeader.html(result);
      }
      else
      console.error(error);
    }
  );
}

function populateFundSymbol(_fund, _contractAddress){
  var _tblData = $("#" + _contractAddress).append("<td></td>");
  
  _fund.methods.symbol()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
		_tblData.html(result);
      }
      else
      console.error(error);
    }
  );
}

function populateBaseCurrency(_fund, _contractAddress){
	var _tblData = $("#" + _contractAddress).append("<td>"+ "USDT" +"</td>");
}

function populateFundType(_fund, _contractAddress){
  var _tblData = $("#" + _contractAddress).append("<td></td>");
  
  _fund.methods.getFundType()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
        _tblData.html(result);
      }
      else
      console.error(error);
    }
  );
}

function populateFundTotalSupply(_fund, _contractAddress){
  var _tblData = $("#" + _contractAddress).append("<td></td>");
  
  _fund.methods.totalSupply()
  .call({from: account},
    async function(error, result) {
      if (!error){
        console.log(result);
        _tblData.html(result);
      }
      else
      console.error(error);
    }
  );
}