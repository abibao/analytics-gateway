<homepage>

  <navbar> </navbar>

  <div if={ facade.getLoading()===false } class="uk-container uk-container-center uk-height-1-1">

    <h4>Les compagnies</h4>
    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2" each={ company in facade.stores.entities.companies }>
        <div class="uk-panel uk-panel-box">
          <h4 class="uk-panel-title uk-text-truncate"><a href="/#entities/{ company.urn }">{ company.name }</a></h4>
          <img class="uk-thumbnail uk-float-left" style="margin: 0.25rem" src={ company.icon } alt="" width="80" height="80">
            <div class="uk-float-left uk-width-1-2" style="margin: 0.25rem">
              <span class="uk-text-truncate"><span class="uk-text-bold">contact:</span> <a class="uk-text-truncate" href="mailto:{ charity.contact }">{ company.contact }</a></span><br>
              <span class="uk-text-truncate"><span class="uk-text-bold">url:</span> <a class="uk-text-truncate" href="{ charity.url }">{ company.url }</a></span>
            </div>
        </div>
      </div>
    </div>
    
    <h4>Les associations</h4>
    <div class="uk-grid uk-grid-medium">
      <div class="uk-width-1-2" each={ charity in facade.stores.entities.charities }>
        <div class="uk-panel uk-panel-box" style="margin-bottom: 0.25rem">
          <h4 class="uk-panel-title uk-text-truncate"><a href="/#charities/{ charity.urn }">{ charity.name }</a></h4>
          <img class="uk-thumbnail uk-float-left" style="margin: 0.25rem" src={ charity.icon } alt="" width="80" height="80">
          <div class="uk-float-left uk-width-1-2" style="margin: 0.25rem">
            <span class="uk-text-truncate"><span class="uk-text-bold">contact:</span> <a class="uk-text-truncate" href="mailto:{ charity.contact }">{ charity.contact }</a></span><br>
            <span class="uk-text-truncate"><span class="uk-text-bold">url:</span> <a class="uk-text-truncate" href="{ charity.url }">{ charity.url }</a></span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script>

    var self = this;

    self.disabled = '';

    self.on("mount", function() {
      facade.initialize();
    });

    self.on("update", function() {
      (facade.getLoading()===false) ? self.disabled = '' : self.disabled = 'disabled';
    });

  </script>

  <style scoped>
    .uk-container {
      width: 960px;
    }
  </style>

</homepage>
