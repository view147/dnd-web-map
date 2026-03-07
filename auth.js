/* =====================
   GENERATE PLAYER CODE
===================== */

function generateCode(){

  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code="PALE-";

  for(let i=0;i<6;i++){

    code+=chars[Math.floor(Math.random()*chars.length)]

  }

  return code
}

/* =====================
   REGISTER
===================== */

window.register=function(){

  const code=generateCode()

  localStorage.setItem("playerCode",code)

  localStorage.setItem("loggedIn","true")

  alert(
  "Player Created!\n\n"+
  "Your Player Code:\n"+
  code+
  "\n\nSave this code!"
  )

  showGame()

}


/* =====================
   LOGIN
===================== */

window.login=function(){

  const input=document.getElementById("playerCode").value.trim()

  const saved=localStorage.getItem("playerCode")

  const msg=document.getElementById("msg")

  if(!saved){

    msg.textContent="❌ No player found. Create one first."

    return
  }

  if(input===saved){

    localStorage.setItem("loggedIn","true")

    showGame()

  }else{

    msg.textContent="❌ Invalid Player Code"

  }

}


/* =====================
   LOGOUT
===================== */

window.logout=function(){

  localStorage.removeItem("loggedIn")

  location.reload()

}


/* =====================
   SHOW GAME
===================== */

function showGame(){

  document.getElementById("loginPage").style.display="none"

  document.getElementById("gamePage").style.display="block"

  document.getElementById("playerId").textContent=
  localStorage.getItem("playerCode")

}


/* =====================
   AUTO LOGIN
===================== */

window.onload=function(){

  if(localStorage.getItem("loggedIn")==="true"){

    showGame()

  }

}
