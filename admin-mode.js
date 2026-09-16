/* =====================================================================
   DARSI — ADMIN TEST MODE
   Loads on the main site ONLY when you have logged into /admin/.
   Normal visitors never see any of this.
   It lets you flip between plans/roles and load demo teachers so you
   can exercise every feature without filling in forms each time.
   ===================================================================== */

function isAdminMode(){
  try{ return localStorage.getItem("darsi_admin_ok") === "1"; }catch(e){ return false; }
}

/* --- Demo teachers: test data, loaded only by you, never shown to visitors --- */
const DEMO_TEACHERS = {
  salma: {
    name:"Ms. Salma Adel", nameAr:"أ. سلمى عادل", initials:"MS", color:"salma", subject:"Math",
    line:"Mathematics · IGCSE & Thanaweya", lineAr:"رياضيات · IGCSE والثانوية العامة",
    tags:["Online","Nasr City","Arabic / English"], tagsAr:["أونلاين","مدينة نصر","عربي / إنجليزي"],
    support:"Visual explanations, short practice sets, and a progress note after each lesson.",
    supportAr:"شرح بصري، وتدريبات قصيرة، وملاحظة تقدم بعد كل درس.",
    rating:"4.9 · 86 reviews", ratingAr:"٤٫٩ · ٨٦ تقييم", price:"EGP 220/hr", priceAr:"٢٢٠ جنيه/ساعة"
  },
  ahmed: {
    name:"Ahmed Khaled", nameAr:"أحمد خالد", initials:"AK", color:"ahmed", subject:"English",
    line:"English · Conversation & IELTS", lineAr:"اللغة الإنجليزية · محادثة و IELTS",
    tags:["Online","Maadi","Adults & teens"], tagsAr:["أونلاين","المعادي","كبار ومراهقين"],
    support:"Goal-based conversations, useful feedback, and simple work between lessons.",
    supportAr:"محادثات مبنية على الأهداف، وملاحظات مفيدة، وتمارين بسيطة بين الدروس.",
    rating:"5.0 · 112 reviews", ratingAr:"٥٫٠ · ١١٢ تقييم", price:"EGP 180/hr", priceAr:"١٨٠ جنيه/ساعة"
  },
  rania: {
    name:"Dr. Rania Nabil", nameAr:"د. رانيا نبيل", initials:"RN", color:"rania", subject:"Chemistry",
    line:"Chemistry · Secondary & IB", lineAr:"كيمياء · ثانوي و IB",
    tags:["Online","6th of October","Exam prep"], tagsAr:["أونلاين","٦ أكتوبر","تحضير امتحانات"],
    support:"Concept maps, worked examples, and a clear revision plan for each student.",
    supportAr:"خرائط مفاهيم، وأمثلة محلولة، وخطة مراجعة واضحة لكل طالب.",
    rating:"4.8 · 64 reviews", ratingAr:"٤٫٨ · ٦٤ تقييم", price:"EGP 250/hr", priceAr:"٢٥٠ جنيه/ساعة"
  }
};

function demoTeachersOn(){
  try{ return localStorage.getItem("darsi_demo_teachers") === "1"; }catch(e){ return false; }
}

function loadDemoTeachers(){
  const grid = document.getElementById("teacherGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;
  const ar = isArabic();

  Object.keys(DEMO_TEACHERS).forEach(function(id){
    if (document.querySelector('.teacher[data-teacher-id="'+id+'"]')) return;
    const d = DEMO_TEACHERS[id];

    // register the profile + empty chat so profile view and chat both work
    teacherProfiles[id] = {
      name: ar ? d.nameAr : d.name, initials: d.initials, color: d.color,
      subject: d.line, subjectAr: d.lineAr,
      location: d.tags[1], locationAr: d.tagsAr[1],
      price: ar ? d.priceAr : d.price, rating: ar ? d.ratingAr : d.rating,
      helps: d.support, helpsAr: d.supportAr,
      style: d.support, styleAr: d.supportAr
    };
    if (!chats[id]) chats[id] = [];

    const card = document.createElement("article");
    card.className = "teacher reveal visible";
    card.dataset.subject = d.subject;
    card.dataset.teacherId = id;

    const tags = (ar ? d.tagsAr : d.tags).map(function(tg){
      return '<span class="tag">' + tg + '</span>';
    }).join("");

    card.innerHTML =
      '<button class="save-btn" onclick="toggleSave(this)">♡</button>' +
      '<div class="teacher-top"><div class="avatar ' + d.color + '">' + d.initials + '</div>' +
      '<div><h3>' + (ar ? d.nameAr : d.name) + '</h3><p style="font-size:12px;color:var(--muted);margin:0">' +
      (ar ? d.lineAr : d.line) + '</p>' +
      '<span class="badge">✓ ' + (ar ? "تم التحقق" : "Verified") + '</span></div></div>' +
      '<div class="teacher-meta">' + tags + '</div>' +
      '<div class="teacher-support"><b>' + (ar ? "كيف يدعم الطلاب" : "How they support students") + '</b>' +
      '<span>' + (ar ? d.supportAr : d.support) + '</span></div>' +
      '<div class="price-row"><span class="rating">★ ' + (ar ? d.ratingAr : d.rating) + '</span>' +
      '<span class="price">' + (ar ? d.priceAr : d.price) + '</span></div>' +
      '<div class="card-actions"><button class="secondary" onclick="showProfile(\'' + id + '\')">' +
      (ar ? "الملف الشخصي" : "Profile") + '</button>' +
      '<button class="primary" onclick="openChat(\'' + id + '\')">' +
      (ar ? "راسل" : "Message") + '</button></div>';

    grid.insertBefore(card, empty);
  });

  try{ localStorage.setItem("darsi_demo_teachers","1"); }catch(e){}
  const active = document.querySelector(".filter.active");
  if (active) filterTeachers(active);
}

function clearDemoTeachers(){
  Array.from(document.querySelectorAll(".teacher[data-teacher-id]")).forEach(function(card){ card.remove(); });
  Object.keys(DEMO_TEACHERS).forEach(function(id){
    delete teacherProfiles[id];
    delete chats[id];
  });
  try{ localStorage.removeItem("darsi_demo_teachers"); }catch(e){}
  closeChat();
  closeProfile();
  const active = document.querySelector(".filter.active");
  if (active) filterTeachers(active);
}

/* --- Admin control panel --- */
function adminSetPlan(plan){
  setCurrentPlan(plan);
  markJoinedDarsi();
  unlockDirectory();
  refreshAdminPanel();
  showToast(t("Plan switched to: ","تم التبديل للخطة: ") + plan);
}

function adminSetRole(role){
  setCurrentRole(role);
  markJoinedDarsi();
  unlockDirectory();
  refreshAdminPanel();
  showToast(t("Role switched to: ","تم التبديل للدور: ") + role);
}

function adminToggleGate(){
  if (hasJoinedDarsi()){
    try{
      localStorage.removeItem("darsi_joined");
      localStorage.removeItem("darsi_active_chat");
    }catch(e){}
    const gate = document.getElementById("directoryGate");
    const content = document.getElementById("directoryContent");
    if (gate) gate.style.display = "flex";
    if (content) content.style.display = "none";
    showToast(t("Gate locked — you now see it as a new visitor.","تم قفل البوابة — دلوقتي بتشوفها زي أي زائر جديد."));
  } else {
    markJoinedDarsi();
    unlockDirectory();
    showToast(t("Gate unlocked.","تم فتح البوابة."));
  }
  refreshAdminPanel();
}

function adminToggleDemo(){
  if (demoTeachersOn()) clearDemoTeachers(); else loadDemoTeachers();
  refreshAdminPanel();
}

function adminResetAll(){
  try{
    ["darsi_joined","darsi_plan","darsi_role","darsi_active_chat",
     "darsi_demo_teachers","darsi_submissions"].forEach(function(k){
      localStorage.removeItem(k);
    });
  }catch(e){}
  location.reload();
}

function adminExitTestMode(){
  try{ localStorage.removeItem("darsi_admin_ok"); }catch(e){}
  location.reload();
}

function refreshAdminPanel(){
  const body = document.getElementById("adminPanelBody");
  if (!body) return;
  const plan = getCurrentPlan();
  const role = getCurrentRole();
  const joined = hasJoinedDarsi();
  const demo = demoTeachersOn();

  function btn(label, fn, on){
    return '<button class="apx' + (on ? " on" : "") + '" onclick="' + fn + '">' + label + '</button>';
  }

  body.innerHTML =
    '<div class="ap-row"><span>' + t("Role","الدور") + '</span><div>' +
      btn(t("Student","طالب"), "adminSetRole('student')", role === "student") +
      btn(t("Teacher","مدرس"), "adminSetRole('teacher')", role === "teacher") +
    '</div></div>' +
    '<div class="ap-row"><span>' + t("Plan","الخطة") + '</span><div>' +
      btn(t("Free","مجاني"), "adminSetPlan('free')", plan === "free") +
      btn("Plus", "adminSetPlan('plus')", plan === "plus") +
      btn("Basic", "adminSetPlan('basic')", plan === "basic") +
      btn("Pro", "adminSetPlan('pro')", plan === "pro") +
    '</div></div>' +
    '<div class="ap-row"><span>' + t("Directory","القائمة") + '</span><div>' +
      btn(joined ? t("Locked view","اقفل البوابة") : t("Unlock","افتح البوابة"), "adminToggleGate()", false) +
    '</div></div>' +
    '<div class="ap-row"><span>' + t("Demo teachers","مدرسين تجريبيين") + '</span><div>' +
      btn(demo ? t("Remove","شيلهم") : t("Load 3","حمّل ٣"), "adminToggleDemo()", demo) +
    '</div></div>' +
    '<div class="ap-foot">' +
      '<button class="apx danger" onclick="adminResetAll()">' + t("Reset all data","امسح كل البيانات") + '</button>' +
      '<button class="apx" onclick="adminExitTestMode()">' + t("Exit test mode","اخرج من وضع التجربة") + '</button>' +
    '</div>';
}

function toggleAdminPanel(){
  document.getElementById("adminPanel").classList.toggle("collapsed");
}

function initAdminMode(){
  if (!isAdminMode()) return;

  const panel = document.createElement("div");
  panel.id = "adminPanel";
  panel.className = "admin-panel collapsed";
  panel.innerHTML =
    '<button class="ap-head" onclick="toggleAdminPanel()">🛠 ' +
    t("Admin test panel","لوحة تجربة الأدمن") + '</button>' +
    '<div id="adminPanelBody" class="ap-body"></div>';
  document.body.appendChild(panel);

  refreshAdminPanel();
  if (demoTeachersOn()) loadDemoTeachers();
}

window.addEventListener("load", initAdminMode);
