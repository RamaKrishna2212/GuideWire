package gw.api.address.formatter.i18n

uses gw.api.address.AddressFillable
uses gw.api.address.formatter.AddressFormatterParameters
uses gw.api.address.formatter.CountryAddressFormatUtil
uses gw.api.address.formatter.CountryAddressFormatter

@Export
class DEAddressFormatter implements CountryAddressFormatter {

  override function singleLine(addressFillable : AddressFillable, parameters : AddressFormatterParameters) : String {
    var wrapper = CountryAddressFormatUtil.getCountryAddressWrapper(addressFillable, parameters)
    return CountryAddressFormatUtil
        .getCountryAddressFormatBuilder(wrapper.AddressLine1)
        .comma(wrapper.AddressLine2)
        .comma(wrapper.AddressLine3)
        .comma(
            CountryAddressFormatUtil
                .getCountryAddressFormatBuilder(wrapper.PostalCode)
                .space(wrapper.City)
        )
        .comma(wrapper.Country)
        .build()
  }

  override function multipleLine(addressFillable : AddressFillable, parameters : AddressFormatterParameters) : String {
    var wrapper = CountryAddressFormatUtil.getCountryAddressWrapper(addressFillable, parameters)
    return CountryAddressFormatUtil
        .getCountryAddressFormatBuilder(wrapper.AddressLine1)
        .newLine(wrapper.AddressLine2)
        .newLine(wrapper.AddressLine3)
        .newLine(
            CountryAddressFormatUtil
                .getCountryAddressFormatBuilder(wrapper.PostalCode)
                .space(wrapper.City)
        )
        .newLine(wrapper.Country)
        .build()
  }
}