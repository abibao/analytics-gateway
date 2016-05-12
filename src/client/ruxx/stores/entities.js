function EntitiesStore () {
  var self = this
  riot.observable(self)

  self.charities = []
  self.companies = []

  self.selectedEntity = {}
  self.selectedEntityCampaigns = []
}
