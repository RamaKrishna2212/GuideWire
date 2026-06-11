package gw.api.address

uses gw.api.address.formatter.AddressFormatterParameters
uses gw.api.address.formatter.CountryAddressDefaultFormatter
uses gw.api.address.formatter.CountryAddressFormatUtil
uses gw.api.admin.BaseAdminUtil
uses gw.api.locale.DisplayKey
uses gw.lang.Deprecated

/**
 * The address formatter is built to abstract out address display for internationalization.
 * When address columns are changed, this formatter and its usages (which may omit certain fields)
 * should be updated accordingly.
 */
@Export
class AddressFormatter extends AddressFillableExtensionImpl implements AddressFormatterParameters {
  /**
   * The address formatter is built to abstract out address display for internationalization.
   * When address columns are changed, this formatter and its usages (which may omit certain fields)
   * should be updated accordingly.
   */
  construct() { }

  /**
   * Format an address as text, including all fields.  The IncludeCountry and IncludeCounty properties can hide
   * those two fields.
   *
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   */
  public function format(delimiter : String) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(this, delimiter)
  }

  /**
   * Format an address as text, including all fields.  The IncludeCountry and IncludeCounty properties can hide
   * those two fields.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   */
  public function format(address : AddressFillable, delimiter : String) : String {    
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(address, delimiter)
  }

  /**
   * Format an address as text.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   * @param fields         The set of fields to include in the address.
   */
  public function format(address : AddressFillable, delimiter : String, fields : Set<AddressOwnerFieldId>) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return fields.contains(fieldId) }
    return internalFormat(address, delimiter)
  }

  /**
   * Format an address as text.
   * 
   * @param address        The address to format.
   * @param delimiter      The delimiter used to separate "lines" of the address.  Typical settings are "\n" and ", ".
   * @param addressOwner   The AddressOwner that specifies what fields to include in the address.
   */
  public function format(address : AddressFillable, delimiter : String, addressOwner : AddressOwner) : String {
    _filter = \ fieldId : AddressOwnerFieldId -> { return addressOwner.isVisible(fieldId) }
    return internalFormat(address, delimiter)
  }
  
  /**
   * Format an address as text using fields in AddressFormatter, which the caller should set before calling addressString().
   * 
   * @param delimiter      The address components will be separated by the delimiter.  If the delimiter is a
   *                       comma without any other whitespace, then a space is added after the comma.
   * @param includeCountry If true, then include the country in the string.  If the delimiter is a
   *                       line feed, the country's DisplayName is used, otherwise, the country code is used.
   * @param includeCounty  If true, then include the county in the string.
   */
  @Deprecated("Please use one of the format() methods")
  function addressString(delimiter : String, aIncludeCountry : boolean, aIncludeCounty : boolean) : String {
    IncludeCountry = aIncludeCountry
    IncludeCounty = aIncludeCounty
    if (delimiter == ",") {
      delimiter = ", "
    }
    _filter = \ fieldId : AddressOwnerFieldId -> { return true }
    return internalFormat(this, delimiter)    
  }

  /**
   * If false, do not include the county in the formatted address.
   */
  var _includeCounty : boolean as IncludeCounty = false  

  /**
   * If false, do not include the country in the formatted address.
   */
  var _includeCountry : boolean as IncludeCountry = true
  
  /**
   * The delimiter to use between city and state (defaults to ", ")
   */
  var _cityStateDelimiter : String as CityStateDelimiter = ", "
  
  /**
   * If true, use the Country code instead of the Country's display name.
   * By convention, the country code is the 2 character ISO-standard country code.
   * (defaults to false)
   */
  var _abbreviateCountry : boolean as AbbreviateCountry = false

  /**
   * After calling one of the formatting routines, returns true if the address is empty
   */
  var _empty : boolean as readonly IsEmpty = false
  
  //---------- private methods --------------
  
  private var _filter : block(fieldId : AddressOwnerFieldId) : boolean 
  private var _addrCountry : Country
  
  private function isVisible(fieldId : AddressOwnerFieldId) : boolean {
    if (fieldId == null) {
      return true
    }

    if (  ((not IncludeCounty) and fieldId == AddressOwnerFieldId.COUNTY)
        or (not IncludeCountry) and fieldId == AddressOwnerFieldId.COUNTRY) {
      return false
    }

    return AddressCountrySettings.getSettings(_addrCountry).VisibleFields.contains(fieldId)
      and _filter(fieldId)
  }

  private function internalFormat(address : AddressFillable, delimiter : String) : String {
    if (address == null) {
      return null
    }

    var addr : AddressFillableExtension
    if (address typeis AddressFillableExtension) {
      addr = address
    } else if (address typeis AddressAutofillable) {
      addr = new AddressAutofillableDelegate(address)
    } else {
      throw new IllegalArgumentException()
    }

    var defaultCountry = BaseAdminUtil.getDefaultCountry()
    _addrCountry = addr.Country != null ? addr.Country : defaultCountry
    var isMultipleLine = delimiter == "\n"
    var addressFormatter = CountryAddressFormatUtil.getCountryAddressFormatter(_addrCountry)
    var retString = isMultipleLine ? addressFormatter.multipleLine(addr, this) : addressFormatter.singleLine(addr, this)
    _empty = retString.length() == 0
    if (_empty) {
      retString = DisplayKey.get("DisplayName.EmptyAddress")
    }

    return retString
  }

  override function isVisible(fieldName : String) : boolean {
    return isVisible(AddressOwnerFieldId.valueOf(fieldName))
  }

  override function includeCountry() : boolean {
    return IncludeCountry
  }

  override function includeCounty() : boolean {
    return IncludeCounty
  }

  override function abbreviateCountry() : boolean {
    return AbbreviateCountry
  }

  override property get DefaultCountry() : Country {
    return BaseAdminUtil.getDefaultCountry();
  }
}
