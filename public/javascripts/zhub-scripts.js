function changeBlockStatus(company) {

    var blockButton = document.getElementById('btnBlockStatus');
    var blockBadge = document.getElementById('blockStatus');
    var opt = parseInt(blockButton.value);
    opt === 1 ? opt = true : opt === 0 ? opt = false : opt = "invalid";
    // console.log(blockButton.value);
    console.log(opt);
    if (opt == 'invalid') {

        alert('Invalid operation');
    }
    else {
        $.ajax({
            url: '/admin/block-company/',
            data: {
                company,
                opt,
            },
            method: 'post',
            success: (response) => {
                if (response.status) {
                    if(opt){
                        blockButton.value='0';
                        blockButton.innerHTML="Block"
                        blockButton.classList.remove('primary');
                        blockButton.classList.add('danger');

                        blockBadge.classList.remove('bg-danger');
                        blockBadge.classList.add('bg-success');
                        blockBadge.innerHTML='Active';
                    }
                    else{
                        blockButton.value='1';
                        blockButton.innerHTML="Activate"
                        blockButton.classList.remove('danger');
                        blockButton.classList.add('primary');
                        
                        blockBadge.classList.remove('bg-success');
                        blockBadge.classList.add('bg-danger');
                        blockBadge.innerHTML='Blocked';
                    }
                    
                    
                    // document.getElementById('btnBlock').style.visibility='hidden'
                    // document.getElementById('btnActivate').style.visibility='visible'
                }
            }
        })
    }

}

function registerApi(){
  $.ajax({
      url:'/api/register/',
      method:'POST',
      data:$('#formCreateApi').serialize(),
      success:(response)=>{
          if(!response.status){
              alert(response.err)
          }
          else{
              alert('Your api key is '+response.key+' and is confidential');
              window.location.replace('/');
          }
      }
  })
}