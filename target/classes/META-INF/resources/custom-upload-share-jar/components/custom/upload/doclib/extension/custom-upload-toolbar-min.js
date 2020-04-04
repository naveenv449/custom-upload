// Declare namespace...
if (typeof Custom == undefined || !Custom) { var Custom = {}; }
if (!Custom.Upload) { Custom.Upload = {}; }
(function()
{
  // Define constructor...
  Custom.Upload.Toolbar = function CustomDocumentList_constructor(htmlId)
  {
    Custom.Upload.Toolbar.superclass.constructor.call(this, htmlId);
    return this;
  };

  // Extend default DocumentList...
  YAHOO.extend(Custom.Upload.Toolbar, Alfresco.DocListToolbar,
  {
	  
	   onReady: function C() {
		  
		  
		    Custom.Upload.Toolbar.superclass.onReady.call(this);
		this.widgets.LaasFileUpload = Alfresco.util.createYUIButton(this, "custom-upload-fileUpload-button", this.onLaasFileUpload, {
                    disabled: true,
                    value: "CreateChildren"
                });
				
             	if(Alfresco.constants.SITE == "custom-upload"){
					 Dom.removeClass(this.id + "-custom-upload-fileUpload-button", "hidden");
				 } else{
					 Dom.addClass(this.id + "-custom-upload-fileUpload-button", "hidden");
				 }
				this.dynamicControls.push(this.widgets.LaasFileUpload);   
		   
	   },
	   onLaasFileUpload: function q(Q, R) {
		   
            //if (this.fileUpload === null) {
                this.fileUpload1 = Alfresco.getFileUploadInstance()
				
            //}
            var O = {
                siteId: this.options.siteId,
                containerId: this.options.containerId,
                uploadDirectory: this.currentPath,
                filter: [],
                mode: this.fileUpload1.MODE_MULTI_UPLOAD,
                thumbnails: "doclib",
                onFileUploadComplete: {
                    fn: this.onFileUploadComplete,
                    scope: this
                }
            };
            this.fileUpload1.show(O);
            if (YAHOO.lang.isArray(R) && R[1].tooltip) {
                var P = Alfresco.util.createBalloon(this.fileUpload1.uploader.id + "-dialog", {
                    html: R[1].tooltip,
                    width: "30em"
                });
                P.show();
                this.fileUpload1.uploader.widgets.panel.hideEvent.subscribe(function() {
                    P.hide()
                })
            }
        }
	  
   
  });
})();