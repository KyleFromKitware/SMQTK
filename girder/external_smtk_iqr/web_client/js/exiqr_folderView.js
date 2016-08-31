

girder.views.exiqrFolderWidget = girder.View.extend({

    initialize: function (settings) {
        this.folderModel = settings.folderModel;
        this.folderModel.on('change:meta', function () {
            this.render();
        }, this);
        this.render();
    },

    render: function () {
        var folder_meta = this.folderModel.get('meta');

        if( folder_meta['smqtk_iqr'] !== undefined )
        {
            this.$el.html(girder.templates.exiqr_folderView());
        }
        else
        {
            // clear the GUI content
            this.$el.html("");
        }

        return this;
    },

    events: {
        "click .g-exiqrFolderView-header a.g-exiqr-link": function (event) {
            // Open SMQTK IQR-lite in a new window/tab with the nested
            // configuration.  Should only get to this point the parent folder
            // has a "configuration", but it may not be valid.  IQR site should
            // do validation?
            var iqr_config = this.folderModel.get('meta')['smqtk_iqr'];
            iqr_config.girder_origin = window.location.origin + window.location.pathname;

            var iqr_root = iqr_config['smqtk_iqr_root'];
            // window.open(iqr_root + "/?config=" + JSON.stringify(iqr_config));

            // Initialize a new
            $.ajax({
                url: iqr_root+"/",
                method: "POST",
                data: {
                    prefix: this.folderModel.id,
                    config: JSON.stringify(iqr_config)
                },
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    girder.events.trigger('g:alert', {
                        text: "Opening IQR interface... " +
                            "(" + JSON.stringify(data['url']) + ")",
                        type: 'info',
                        icon: 'info'
                    });
                    window.open(data['url'])
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    girder.events.trigger('g:alert', {
                        text: 'Error initializing IQR state for current folder: '
                            + errorThrown + " :: " + textStatus,
                        type: 'warning',
                        icon: 'info'
                    });
                }
            });
            girder.events.trigger('g:alert', {
                text: 'Initializing IQR state for this folder...',
                type: 'info',
                icon: 'info'
            });
        }
    }

});


girder.wrap(girder.views.HierarchyWidget, 'render', function (render) {
    render.call(this);

    // Only on folder views:
    if (this.parentModel.resourceName === 'folder')
    {
        // Add the item-previews-container.
        var container_el = $('<div class="g-exiqr-container">');
        this.$el.prepend(container_el);

        this.exiqrFolderView = new girder.views.exiqrFolderWidget({
            folderModel: this.parentModel,
            parentView: this,
            el: container_el
        });
    }

    return this;
});
