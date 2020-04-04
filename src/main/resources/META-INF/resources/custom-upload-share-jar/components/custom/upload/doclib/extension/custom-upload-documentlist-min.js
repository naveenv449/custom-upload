if (typeof Custom == undefined || !Custom) {
    var Custom = {}
}
if (!Custom.Upload) {
    Custom.Upload = {}
}(function() {
	     var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths,
      $siteURL = Alfresco.util.siteURL,
      $isValueSet = Alfresco.util.isValueSet;
    Custom.Upload.DocumentList = function b(c) {
        Custom.Upload.DocumentList.superclass.constructor.call(this, c);
        return this
    };
	 YAHOO.lang.augmentProto(Custom.Upload.DocumentList, Alfresco.doclib.Actions);
    YAHOO.extend(Custom.Upload.DocumentList, Alfresco.DocumentList, {
		 onActionDetails: function dlA_onActionDetails(record)
      {
		  
		  if (Alfresco.constants.SITE == "custom-upload") {
         var scope = this,
            nodeRef = record.nodeRef,
            jsNode = record.jsNode;
			var domID = Alfresco.util.generateDomId();
         // Intercept before dialog show
         var doBeforeDialogShow = function dlA_onActionDetails_doBeforeDialogShow(p_form, p_dialog)
         {
            // Dialog title
            var fileSpan = '<span class="light">' + $html(record.displayName) + '</span>';
			
			 document.getElementById(this.id+"-editDetails-"+domID+"-form-caption").style.background="white";
			
			
            Alfresco.util.populateHTML(
               [ p_dialog.id + "-dialogTitle", scope.msg("edit-details.title", fileSpan) ]
            );

            // Edit metadata link button
            this.widgets.editMetadata = Alfresco.util.createYUIButton(p_dialog, "editMetadata", null,
            {
               type: "link",
               label: scope.msg("edit-details.label.edit-metadata"),
               href: $siteURL("edit-metadata?nodeRef=" + nodeRef)
            });
         };

         var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",
         {
            itemKind: "node",
            itemId: nodeRef,
            mode: "edit",
            submitType: "json",
            formId: "doclib-simple-metadata"
         });
			
         // Using Forms Service, so always create new instance
         var editDetails = new Alfresco.module.SimpleDialog(this.id + "-editDetails-" +domID );

         editDetails.setOptions(
         {
            width: "auto",
            templateUrl: templateUrl,
            actionUrl: null,
            destroyOnHide: true,
            doBeforeDialogShow:
            {
               fn: doBeforeDialogShow,
               scope: this
            },
            onSuccess:
            {
               fn: function dlA_onActionDetails_success(response)
               {
                  // Reload the node's metadata
                  var webscriptPath = "components/documentlibrary/data";
                  if ($isValueSet(this.options.siteId))
                  {
                     webscriptPath += "/site/" + encodeURIComponent(this.options.siteId)
                  }
                  Alfresco.util.Ajax.request(
                  {
                     url: $combine(Alfresco.constants.URL_SERVICECONTEXT, webscriptPath, "/node/", jsNode.nodeRef.uri) + "?view=" + this.actionsView,
                     successCallback:
                     {
                        fn: function dlA_onActionDetails_refreshSuccess(response)
                        {
                           var record = response.json.item
                           record.jsNode = new Alfresco.util.Node(response.json.item.node);

                           // Fire "renamed" event
                           YAHOO.Bubbling.fire(record.node.isContainer ? "folderRenamed" : "fileRenamed",
                           {
                              file: record
                           });
						/* Alfresco.util.Ajax.request({
                                        url: Alfresco.constants.PROXY_URI + "com/ge/creditrisk/creditrisk-move?nodeRef=" + nodeRef,
                                        successCallback: {
                                            fn: function ap(at) {
                                                var ar = at.json.result;
                                                this._updateDocList.call(this);
											
                                            },
                                            scope: this
                                        },
                                        failureCallback: {
                                            fn: function an(ar) {

                                            },
                                            scope: this
                                        }
                                    })*/
                           // Fire "tagRefresh" event
                           YAHOO.Bubbling.fire("tagRefresh");
							
                           // Display success message
                           Alfresco.util.PopupManager.displayMessage(
                           {
                              text: this.msg("message.details.success")
                           });

                           // Refresh the document list...
                           this._updateDocList.call(this);
                        },
                        scope: this
                     },
                     failureCallback:
                     {
                        fn: function dlA_onActionDetails_refreshFailure(response)
                        {
                           Alfresco.util.PopupManager.displayMessage(
                           {
                              text: this.msg("message.details.failure")
                           });
                        },
                        scope: this
                     }
                  });
               },
               scope: this
            },
            onFailure:
            {
               fn: function dLA_onActionDetails_failure(response)
               {
                  var failureMsg = this.msg("message.details.failure");
                  if (response.json && response.json.message.indexOf("Failed to persist field 'prop_cm_name'") !== -1)
                  {
                     failureMsg = this.msg("message.details.failure.name");
                  }
                  Alfresco.util.PopupManager.displayMessage(
                  {
                     text: failureMsg
                  });
               },
               scope: this
            }
         }).show();
		 
		  }
		  else{
			  Custom.Upload.DocumentList.superclass.onActionDetails.call(this, record)
		  }
		  
      },


        onDocumentListDrop: function a(p) {
            if (Alfresco.constants.SITE == "custom-upload") {
                try {
                    if (p.dataTransfer.files !== undefined && p.dataTransfer.files !== null && p.dataTransfer.files.length > 0) {
                        var m = Alfresco.getLaasDNDUploadProgressInstance();
                        var d = false;
                        var q = "",
                            h, g;
                        g = p.dataTransfer.files.length;
                        for (h = 0; h < g; h++) {
                            if (p.dataTransfer.files[h].size > 0) {
                                d = true
                            } else {
                                q += '"' + p.dataTransfer.files[h].fileName + '", '
                            }
                        }
                        if (!d) {
                            q = q.substring(0, q.lastIndexOf(", "));
                            Alfresco.util.PopupManager.displayMessage({
                                text: m.msg("message.zeroByteFiles", q)
                            })
                        }
                        if (d && m.uploadMethod === m.INMEMORY_UPLOAD) {
                            var t = 0;
                            g = p.dataTransfer.files.length;
                            for (h = 0; h < g; h++) {
                                t += p.dataTransfer.files[h].size
                            }
                            if (t > m.getInMemoryLimit()) {
                                d = false;
                                Alfresco.util.PopupManager.displayPrompt({
                                    text: m.msg("inmemory.uploadsize.exceeded", Alfresco.util.formatFileSize(m.getInMemoryLimit()))
                                })
                            }
                        }
                        if (d) {
                            var o = this.currentPath,
                                c = o.substring(o.lastIndexOf("/") + 1),
                                r = this.doclistMetadata.parent ? this.doclistMetadata.parent.nodeRef : null;
                            var u = this.widgets.dataTable.getRecord(p.target);
                            if (u !== null) {
                                var n = this.widgets.dataTable.getColumn(p.target),
                                    l = u.getData();
                                if (p.target.tagName == "IMG" || p.target.className == "droppable") {
                                    var s = l.location;
                                    c = s.file;
                                    o = $combine(s.path, s.file);
                                    r = l.nodeRef
                                }
                            }
                            Dom.removeClass(this.widgets.dataTable.getTrEl(p.target), "dndFolderHighlight");
                            Dom.removeClass(this.widgets.dataTable.getContainerEl(), "dndDocListHighlight");
                            var k = {
                                files: p.dataTransfer.files,
                                uploadDirectoryName: c,
                                filter: [],
                                mode: m.MODE_MULTI_UPLOAD,
                                thumbnails: "doclib",
                                onFileUploadComplete: {
                                    fn: this.onFileUploadComplete,
                                    scope: this
                                }
                            };
                            if (this.options.siteId != null) {
                                k.siteId = this.options.siteId;
                                k.containerId = this.options.containerId;
                                k.uploadDirectory = o
                            } else {
                                k.destination = r
                            }
                            m.show(k)
                        }
                    } else {
                        Alfresco.logger.debug("DL_onDocumentListDrop: A drop event was detected, but no files were present for upload: ", p.dataTransfer)
                    }
                } catch (f) {
                    Alfresco.logger.error("DL_onDocumentListDrop: The following error occurred when files were dropped onto the Document List: ", f)
                }
                p.stopPropagation();
                p.preventDefault()
            } else {
                Custom.Upload.DocumentList.superclass.onDocumentListDrop.call(this, p)
            }
        }
    })
})();