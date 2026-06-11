package gw.api.address.formatter

uses gw.api.address.AddressFillable
uses gw.api.address.AddressFillableExtension

@Export
class JPCountryAddressWrapper implements CountryAddressWrapper {

  var _wrapper : CountryAddressWrapper
  var _address : AddressFillableExtension

  construct(address : AddressFillable, params : AddressFormatterParameters) {
    _wrapper = CountryAddressFormatUtil.getCountryAddressWrapper(address, params)
    _address = address as AddressFillableExtension
  }

  override property get AddressLine1() : String {
    var addressLine1Kanji = getFieldValue("AddressLine1", _address.AddressLine1Kanji) as String
    return firstNonEmpty(addressLine1Kanji, _wrapper.AddressLine1)
  }

  override property get AddressLine2() : String {
    var addressLine1Kanji = getFieldValue("AddressLine2", _address.AddressLine2Kanji) as String
    return firstNonEmpty(addressLine1Kanji, _wrapper.AddressLine2)
  }

  override property get AddressLine3() : String {
    return _wrapper.AddressLine3
  }

  override property get City() : String {
    var cityKanji = getFieldValue("City", _address.CityKanji) as String
    return firstNonEmpty(cityKanji, _wrapper.City)
  }

  override property get PostalCode() : String {
    var postalCode = _wrapper.PostalCode
    if (postalCode.HasContent) {
      return "〒${postalCode}"
    }
    return ""
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

  private function firstNonEmpty(value1 : String, value2 : String) : String {
    return value1.HasContent ? value1 : value2
  }
}