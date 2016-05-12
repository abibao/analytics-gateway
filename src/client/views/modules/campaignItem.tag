<campaign-item>

  <navbar> </navbar>

  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">

    <div class="uk-grid uk-grid-medium">

      <div class="uk-width-1-2">
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Campagne</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaign().name }" disabled>
                <span class="uk-text-bold">Type</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().type }" disabled>
                <span class="uk-text-bold">Label</span><br>
                <input onchange={ changeLabelHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().label }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Question</span><br>
                <input onchange={ changeQuestionHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().question }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Description</span><br>
                <textarea onchange={ changeDescriptionHandler } rows="6" class="uk-width-1-1" placeholder="Saisissez une valeur">{ facade.getCurrentCampaignItem().description }</textarea>
                <span class="uk-text-bold">Tags</span><br>
                <input onchange={ changeTagsHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().tags }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignItemHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
            <a href="/#campaigns/{ facade.getCurrentCampaign().urn }" class="uk-button uk-button-primary uk-button-large uk-float-right brown darken-2"><i class="uk-icon-backward"></i>Campagne</a>
          </form>
        </div>
      </div>

      <div if={ facade.getCurrentCampaignItem().type==='ABIBAO_COMPONENT_DROPDOWN' || facade.getCurrentCampaignItem().type==='ABIBAO_COMPONENT_MULTIPLE_CHOICE' } class="uk-width-1-2">

        <div class="uk-panel uk-panel-box">
          <h4>Options</h4>
          <input onchange={ changeRequiredHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().required===true }"> <label>Obligatoire</label><br>
          <input onchange={ changeMultipleSelectionsHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().multipleSelections===true }"> <label>Sélection multiples</label><br>
          <input onchange={ changeRandomizeHandler } type="checkbox" checked="{ facade.getCurrentCampaignItem().randomize===true }"> <label>Affichage au hasard</label><br>
          <form if={ facade.getCurrentCampaignItem().type==='ABIBAO_COMPONENT_DROPDOWN' } class="uk-form uk-width-1-1">
            <br><span class="uk-text-bold">Placeholder</span><br>
            <input onchange={ changePlaceholderHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().placeholder }" placeholder="Saisissez une valeur">
          </form>
          <h4>Choix de la question</h4>
          <ul onchange={ changeCampaignItemsChoicesOrderHandler } class="uk-nestable" data-uk-nestable="{handleClass:'uk-nestable-handle'}">
            <li class="uk-nestable-item" each={ campaignItemChoice in facade.getCurrentCampaignItem().choices } data-uk-tooltip="pos:'left'">
              <input type="text" class="urnCampaignItemChoice" value={ campaignItemChoice.urn } style="display:none">
              <div class="uk-nestable-panel uk-text-truncate">
                <i class="uk-nestable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>
                <a href="/#campaigns-items-choices/{ campaignItemChoice.urn }">({ campaignItemChoice.position }) { campaignItemChoice.text }</a>
              </div>
            </li>
          </ul>
          <button type="button" onclick={ updateCampaignItemsChoicesHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large">Sauver</button>
          <button type="button" onclick={ createCampaignItemChoiceHandler } class="uk-width-1-4 uk-button uk-button-primary uk-button-large uk-float-right">Ajouter</button>
        </div>

      </div>

      <div if={ facade.getCurrentCampaignItem().type==='ABIBAO_COMPONENT_NUMBER' } class="uk-width-1-2">
        <div class="uk-panel uk-panel-box">
          <form class="uk-form uk-width-1-1">
            <br><span class="uk-text-bold">Placeholder</span><br>
            <input onchange={ changePlaceholderHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().placeholder }" placeholder="Saisissez une valeur">
          </form>
          <form class="uk-form uk-width-1-1">
            <fieldset>
              <div class="uk-form-row uk-width-1-1">
                <span class="uk-text-bold">Options</span><br>
                <span class="uk-text-bold">Minimum</span><br>
                <input onchange={ changeMinimumHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().minimum }" placeholder="Saisissez une valeur">
                <span class="uk-text-bold">Maximum</span><br>
                <input onchange={ changeMaximumHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().maximum }" placeholder="Saisissez une valeur">
              </div>
            </fieldset>
          </form>
        </div>
      </div>

    </div>

  </div>

  <script>

    var self = this;

    self.on("mount", function() {
      facade.actions.campaigns.selectCampaignItem(riot.router.current.params.urn).then(function() {
        return facade.actions.campaigns.selectCampaign(facade.getCurrentCampaignItem().urnCampaign);
      })
      .catch(function(error) {
        riot.route("/homepage");
      });
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    });

    self.on("update", function() {
      $(document).arrive(".uk-nestable", self.nestableArrivedHandler);
    })

    self.nestableArrivedHandler = function() {
      facade.debugHTML("entity.tag: %s", "nestableArrivedHandler");
      UIkit.nestable($(".uk-nestable"));
    };

    changeCampaignItemsChoicesOrderHandler(e) {
      var i = 1;
      lodash.map($(".uk-nestable li .urnCampaignItemChoice"), function(item) {
        var item = lodash.find(facade.getCurrentCampaignItem().choices, {urn: item.value});
        item.position = i;
        i = i + 1;
      });
      self.update();
    };

    changePlaceholderHandler(e) {
      facade.getCurrentCampaignItem().placeholder = e.currentTarget.value;
    }

    changeLabelHandler(e) {
      facade.getCurrentCampaignItem().label = e.currentTarget.value;
    }

    changeMinimumHandler(e) {
      facade.getCurrentCampaignItem().minimum = e.currentTarget.value;
    };

    changeMaximumHandler(e) {
      facade.getCurrentCampaignItem().maximum = e.currentTarget.value;
    };

    changeDescriptionHandler(e) {
      facade.getCurrentCampaignItem().description = e.currentTarget.value;
    };

    changeQuestionHandler(e) {
      facade.getCurrentCampaignItem().question = e.currentTarget.value;
    };

    changeTagsHandler(e) {
      facade.getCurrentCampaignItem().tags = e.currentTarget.value;
    };

    updateCampaignItemHandler(e) {
      facade.actions.campaigns.updateItem(facade.getCurrentCampaignItem());
    };

    createCampaignItemChoiceHandler(e) {
        facade.actions.campaigns.createCampaignItemChoice()
          .then(facade.actions.campaigns.selectCampaignItem(facade.getCurrentCampaignItem().urn))
    }

    changeMultipleSelectionsHandler(e) {
      facade.getCurrentCampaignItem().multipleSelections = e.currentTarget.checked;
    };

    changeRandomizeHandler(e) {
      facade.getCurrentCampaignItem().randomize = e.currentTarget.checked;
    };

    changeRequiredHandler(e) {
      facade.getCurrentCampaignItem().required = e.currentTarget.checked;
    };

    updateCampaignItemsChoicesHandler(e) {
      lodash.map(facade.getCurrentCampaignItem().choices, function(item) {
        facade.actions.campaigns.updateItemChoice(item);
      });
    };

  </script>

  <style scoped>
    .uk-container {
      width: 960px;
    }
  </script>

</campaign-item>
