package gw.api.address.formatter

uses gw.api.address.AddressFillable
uses gw.api.address.AddressFillableExtension

@Export
class FRCountryAddressWrapper implements CountryAddressWrapper {

  private var _wrapper : CountryAddressWrapper
  private var _address : AddressFillableExtension

  construct(address : AddressFillable, params : AddressFormatterParameters) {
    _wrapper = CountryAddressFormatUtil.getCountryAddressWrapper(address, params)
    _address = address as AddressFillableExtension
  }

  override property get AddressLine1() : String {
    return _wrapper.AddressLine1
  }

  override property get AddressLine2() : String {
    return _wrapper.AddressLine2
  }

  override property get AddressLine3() : String {
    return _wrapper.AddressLine3
  }

  override property get City() : String {
    return _wrapper.City
  }

  override property get PostalCode() : String {
    return _wrapper.PostalCode
  }

  override property get State() : String {
    return _wrapper.State
  }

  override property get StateAbbreviation() : String {
    return _wrapper.StateAbbreviation
  }

  override property get Country() : String {
    return _wrapper.Country
  }

  override property get County() : String {
    return _wrapper.County
  }

  override function getFieldValue(fieldName : String, fieldValue : Object) : Object {
    return _wrapper.getFieldValue(fieldName, fieldValue)
  }

  override function isVisible(fieldName : String) : boolean {
    return _wrapper.isVisible(fieldName)
  }

  property get CEDEX() : boolean {
    return getFieldValue("CEDEX", _address.CEDEX) as Boolean
  }

  property get CEDEXBureau() : String {
    return getFieldValue("CEDEXBureau", _address.CEDEXBureau) as String
  }

  property get CEDEXLine() : String {
    var cedexLine = ""
    if (CEDEX) {
      cedexLine += "CEDEX"
      var cedexBureau = CEDEXBureau
      if (cedexBureau?.HasContent) {
        cedexLine += " ${cedexBureau}"
      }
    }
    return cedexLine
  }
}