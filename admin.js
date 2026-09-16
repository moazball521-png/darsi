function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function tryAdminLogin(){
  const value = document.getElementById("adminPasswordInput").value;
  if (value === ADMIN_PASSWORD){
    try{
      localStorage.setItem("darsi_admin_ok","1");
      localStorage.setItem("darsi_is_admin","1");
      localStorage.removeItem("darsi_admin_preview");
    }catch(e){}
    showDashboard();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function adminLogout(){
  try{
    localStorage.removeItem("darsi_admin_ok");
    localStorage.removeItem("darsi_is_admin");
    localStorage.removeItem("darsi_admin_preview");
  }catch(e){}
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("adminPasswordInput").value = "";
}

function showDashboard(){
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("walletDisplay").textContent = WALLET_INFO.method + " — " + WALLET_INFO.number;
  renderLocalSubmissions();
}

function renderLocalSubmissions(){
  let list = [];
  try{ list = JSON.parse(localStorage.getItem("darsi_submissions") || "[]"); }catch(e){}
  const container = document.getElementById("localSubmissionsList");
  if (!list.length){
    container.innerHTML = '<p style="color:var(--muted);font-size:12px">مفيش طلبات تجريبية لسه.</p>';
    return;
  }
  container.innerHTML = list.map(function(item){
    const roleLabel = item.role === "teacher" ? "مدرس" : "طالب";
    let paidTag = "";
    if (item.paid){
      paidTag = item.paymentConfirmed
        ? '<span class="tag">دفع متأكد منه</span>'
        : '<span class="tag warn">لسه معلّق</span>';
    }
    const when = item.time ? new Date(item.time).toLocaleString("ar-EG") : "";
    return '<div class="sub-item"><b>' + escapeHtml(item.name) + '</b> ' +
      '<span class="tag">' + roleLabel + '</span>' + paidTag +
      '<br><span style="color:var(--muted)">' +
      escapeHtml(item.email) + ' · ' + escapeHtml(item.phone) + ' · ' + escapeHtml(item.plan) +
      '</span><br><span style="color:var(--muted);font-size:11px">' + when + '</span></div>';
  }).join("");
}

function clearLocalSubmissions(){
  try{ localStorage.removeItem("darsi_submissions"); }catch(e){}
  renderLocalSubmissions();
}

window.addEventListener("load", function(){
  let alreadyIn = false;
  try{ alreadyIn = localStorage.getItem("darsi_admin_ok") === "1"; }catch(e){}
  if (alreadyIn) showDashboard();
});
