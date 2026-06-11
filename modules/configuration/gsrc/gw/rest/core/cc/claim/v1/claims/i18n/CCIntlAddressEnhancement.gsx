package gw.rest.core.cc.claim.v1.claims.i18n

uses entity.Address
uses gw.api.json.mapping.EventSafe

@Export
enhancement CCIntlAddressEnhancement : Address {
  /**
   * Handles setting CEDEX code and the flag.
   * @param code The CEDEX code
   */
  property set CEDEXCode(code: String) {
    if (code != null) {
      this.CEDEXBureau = code
      this.CEDEX = true
    }
  }

  @EventSafe // Just a wrapper around the CEDEXBureau column
  property get CEDEXCode() : String {
    return this.CEDEXBureau
  }
}
