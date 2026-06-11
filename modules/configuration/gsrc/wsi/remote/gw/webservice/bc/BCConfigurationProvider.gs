package wsi.remote.gw.webservice.bc

uses gw.xml.ws.IWsiWebserviceConfigurationProvider
uses gw.xml.ws.WsdlConfig

uses javax.xml.namespace.QName

/**
 * Use this class to specify authentication for WSI web services that talk to BillingCenter.
 */
@Export
class BCConfigurationProvider implements IWsiWebserviceConfigurationProvider {

  override function configure(serviceName : QName, portName : QName, config : WsdlConfig)  {
    config.Guidewire.Authentication.Username = "su"
    config.Guidewire.Authentication.Password = "gw"
  }
}