// Find the default DocumentList widget and replace it with the custom widget
var siteId = page.url.templateArgs.site;
if(siteId == "custom-upload"){
for (var i=0; i<model.widgets.length; i++){
	
   if (model.widgets[i].id == "DocumentList"){
		model.widgets[i].name = "Custom.Upload.DocumentList";
	}
  if (model.widgets[i].id == "DocListToolbar"){
		model.widgets[i].name = "Custom.Upload.Toolbar";
	}
}
}