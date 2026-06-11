package gw.api.address.formatter.i18n

uses gw.api.address.AddressFillable
uses gw.api.address.formatter.AddressFormatterParameters
uses gw.api.address.formatter.CountryAddressFormatUtil
uses gw.api.address.formatter.CountryAddressFormatter
uses gw.api.address.formatter.JPCountryAddressWrapper
uses gw.api.util.LocaleUtil

@Export
class JPAddressFormatter implements CountryAddressFormatter {

  override function singleLine(addressFillable : AddressFillable, parameters : AddressFormatterParameters) : String {
    var wrapper = new JPCountryAddressWrapper(addressFillable, parameters)
    if (LocaleUtil.CurrentLocaleType == LocaleType.TC_JA_JP) {
      return CountryAddressFormatUtil
          .getCountryAddressFormatBuilder(wrapper.PostalCode)
          .space(
              CountryAddressFormatUtil.getCountryAddressFormatBuilder(wrapper.State)
                  .append(wrapper.City)
                  .append(wrapper.AddressLine1)
                  .append(wrapper.AddressLine2)
          )
          .space(wrapper.Country)
          .build()
    } else {
      return CountryAddressFormatUtil
          .getCountryAddressFormatBuilder(wrapper.PostalCode)
          .space(
              CountryAddressFormatUtil.getCountryAddressFormatBuilder(wrapper.State)
                  .comma(wrapper.City)
                  .comma(wrapper.AddressLine1)
                  .comma(wrapper.AddressLine2)
          )
          .comma(wrapper.Country)
          .build()
    }
  }

  override function multipleLine(addressFillable : AddressFillable, parameters : AddressFormatterParameters) : String {
    var wrapper = new JPCountryAddressWrapper(addressFillable, parameters)
    return CountryAddressFormatUtil
        .getCountryAddressFormatBuilder(wrapper.PostalCode)
        .newLine(
            CountryAddressFormatUtil.getCountryAddressFormatBuilder(wrapper.State)
                .append(wrapper.City)
                .append(wrapper.AddressLine1)
        )
        .newLine(wrapper.AddressLine2)
        .newLine(wrapper.Country)
        .build()
  }
}