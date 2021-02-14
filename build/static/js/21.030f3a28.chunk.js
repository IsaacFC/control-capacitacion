(this["webpackJsonpcontrol-capacitacion"]=this["webpackJsonpcontrol-capacitacion"]||[]).push([[21],{1328:function(e,a,t){"use strict";t.r(a);var n=t(28),r=t(25),o=t(2),i=t(0),l=t(198),c=t(841),s=t.n(c),d=t(518),m=t(586),u=t(1329),p=t(427),f=t(520),b=t(318),h=t(85),g=t.n(h),j={name:"",firstLastName:"",secondLastName:"",email:"",phoneNumber:"",plaza:"",gender:"",department:""};a.default=function(e){var a=Object(i.useState)({openSnackBar:!1,snackBarMessage:"",severity:""}),t=Object(r.a)(a,2),c=t[0],h=t[1],C=Object(i.useState)(!1),O=Object(r.a)(C,2),v=O[0],N=O[1];Object(i.useLayoutEffect)((function(){x()}),[]);var x=function(){N((function(e){return!e})),g.a.get("/api/profile-config").then((function(e){S({name:e.data.name,firstLastName:e.data.firstLastName,secondLastName:e.data.secondLastName,email:e.data.email,phoneNumber:e.data.phoneNumber,plaza:e.data.plaza,gender:e.data.gender,department:e.data.department}),N((function(e){return!e}))})).catch((function(e){N((function(e){return!e})),e.response?h({openSnackBar:!0,severity:"error",snackBarMessage:e.response.data.message}):e.request?window.alert("Error: "+e.request.data.message):console.log("Error: "+e.message),console.log(e.config)}))},L=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:I,a=Object(n.a)({},A);if("name"in e&&(a.name=e.name?"":"Campo requerido"),"firstLastName"in e&&(a.firstLastName=e.firstLastName?"":"Campo requerido"),"secondLastName"in e&&(a.secondLastName=e.secondLastName?"":"Campo requerido"),"plaza"in e&&(a.plaza=e.plaza?"":"Campo requerido"),"phoneNumber"in I&&(a.phoneNumber=I.phoneNumber?/^(\d{10}|\d{11}|\d{12})$/.test(I.phoneNumber)?a.phoneNumber="":a.phoneNumber="N\xfamero debe contener entre 10 y 12 d\xedgitos":a.phoneNumber="Campo obligatorio"),"email"in e&&(a.email=e.email?/$^|.+@.+..+/.test(I.email)?a.email="":a.email="Email no valido":a.email="Campo obligatorio"),"gender"in e&&(a.gender=e.gender?"":"Campo requerido"),"department"in e&&(a.department=e.department?"":"Campo requerido"),M(Object(n.a)({},a)),e==I)return Object.values(a).every((function(e){return""==e}))},E=Object(p.b)(j,!0,L),I=E.values,S=E.setValues,A=E.errors,M=E.setErrors,y=E.handleInputChange,k=Object(o.jsxs)(p.a,{className:s.a.form,onSubmit:function(e){if(e.preventDefault(),L()){N((function(e){return!e}));var a={name:I.name,firstLastName:I.firstLastName,secondLastName:I.secondLastName,email:I.email,phoneNumber:I.phoneNumber,plaza:I.plaza,gender:I.gender,department:I.department};g.a.post("/auth/profile-config",a).then((function(e){N((function(e){return!e})),h({openSnackBar:!0,severity:"success",snackBarMessage:"Datos registrados correctamente"})})).catch((function(e){e.response?h({openSnackBar:!0,severity:"error",snackBarMessage:e.response.data.message}):e.request?window.alert("Error: "+e.request.data.message):console.log("Error: "+e.message),console.log(e.config)}))}},children:[Object(o.jsx)("h1",{children:"Datos del participante"}),Object(o.jsx)("p",{style:{textDecoration:"underline"},children:"Es necesario llenar sus datos para inscribirse a un curso"}),Object(o.jsxs)(u.a,{container:!0,children:[Object(o.jsxs)(u.a,{item:!0,xs:6,children:[Object(o.jsx)(d.a,{name:"name",placeholder:"Nombre",label:"Nombre",value:I.name||"",onChange:y,inputProps:{maxLength:50},error:A.name}),Object(o.jsx)(d.a,{name:"firstLastName",placeholder:"Apellido paterno",label:"Apellido materno",value:I.firstLastName||"",onChange:y,inputProps:{maxLength:20},error:A.firstLastName}),Object(o.jsx)(d.a,{name:"secondLastName",placeholder:"Apellido materno",label:"Apellido materno",value:I.secondLastName||"",onChange:y,inputProps:{maxLength:20},error:A.secondLastName}),Object(o.jsx)(d.a,{name:"email",placeholder:"Email",label:"Email",value:I.email?I.email.replace(/\s/g,""):I.email||"",onChange:y,inputProps:{maxLength:100},error:A.email})]}),Object(o.jsxs)(u.a,{item:!0,xs:6,children:[Object(o.jsx)(d.a,{name:"phoneNumber",placeholder:"Telefono",label:"Telefono",type:"number",value:I.phoneNumber||"",onChange:y,error:A.phoneNumber,inputProps:{onWheel:function(e){return e.currentTarget.blur()},min:0}}),Object(o.jsx)(d.a,{name:"plaza",placeholder:"Plaza",label:"Plaza",value:I.plaza||"",onChange:y,inputProps:{maxLength:15},error:A.plaza}),Object(o.jsx)(m.a,{name:"gender",label:"Genero",options:[{id:"F",title:"F"},{id:"M",title:"M"}],value:I.gender||"",onChange:y,error:A.gender}),Object(o.jsx)(m.a,{name:"department",label:"Departamento",options:[{id:"EL\xc9CTRICA, ELECTR\xd3NICA, BIOM\xc9DICA",title:"EL\xc9CTRICA, ELECTR\xd3NICA, BIOM\xc9DICA"},{id:"SISTEMAS E INFORM\xc1TICA",title:"SISTEMAS E INFORM\xc1TICA"},{id:"METAL MEC\xc1NICA Y AERON\xc1UTICA",title:"METAL MEC\xc1NICA Y AERON\xc1UTICA"},{id:"INDUSTRIAL",title:"INDUSTRIAL"},{id:"CIENCIAS B\xc1SICAS",title:"CIENCIAS B\xc1SICAS"},{id:"ECON\xd3MICO ADMINISTRATIVO",title:"ECON\xd3MICO ADMINISTRATIVO"}],value:I.department||"",onChange:y,error:A.department})]})]}),Object(o.jsxs)(u.a,{children:[Object(o.jsx)(l.a,{fullWidth:!0,variant:"contained",color:"primary",className:s.a.submit,style:{marginTop:"15px"},onClick:function(){e.history.push("/profile-config/change-password")},children:"Cambiar contrase\xf1a"}),Object(o.jsx)(l.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:s.a.submit,style:{marginTop:"15px"},children:"Guardar"})]})]});return v&&(k=Object(o.jsx)(b.a,{})),Object(o.jsxs)("div",{className:s.a.paper,children:[k,Object(o.jsx)(f.a,{openSnackBar:c.openSnackBar,closeSnackBar:function(){return h({openSnackBar:!1})},snackBarMessage:c.snackBarMessage,severity:c.severity})]})}},318:function(e,a,t){"use strict";var n=t(2),r=t(424),o=t.n(r);a.a=function(){return Object(n.jsx)("div",{className:o.a.loader,children:"Loading..."})}},424:function(e,a,t){e.exports={loader:"Spinner_loader__1sqt0",load7:"Spinner_load7__iTAw0"}},427:function(e,a,t){"use strict";t.d(a,"b",(function(){return d})),t.d(a,"a",(function(){return u}));var n=t(3),r=t(16),o=t(28),i=t(25),l=t(2),c=t(0),s=t(197);function d(e){var a=Object(c.useState)(e),t=Object(i.a)(a,2),n=t[0],l=t[1],s=Object(c.useState)({}),d=Object(i.a)(s,2),m=d[0],u=d[1];return{values:n,setValues:l,errors:m,setErrors:u,handleInputChange:function(e){var a=e.target,t=a.name,i=a.value;l(Object(o.a)(Object(o.a)({},n),{},Object(r.a)({},t,i)))},resetForm:function(){l(e),u({})}}}var m=Object(s.a)((function(e){return{root:{"& .MuiFormControl-root":{width:"80%",margin:e.spacing(1)}}}}));function u(e){var a=m(),t=(e.children,Object(n.a)(e,["children"]));return Object(l.jsx)("form",Object(o.a)(Object(o.a)({className:a.root,autoComplete:"off"},t),{},{children:e.children}))}},514:function(e,a,t){"use strict";var n=t(0),r=t(228);a.a=Object(r.a)(n.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},518:function(e,a,t){"use strict";t.d(a,"a",(function(){return l}));var n=t(28),r=t(2),o=(t(0),t(434)),i={width:"85%",margin:"15px"};function l(e){var a=e.name,t=e.label,l=e.placeholder,c=e.value,s=e.error,d=void 0===s?null:s,m=e.onChange,u=e.type,p=e.disabled,f=e.inputProps,b=e.InputLabelProps,h=e.className;return Object(r.jsx)(o.a,Object(n.a)({className:h,disabled:p,style:i,variant:"outlined",label:t,placeholder:l,name:a,value:c,onChange:m,type:u,inputProps:f,InputLabelProps:b},d&&{error:!0,helperText:d}))}},520:function(e,a,t){"use strict";var n=t(28),r=t(2),o=(t(0),t(842)),i=t(582),l=function(e){return Object(r.jsx)(i.a,Object(n.a)({elevation:6,variant:"filled"},e))};a.a=function(e){var a=e.openSnackBar,t=e.closeSnackBar,n=e.snackBarMessage,i=e.severity;return Object(r.jsx)(o.a,{anchorOrigin:{vertical:"bottom",horizontal:"right"},open:a,autoHideDuration:6e3,onClose:t,children:Object(r.jsx)(l,{onClose:t,severity:i,children:n})})}},582:function(e,a,t){"use strict";var n=t(3),r=t(1),o=t(0),i=(t(5),t(4)),l=t(14),c=t(6),s=t(68),d=t(228),m=Object(d.a)(o.createElement("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),u=Object(d.a)(o.createElement("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),p=Object(d.a)(o.createElement("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),f=Object(d.a)(o.createElement("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),b=t(514),h=t(200),g=t(10),j={success:o.createElement(m,{fontSize:"inherit"}),warning:o.createElement(u,{fontSize:"inherit"}),error:o.createElement(p,{fontSize:"inherit"}),info:o.createElement(f,{fontSize:"inherit"})},C=o.createElement(b.a,{fontSize:"small"}),O=o.forwardRef((function(e,a){var t=e.action,l=e.children,c=e.classes,d=e.className,m=e.closeText,u=void 0===m?"Close":m,p=e.color,f=e.icon,b=e.iconMapping,O=void 0===b?j:b,v=e.onClose,N=e.role,x=void 0===N?"alert":N,L=e.severity,E=void 0===L?"success":L,I=e.variant,S=void 0===I?"standard":I,A=Object(n.a)(e,["action","children","classes","className","closeText","color","icon","iconMapping","onClose","role","severity","variant"]);return o.createElement(s.a,Object(r.a)({role:x,square:!0,elevation:0,className:Object(i.a)(c.root,c["".concat(S).concat(Object(g.a)(p||E))],d),ref:a},A),!1!==f?o.createElement("div",{className:c.icon},f||O[E]||j[E]):null,o.createElement("div",{className:c.message},l),null!=t?o.createElement("div",{className:c.action},t):null,null==t&&v?o.createElement("div",{className:c.action},o.createElement(h.a,{size:"small","aria-label":u,title:u,color:"inherit",onClick:v},C)):null)}));a.a=Object(c.a)((function(e){var a="light"===e.palette.type?l.a:l.i,t="light"===e.palette.type?l.i:l.a;return{root:Object(r.a)({},e.typography.body2,{borderRadius:e.shape.borderRadius,backgroundColor:"transparent",display:"flex",padding:"6px 16px"}),standardSuccess:{color:a(e.palette.success.main,.6),backgroundColor:t(e.palette.success.main,.9),"& $icon":{color:e.palette.success.main}},standardInfo:{color:a(e.palette.info.main,.6),backgroundColor:t(e.palette.info.main,.9),"& $icon":{color:e.palette.info.main}},standardWarning:{color:a(e.palette.warning.main,.6),backgroundColor:t(e.palette.warning.main,.9),"& $icon":{color:e.palette.warning.main}},standardError:{color:a(e.palette.error.main,.6),backgroundColor:t(e.palette.error.main,.9),"& $icon":{color:e.palette.error.main}},outlinedSuccess:{color:a(e.palette.success.main,.6),border:"1px solid ".concat(e.palette.success.main),"& $icon":{color:e.palette.success.main}},outlinedInfo:{color:a(e.palette.info.main,.6),border:"1px solid ".concat(e.palette.info.main),"& $icon":{color:e.palette.info.main}},outlinedWarning:{color:a(e.palette.warning.main,.6),border:"1px solid ".concat(e.palette.warning.main),"& $icon":{color:e.palette.warning.main}},outlinedError:{color:a(e.palette.error.main,.6),border:"1px solid ".concat(e.palette.error.main),"& $icon":{color:e.palette.error.main}},filledSuccess:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.success.main},filledInfo:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.info.main},filledWarning:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.warning.main},filledError:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.error.main},icon:{marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9},message:{padding:"8px 0"},action:{display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:16,marginRight:-8}}}),{name:"MuiAlert"})(O)},586:function(e,a,t){"use strict";t.d(a,"a",(function(){return m}));var n=t(28),r=t(2),o=(t(0),t(436)),i=t(437),l=t(447),c=t(201),s=t(438),d={margin:"15px",padding:"0",width:"85%"};function m(e){var a=e.name,t=e.label,m=e.value,u=e.error,p=void 0===u?null:u,f=e.onChange,b=e.options,h=e.disabled;return Object(r.jsxs)(o.a,Object(n.a)(Object(n.a)({variant:"outlined",style:d},p&&{error:!0}),{},{children:[Object(r.jsx)(i.a,{children:t}),Object(r.jsxs)(l.a,{disabled:h,label:t,name:a,value:m,onChange:f,children:[Object(r.jsx)(c.a,{value:"",children:"NINGUNO"}),b.map((function(e){return Object(r.jsx)(c.a,{value:e.id,children:e.title},e.id)}))]}),p&&Object(r.jsx)(s.a,{children:p})]}))}},841:function(e,a,t){e.exports={"MuiContainer-root":"ProfileConfig_MuiContainer-root__1pUqk",paper:"ProfileConfig_paper__2-YzY",form:"ProfileConfig_form__36R1c",rfc:"ProfileConfig_rfc__3es4c",submit:"ProfileConfig_submit__22SRv"}}}]);
//# sourceMappingURL=21.030f3a28.chunk.js.map