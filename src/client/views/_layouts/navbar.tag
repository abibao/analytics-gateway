<navbar>

  <nav if={ facade.getLoading()===false } class="tm-navbar uk-navbar uk-navbar-attached">
    <div class="uk-container uk-container-center">
      <a class="uk-navbar-brand" href="/#homepage">Abibao dashboard</a>
      <div class="uk-navbar-content uk-navbar-flip">
        <button if={ facade.stores.auth.authentified()===true } onclick={ logoutHandler } class="uk-button uk-button-danger">Logout</button>
        <button if={ facade.stores.auth.authentified()===false } class="uk-button uk-button-success">Login</button>
      </div>
    </div>
  </nav>
  
  <br>
  
  <script>
  
    self = this;
    
    logoutHandler(e) {
      facade.actions.auth.logout();
    }
  
  </script>
  
  <style scoped>
    .tm-navbar {
        position: relative;
    }
    .tm-navbar {
        padding: 15px 0;
        border: none;
        background: #000000;
    }
    .uk-container {
      width: 960px;
    }
    .uk-navbar-brand, .uk-navbar-content, .uk-navbar-toggle {
      color: #ffffff;
      text-shadow: none;
      padding: 0;
    }
  </style>
  
</navbar>