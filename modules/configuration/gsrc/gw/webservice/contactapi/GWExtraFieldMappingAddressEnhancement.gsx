package gw.webservice.contactapi

enhancement GWExtraFieldMappingAddressEnhancement : Address {

  property get ExtraFieldMapping() : String {
    return ExtraFieldIntegrationUtil.encodeConfig(this.Country)
  }

}
