<campaign-item-choice>

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
                <span class="uk-text-bold">Question</span><br>
                <input class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItem().question }" disabled>
                <span class="uk-text-bold">Préfixe</span><br>
                <input onchange={ changePrefixHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().prefix }">
                <span class="uk-text-bold">Suffixe</span><br>
                <input onchange={ changeSuffixHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().suffix }">
                <span class="uk-text-bold">Texte</span><br>
                <input onchange={ changeTextHandler } class="uk-width-1-1" type="text" value="{ facade.getCurrentCampaignItemChoice().text }">
              </div>
            </fieldset>
            <br>
            <button type="button" onclick={ updateCampaignItemChoiceHandler } class="uk-width-1-4 uk-button uk-button-success uk-button-large blue-grey darken-2">Sauver</button>
            <a href="/#campaigns/{ facade.getCurrentCampaign().urn }" class="uk-button uk-button-primary uk-button-large uk-float-right brown darken-2"><i class="uk-icon-backward"></i>Campagne</a>
            <a href="/#campaigns-items/{ facade.getCurrentCampaignItem().urn }" class="uk-button uk-button-primary uk-button-large uk-float-right brown darken-2 uk-margin-small-right"><i class="uk-icon-backward"></i>Question</a>
          </form>
        </div>
      </div>

    </div>

  </div>

  <script>

    var self = this;

    self.on("mount", function() {
      facade.actions.campaigns.selectCampaignItemChoice(riot.router.current.params.urn).then(function() {
        return facade.actions.campaigns.selectCampaign(facade.getCurrentCampaignItemChoice().urnCampaign).then(function() {
          return facade.actions.campaigns.selectCampaignItem(facade.getCurrentCampaignItemChoice().urnItem);
        })
      })
      .catch(function(error) {
        riot.route("/homepage");
      });
    });
    
    changePrefixHandler(e) {
      facade.getCurrentCampaignItemChoice().prefix = e.currentTarget.value;
    }

    changeSuffixHandler(e) {
      facade.getCurrentCampaignItemChoice().suffix = e.currentTarget.value;
    }

    changeTextHandler(e) {
      facade.getCurrentCampaignItemChoice().text = e.currentTarget.value;
    }

    updateCampaignItemChoiceHandler(e) {
      facade.actions.campaigns.updateItemChoice(facade.getCurrentCampaignItemChoice());
    }

  </script>

  <style scoped>
    .uk-container {
      width: 960px;
    }
  </script>

</campaign-item-choice>
