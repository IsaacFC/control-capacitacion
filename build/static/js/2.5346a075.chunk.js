(this["webpackJsonpcontrol-capacitacion"]=this["webpackJsonpcontrol-capacitacion"]||[]).push([[2],{1325:function(e,t,a){"use strict";var o=a(1),n=a(3),i=a(16),r=a(0),c=(a(5),a(4)),l=a(6),d=a(10),s=r.forwardRef((function(e,t){var a=e.classes,i=e.className,l=e.component,s=void 0===l?"div":l,p=e.disableGutters,u=void 0!==p&&p,b=e.fixed,h=void 0!==b&&b,m=e.maxWidth,g=void 0===m?"lg":m,f=Object(n.a)(e,["classes","className","component","disableGutters","fixed","maxWidth"]);return r.createElement(s,Object(o.a)({className:Object(c.a)(a.root,i,h&&a.fixed,u&&a.disableGutters,!1!==g&&a["maxWidth".concat(Object(d.a)(String(g)))]),ref:t},f))}));t.a=Object(l.a)((function(e){return{root:Object(i.a)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:e.spacing(2),paddingRight:e.spacing(2),display:"block"},e.breakpoints.up("sm"),{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(e.breakpoints.values).reduce((function(t,a){var o=e.breakpoints.values[a];return 0!==o&&(t[e.breakpoints.up(a)]={maxWidth:o}),t}),{}),maxWidthXs:Object(i.a)({},e.breakpoints.up("xs"),{maxWidth:Math.max(e.breakpoints.values.xs,444)}),maxWidthSm:Object(i.a)({},e.breakpoints.up("sm"),{maxWidth:e.breakpoints.values.sm}),maxWidthMd:Object(i.a)({},e.breakpoints.up("md"),{maxWidth:e.breakpoints.values.md}),maxWidthLg:Object(i.a)({},e.breakpoints.up("lg"),{maxWidth:e.breakpoints.values.lg}),maxWidthXl:Object(i.a)({},e.breakpoints.up("xl"),{maxWidth:e.breakpoints.values.xl})}}),{name:"MuiContainer"})(s)},1326:function(e,t,a){"use strict";var o=a(1),n=a(0),i=(a(5),a(6)),r={WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale",boxSizing:"border-box"},c=function(e){return Object(o.a)({color:e.palette.text.primary},e.typography.body2,{backgroundColor:e.palette.background.default,"@media print":{backgroundColor:e.palette.common.white}})};t.a=Object(i.a)((function(e){return{"@global":{html:r,"*, *::before, *::after":{boxSizing:"inherit"},"strong, b":{fontWeight:e.typography.fontWeightBold},body:Object(o.a)({margin:0},c(e),{"&::backdrop":{backgroundColor:e.palette.background.default}})}}}),{name:"MuiCssBaseline"})((function(e){var t=e.children,a=void 0===t?null:t;return e.classes,n.createElement(n.Fragment,null,a)}))},429:function(e,t,a){"use strict";var o=a(1),n=a(27),i=a(3),r=a(0),c=(a(5),a(4)),l=a(236),d=a(425),s=a(6),p=a(200),u=r.forwardRef((function(e,t){var a=e.autoFocus,s=e.checked,u=e.checkedIcon,b=e.classes,h=e.className,m=e.defaultChecked,g=e.disabled,f=e.icon,y=e.id,v=e.inputProps,k=e.inputRef,O=e.name,x=e.onBlur,j=e.onChange,C=e.onFocus,B=e.readOnly,W=e.required,S=e.tabIndex,w=e.type,E=e.value,z=Object(i.a)(e,["autoFocus","checked","checkedIcon","classes","className","defaultChecked","disabled","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"]),R=Object(l.a)({controlled:s,default:Boolean(m),name:"SwitchBase",state:"checked"}),I=Object(n.a)(R,2),P=I[0],N=I[1],L=Object(d.a)(),M=g;L&&"undefined"===typeof M&&(M=L.disabled);var F="checkbox"===w||"radio"===w;return r.createElement(p.a,Object(o.a)({component:"span",className:Object(c.a)(b.root,h,P&&b.checked,M&&b.disabled),disabled:M,tabIndex:null,role:void 0,onFocus:function(e){C&&C(e),L&&L.onFocus&&L.onFocus(e)},onBlur:function(e){x&&x(e),L&&L.onBlur&&L.onBlur(e)},ref:t},z),r.createElement("input",Object(o.a)({autoFocus:a,checked:s,defaultChecked:m,className:b.input,disabled:M,id:F&&y,name:O,onChange:function(e){var t=e.target.checked;N(t),j&&j(e,t)},readOnly:B,ref:k,required:W,tabIndex:S,type:w,value:E},v)),P?u:f)}));t.a=Object(s.a)({root:{padding:9},checked:{},disabled:{},input:{cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}},{name:"PrivateSwitchBase"})(u)},439:function(e,t,a){"use strict";var o=a(1),n=a(3),i=a(0),r=(a(5),a(4)),c=a(425),l=a(6),d=a(440),s=a(10),p=i.forwardRef((function(e,t){e.checked;var a=e.classes,l=e.className,p=e.control,u=e.disabled,b=(e.inputRef,e.label),h=e.labelPlacement,m=void 0===h?"end":h,g=(e.name,e.onChange,e.value,Object(n.a)(e,["checked","classes","className","control","disabled","inputRef","label","labelPlacement","name","onChange","value"])),f=Object(c.a)(),y=u;"undefined"===typeof y&&"undefined"!==typeof p.props.disabled&&(y=p.props.disabled),"undefined"===typeof y&&f&&(y=f.disabled);var v={disabled:y};return["checked","name","onChange","value","inputRef"].forEach((function(t){"undefined"===typeof p.props[t]&&"undefined"!==typeof e[t]&&(v[t]=e[t])})),i.createElement("label",Object(o.a)({className:Object(r.a)(a.root,l,"end"!==m&&a["labelPlacement".concat(Object(s.a)(m))],y&&a.disabled),ref:t},g),i.cloneElement(p,v),i.createElement(d.a,{component:"span",className:Object(r.a)(a.label,y&&a.disabled)},b))}));t.a=Object(l.a)((function(e){return{root:{display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,"&$disabled":{cursor:"default"}},labelPlacementStart:{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},labelPlacementTop:{flexDirection:"column-reverse",marginLeft:16},labelPlacementBottom:{flexDirection:"column",marginLeft:16},disabled:{},label:{"&$disabled":{color:e.palette.text.disabled}}}}),{name:"MuiFormControlLabel"})(p)},440:function(e,t,a){"use strict";var o=a(1),n=a(3),i=a(0),r=(a(5),a(4)),c=a(6),l=a(10),d={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p"},s=i.forwardRef((function(e,t){var a=e.align,c=void 0===a?"inherit":a,s=e.classes,p=e.className,u=e.color,b=void 0===u?"initial":u,h=e.component,m=e.display,g=void 0===m?"initial":m,f=e.gutterBottom,y=void 0!==f&&f,v=e.noWrap,k=void 0!==v&&v,O=e.paragraph,x=void 0!==O&&O,j=e.variant,C=void 0===j?"body1":j,B=e.variantMapping,W=void 0===B?d:B,S=Object(n.a)(e,["align","classes","className","color","component","display","gutterBottom","noWrap","paragraph","variant","variantMapping"]),w=h||(x?"p":W[C]||d[C])||"span";return i.createElement(w,Object(o.a)({className:Object(r.a)(s.root,p,"inherit"!==C&&s[C],"initial"!==b&&s["color".concat(Object(l.a)(b))],k&&s.noWrap,y&&s.gutterBottom,x&&s.paragraph,"inherit"!==c&&s["align".concat(Object(l.a)(c))],"initial"!==g&&s["display".concat(Object(l.a)(g))]),ref:t},S))}));t.a=Object(c.a)((function(e){return{root:{margin:0},body2:e.typography.body2,body1:e.typography.body1,caption:e.typography.caption,button:e.typography.button,h1:e.typography.h1,h2:e.typography.h2,h3:e.typography.h3,h4:e.typography.h4,h5:e.typography.h5,h6:e.typography.h6,subtitle1:e.typography.subtitle1,subtitle2:e.typography.subtitle2,overline:e.typography.overline,srOnly:{position:"absolute",height:1,width:1,overflow:"hidden"},alignLeft:{textAlign:"left"},alignCenter:{textAlign:"center"},alignRight:{textAlign:"right"},alignJustify:{textAlign:"justify"},noWrap:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},gutterBottom:{marginBottom:"0.35em"},paragraph:{marginBottom:16},colorInherit:{color:"inherit"},colorPrimary:{color:e.palette.primary.main},colorSecondary:{color:e.palette.secondary.main},colorTextPrimary:{color:e.palette.text.primary},colorTextSecondary:{color:e.palette.text.secondary},colorError:{color:e.palette.error.main},displayInline:{display:"inline"},displayBlock:{display:"block"}}}),{name:"MuiTypography"})(s)},446:function(e,t,a){"use strict";var o=a(1),n=a(3),i=a(0),r=(a(5),a(4)),c=a(429),l=a(228),d=Object(l.a)(i.createElement("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),s=Object(l.a)(i.createElement("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),p=a(14),u=Object(l.a)(i.createElement("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox"),b=a(10),h=a(6),m=i.createElement(s,null),g=i.createElement(d,null),f=i.createElement(u,null),y=i.forwardRef((function(e,t){var a=e.checkedIcon,l=void 0===a?m:a,d=e.classes,s=e.color,p=void 0===s?"secondary":s,u=e.icon,h=void 0===u?g:u,y=e.indeterminate,v=void 0!==y&&y,k=e.indeterminateIcon,O=void 0===k?f:k,x=e.inputProps,j=e.size,C=void 0===j?"medium":j,B=Object(n.a)(e,["checkedIcon","classes","color","icon","indeterminate","indeterminateIcon","inputProps","size"]),W=v?O:h,S=v?O:l;return i.createElement(c.a,Object(o.a)({type:"checkbox",classes:{root:Object(r.a)(d.root,d["color".concat(Object(b.a)(p))],v&&d.indeterminate),checked:d.checked,disabled:d.disabled},color:p,inputProps:Object(o.a)({"data-indeterminate":v},x),icon:i.cloneElement(W,{fontSize:void 0===W.props.fontSize&&"small"===C?C:W.props.fontSize}),checkedIcon:i.cloneElement(S,{fontSize:void 0===S.props.fontSize&&"small"===C?C:S.props.fontSize}),ref:t},B))}));t.a=Object(h.a)((function(e){return{root:{color:e.palette.text.secondary},checked:{},disabled:{},indeterminate:{},colorPrimary:{"&$checked":{color:e.palette.primary.main,"&:hover":{backgroundColor:Object(p.d)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&$disabled":{color:e.palette.action.disabled}},colorSecondary:{"&$checked":{color:e.palette.secondary.main,"&:hover":{backgroundColor:Object(p.d)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"&$disabled":{color:e.palette.action.disabled}}}}),{name:"MuiCheckbox"})(y)}}]);
//# sourceMappingURL=2.5346a075.chunk.js.map