(this["webpackJsonpcontrol-capacitacion"]=this["webpackJsonpcontrol-capacitacion"]||[]).push([[21],{1327:function(e,a,n){"use strict";n.r(a);var t=n(21),r=n(27),o=n(2),i=n(0),c=n(198),l=n(840),s=n.n(l),m=n(518),u=n(1328),p=n(427),d=n(520),f=n(318),b=n(85),h=n.n(b),g={name:"",firstLastName:"",secondLastName:"",email:"",phoneNumber:"",plaza:""};a.default=function(e){var a=Object(i.useState)({openSnackBar:!1,snackBarMessage:"",severity:""}),n=Object(r.a)(a,2),l=n[0],b=n[1],j=Object(i.useState)(!1),v=Object(r.a)(j,2),O=v[0],x=v[1];Object(i.useLayoutEffect)((function(){C()}),[]);var C=function(){x((function(e){return!e})),h.a.get("/profile-config").then((function(e){k({name:e.data.name,firstLastName:e.data.firstLastName,secondLastName:e.data.secondLastName,email:e.data.email,phoneNumber:e.data.phoneNumber,plaza:e.data.plaza}),x((function(e){return!e}))})).catch((function(e){x((function(e){return!e})),e.response?b({openSnackBar:!0,severity:"error",snackBarMessage:e.response.data.message}):e.request?window.alert("Error: "+e.request.data.message):console.log("Error: "+e.message),console.log(e.config)}))},N=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y,a=Object(t.a)({},E);if("name"in e&&(a.name=e.name?"":"Campo requerido"),"firstLastName"in e&&(a.firstLastName=e.firstLastName?"":"Campo requerido"),"secondLastName"in e&&(a.secondLastName=e.secondLastName?"":"Campo requerido"),"phoneNumber"in e&&(a.phoneNumber=e.phoneNumber?"":"Campo requerido"),"plaza"in e&&(a.plaza=e.plaza?"":"Campo requerido"),"email"in e&&(a.email=e.email?/$^|.+@.+..+/.test(y.email)?a.email="":a.email="Email no valido":a.email="Campo obligatorio"),z(Object(t.a)({},a)),e==y)return Object.values(a).every((function(e){return""==e}))},L=Object(p.b)(g,!0,N),y=L.values,k=L.setValues,E=L.errors,z=L.setErrors,S=L.handleInputChange,M=Object(o.jsxs)(p.a,{className:s.a.form,onSubmit:function(e){if(e.preventDefault(),N()){x((function(e){return!e}));var a={name:y.name,firstLastName:y.firstLastName,secondLastName:y.secondLastName,email:y.email,phoneNumber:y.phoneNumber,plaza:y.plaza};h.a.post("/auth/profile-config",a).then((function(e){x((function(e){return!e})),b({openSnackBar:!0,severity:"success",snackBarMessage:"Datos registrados correctamente"})})).catch((function(e){e.response?b({openSnackBar:!0,severity:"error",snackBarMessage:e.response.data.message}):e.request?window.alert("Error: "+e.request.data.message):console.log("Error: "+e.message),console.log(e.config)}))}},children:[Object(o.jsx)("h1",{children:"Datos del participante"}),Object(o.jsx)("p",{style:{textDecoration:"underline"},children:"Es necesario llenar sus datos para inscribirse a un curso"}),Object(o.jsxs)(u.a,{container:!0,children:[Object(o.jsxs)(u.a,{item:!0,xs:6,children:[Object(o.jsx)(m.a,{name:"name",placeholder:"Nombre",label:"Nombre",value:y.name||"",onChange:S,inputProps:{maxLength:50},error:E.name}),Object(o.jsx)(m.a,{name:"firstLastName",placeholder:"Apellido paterno",label:"Apellido materno",value:y.firstLastName||"",onChange:S,inputProps:{maxLength:20},error:E.firstLastName}),Object(o.jsx)(m.a,{name:"secondLastName",placeholder:"Apellido materno",label:"Apellido materno",value:y.secondLastName||"",onChange:S,inputProps:{maxLength:20},error:E.secondLastName})]}),Object(o.jsxs)(u.a,{item:!0,xs:6,children:[Object(o.jsx)(m.a,{name:"email",placeholder:"Email",label:"Email",value:y.email?y.email.replace(/\s/g,""):y.email||"",onChange:S,inputProps:{maxLength:100},error:E.email}),Object(o.jsx)(m.a,{name:"phoneNumber",placeholder:"Telefono",label:"Telefono",type:"number",value:y.phoneNumber||"",onChange:S,inputProps:{min:0},error:E.phoneNumber}),Object(o.jsx)(m.a,{name:"plaza",placeholder:"Plaza",label:"Plaza",value:y.plaza.replace(/\s/g,"")||"",onChange:S,inputProps:{maxLength:15},error:E.plaza})]})]}),Object(o.jsxs)(u.a,{children:[Object(o.jsx)(c.a,{fullWidth:!0,variant:"contained",color:"primary",className:s.a.submit,style:{marginTop:"15px"},onClick:function(){e.history.push("/profile-config/change-password")},children:"Cambiar contrase\xf1a"}),Object(o.jsx)(c.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:s.a.submit,style:{marginTop:"15px"},children:"Guardar"})]})]});return O&&(M=Object(o.jsx)(f.a,{})),Object(o.jsxs)("div",{className:s.a.paper,children:[M,Object(o.jsx)(d.a,{openSnackBar:l.openSnackBar,closeSnackBar:function(){return b({openSnackBar:!1})},snackBarMessage:l.snackBarMessage,severity:l.severity})]})}},318:function(e,a,n){"use strict";var t=n(2),r=n(424),o=n.n(r);a.a=function(){return Object(t.jsx)("div",{className:o.a.loader,children:"Loading..."})}},424:function(e,a,n){e.exports={loader:"Spinner_loader__1sqt0",load6:"Spinner_load6__1ismh",round:"Spinner_round__3laPx"}},427:function(e,a,n){"use strict";n.d(a,"b",(function(){return m})),n.d(a,"a",(function(){return p}));var t=n(3),r=n(16),o=n(21),i=n(27),c=n(2),l=n(0),s=n(197);function m(e){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2?arguments[2]:void 0,t=Object(l.useState)(e),c=Object(i.a)(t,2),s=c[0],m=c[1],u=Object(l.useState)({}),p=Object(i.a)(u,2),d=p[0],f=p[1],b=function(e){var t=e.target,i=t.name,c=t.value;m(Object(o.a)(Object(o.a)({},s),{},Object(r.a)({},i,c))),a&&n(Object(r.a)({},i,c))},h=function(){m(e),f({})};return{values:s,setValues:m,errors:d,setErrors:f,handleInputChange:b,resetForm:h}}var u=Object(s.a)((function(e){return{root:{"& .MuiFormControl-root":{width:"80%",margin:e.spacing(1)}}}}));function p(e){var a=u(),n=(e.children,Object(t.a)(e,["children"]));return Object(c.jsx)("form",Object(o.a)(Object(o.a)({className:a.root,autoComplete:"off"},n),{},{children:e.children}))}},514:function(e,a,n){"use strict";var t=n(0),r=n(228);a.a=Object(r.a)(t.createElement("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},518:function(e,a,n){"use strict";n.d(a,"a",(function(){return c}));var t=n(21),r=n(2),o=(n(0),n(434)),i={width:"85%",margin:"15px"};function c(e){var a=e.name,n=e.label,c=e.placeholder,l=e.value,s=e.error,m=void 0===s?null:s,u=e.onChange,p=e.type,d=e.disabled,f=e.inputProps,b=e.InputLabelProps,h=e.className;return Object(r.jsx)(o.a,Object(t.a)({className:h,disabled:d,style:i,variant:"outlined",label:n,placeholder:c,name:a,value:l,onChange:u,type:p,inputProps:f,InputLabelProps:b},m&&{error:!0,helperText:m}))}},520:function(e,a,n){"use strict";var t=n(21),r=n(2),o=(n(0),n(841)),i=n(581),c=function(e){return Object(r.jsx)(i.a,Object(t.a)({elevation:6,variant:"filled"},e))};a.a=function(e){var a=e.openSnackBar,n=e.closeSnackBar,t=e.snackBarMessage,i=e.severity;return Object(r.jsx)(o.a,{anchorOrigin:{vertical:"bottom",horizontal:"right"},open:a,autoHideDuration:6e3,onClose:n,children:Object(r.jsx)(c,{onClose:n,severity:i,children:t})})}},581:function(e,a,n){"use strict";var t=n(3),r=n(1),o=n(0),i=(n(5),n(4)),c=n(14),l=n(6),s=n(68),m=n(228),u=Object(m.a)(o.createElement("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),p=Object(m.a)(o.createElement("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),d=Object(m.a)(o.createElement("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),f=Object(m.a)(o.createElement("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),b=n(514),h=n(200),g=n(10),j={success:o.createElement(u,{fontSize:"inherit"}),warning:o.createElement(p,{fontSize:"inherit"}),error:o.createElement(d,{fontSize:"inherit"}),info:o.createElement(f,{fontSize:"inherit"})},v=o.createElement(b.a,{fontSize:"small"}),O=o.forwardRef((function(e,a){var n=e.action,c=e.children,l=e.classes,m=e.className,u=e.closeText,p=void 0===u?"Close":u,d=e.color,f=e.icon,b=e.iconMapping,O=void 0===b?j:b,x=e.onClose,C=e.role,N=void 0===C?"alert":C,L=e.severity,y=void 0===L?"success":L,k=e.variant,E=void 0===k?"standard":k,z=Object(t.a)(e,["action","children","classes","className","closeText","color","icon","iconMapping","onClose","role","severity","variant"]);return o.createElement(s.a,Object(r.a)({role:N,square:!0,elevation:0,className:Object(i.a)(l.root,l["".concat(E).concat(Object(g.a)(d||y))],m),ref:a},z),!1!==f?o.createElement("div",{className:l.icon},f||O[y]||j[y]):null,o.createElement("div",{className:l.message},c),null!=n?o.createElement("div",{className:l.action},n):null,null==n&&x?o.createElement("div",{className:l.action},o.createElement(h.a,{size:"small","aria-label":p,title:p,color:"inherit",onClick:x},v)):null)}));a.a=Object(l.a)((function(e){var a="light"===e.palette.type?c.a:c.i,n="light"===e.palette.type?c.i:c.a;return{root:Object(r.a)({},e.typography.body2,{borderRadius:e.shape.borderRadius,backgroundColor:"transparent",display:"flex",padding:"6px 16px"}),standardSuccess:{color:a(e.palette.success.main,.6),backgroundColor:n(e.palette.success.main,.9),"& $icon":{color:e.palette.success.main}},standardInfo:{color:a(e.palette.info.main,.6),backgroundColor:n(e.palette.info.main,.9),"& $icon":{color:e.palette.info.main}},standardWarning:{color:a(e.palette.warning.main,.6),backgroundColor:n(e.palette.warning.main,.9),"& $icon":{color:e.palette.warning.main}},standardError:{color:a(e.palette.error.main,.6),backgroundColor:n(e.palette.error.main,.9),"& $icon":{color:e.palette.error.main}},outlinedSuccess:{color:a(e.palette.success.main,.6),border:"1px solid ".concat(e.palette.success.main),"& $icon":{color:e.palette.success.main}},outlinedInfo:{color:a(e.palette.info.main,.6),border:"1px solid ".concat(e.palette.info.main),"& $icon":{color:e.palette.info.main}},outlinedWarning:{color:a(e.palette.warning.main,.6),border:"1px solid ".concat(e.palette.warning.main),"& $icon":{color:e.palette.warning.main}},outlinedError:{color:a(e.palette.error.main,.6),border:"1px solid ".concat(e.palette.error.main),"& $icon":{color:e.palette.error.main}},filledSuccess:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.success.main},filledInfo:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.info.main},filledWarning:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.warning.main},filledError:{color:"#fff",fontWeight:e.typography.fontWeightMedium,backgroundColor:e.palette.error.main},icon:{marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9},message:{padding:"8px 0"},action:{display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:16,marginRight:-8}}}),{name:"MuiAlert"})(O)},840:function(e,a,n){e.exports={"MuiContainer-root":"ProfileConfig_MuiContainer-root__1pUqk",paper:"ProfileConfig_paper__2-YzY",form:"ProfileConfig_form__36R1c",rfc:"ProfileConfig_rfc__3es4c",submit:"ProfileConfig_submit__22SRv"}}}]);
//# sourceMappingURL=21.eb17c52b.chunk.js.map