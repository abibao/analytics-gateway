<entity>

  <navbar> </navbar>

  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">

    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2">

        <div class="uk-panel uk-panel-box">
          <ul class="uk-dotnav">
            <li class={ (dotnav==="dotnav1") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDefault }>Défault</a></li>
            <li class={ (dotnav==="dotnav2") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavDetails }>Défault</a></li>
            <li class={ (dotnav==="dotnav3") ? 'uk-active' : '' }><a href="javascript:void(0)" onclick={ selectDotnavImages }>Défault</a></li>
          </ul>
          <form if={ dotnav==="dotnav1" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Nom</span><br>
                <input onchange={ changeNameHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().name }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Type</span><br>
                <select onchange={ changeTypeHandler } class="uk-width-1-1">
                  <option value="abibao" selected={ (facade.getCurrentEntity().type==='abibao') ? 'selected' : ''  }>Abibao</option>
                  <option value="company" selected={ (facade.getCurrentEntity().type==='company') ? 'selected' : ''  }>Compagnie</option>
                  <option value="charity" selected={ (facade.getCurrentEntity().type==='charity') ? 'selected' : ''  }>Association</option>
                </select>
                <span class="uk-text-bold">Contact</span><br>
                <input onchange={ changeContactHandler } class="uk-width-1-1" type="email" value="{ facade.getCurrentEntity().contact }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Site web</span><br>
                <input onchange={ changeURLHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().url }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
          </form>
          <form if={ dotnav==="dotnav2" } class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Titre</span><br>
                <input onchange={ changeTitleHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().title }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Accroche</span><br>
                <input onchange={ changeHangsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().hangs }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentEntity().description }</textarea>
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
          </form>
          <form if={ dotnav==="dotnav3" } class="uk-form uk-width-1-1">
            <div class="uk-form-row uk-width-1-1">
              <fieldset>
                <span class="uk-text-bold">Icone (petit)</span><br>
                <input onchange={ changeIconHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().icon.split('/')[2] }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Avatar (moyen)</span><br>
                <input onchange={ changeAvatarHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().avatar.split('/')[2] }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Image (grand)</span><br>
                <input onchange={ changePictureHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentEntity().picture.split('/')[2] }" placeholder="Saisissez une valeur">
              </fieldset>
            </div>
            <br>
            <button type="button" onclick={ updateEntityHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
          </form>
        </div>

      </div>
      <div class="uk-width-1-2">

        <div class="uk-panel uk-panel-box">
          <h4>Campagnes de sondages</h4>
          <ul onchange={ changeCampaignsOrderHandler } class="uk-nestable" data-uk-nestable="{handleClass:'uk-nestable-handle'}">
            <li class="uk-nestable-item" each={ campaign in facade.getCurrentEntity().campaigns }>
              <input type="text" class="urnCampaign" value={ campaign.urn } style="display:none">
              <div class="uk-nestable-panel">
                <i class="uk-nestable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>
                <a href="/#campaigns/{ campaign.urn }">{ campaign.name }</a> <div class="uk-badge uk-badge-notification { (campaign.published) ? 'uk-badge-success' : 'uk-badge-danger' } uk-float-right">{ campaign.items.length }</div>
              </div>
            </li>
          </ul>
          <button type="button" onclick={ updateCampaignsHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
          <button type="button" onclick={ createCampaignHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large uk-float-right">Ajouter</button>
        </div>

      </div>
    </div>

  </div>

  <script>

    var self = this;

    self.dotnav = "dotnav1";

    self.on("mount", function() {
      facade.actions.entities.selectEntity(riot.router.current.params.urn)
      .catch(function(error) {
        riot.route("/homepage");
      });
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    });

    self.on("update", function() {
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    })

    selectDotnavDefault(e) {
      self.dotnav = "dotnav1";
      self.update();
    };

    selectDotnavDetails(e) {
      self.dotnav = "dotnav2";
      self.update();
    };

    selectDotnavImages(e) {
      self.dotnav = "dotnav3";
      self.update();
    }

    self.on("selectEntityLoadComplete", function() {
      facade.debugHTML("entity.tag: %s", "selectEntityLoadComplete");
    });

    self.nestableArrivedHandler = function() {
      facade.debugHTML("entity.tag: %s", "nestableArrivedHandler");
      UIkit.nestable($(".uk-nestable"));
    };

    changeCampaignsOrderHandler(e) {
      var i = 1;
      lodash.map($(".uk-nestable li .urnCampaign"), function(item) {
        var campaign = lodash.find(facade.getCurrentEntity().campaigns, {urn: item.value});
        campaign.position = i;
        i = i + 1;
      });
      self.update();
    };

    changeViewDefaultHandler(e) {
      self._currentState = "STATE_DEFAULT";
      self.update();
    };

    changeViewDetailsHandler(e) {
      self._currentState = "STATE_DETAILS";
      self.update();
    };

    changeViewImagesHandler(e) {
      self._currentState = "STATE_IMAGES";
      self.update();
    };

    changeIconHandler(e) {
      facade.getCurrentEntity().icon = 'images/icons/' + e.currentTarget.value;
    }

    changeAvatarHandler(e) {
      facade.getCurrentEntity().avatar = 'images/avatars/' + e.currentTarget.value;
    }

    changePictureHandler(e) {
      facade.getCurrentEntity().picture = 'images/pictures/' + e.currentTarget.value;
    }

    changeNameHandler(e) {
      facade.getCurrentEntity().name = e.currentTarget.value;
    };

    changeContactHandler(e) {
      facade.getCurrentEntity().contact = e.currentTarget.value;
    };

    changeURLHandler(e) {
      facade.getCurrentEntity().url = e.currentTarget.value;
    };

    changeTypeHandler(e) {
      facade.getCurrentEntity().type = e.currentTarget.selectedOptions[0].value;
    };

    changeTitleHandler(e) {
      facade.getCurrentEntity().title = e.currentTarget.value;
    };

    changeHangsHandler(e) {
      facade.getCurrentEntity().hangs = e.currentTarget.value;
    };

    changeDescriptionHandler(e) {
      facade.getCurrentEntity().description = e.currentTarget.value;
    };

    updateEntityHandler(e) {
      facade.actions.entities.update(facade.getCurrentEntity());
    };

    updateCampaignsHandler(e) {
      lodash.map(facade.getCurrentEntity().campaigns, function(campaign) {
        facade.actions.campaigns.update(campaign);
      });
    };

    createCampaignHandler(e) {
      facade.actions.campaigns.create()
        .then(function() {
          facade.actions.entities.selectEntity(facade.getCurrentEntity().urn)
        });
    };

  </script>

  <style scoped>
    .uk-container {
      width: 960px;
    }
    .uk-badge-success {
      width: 28px;
    }
    .uk-badge-danger {
      width: 28px;
    }
  </style>

</entity>
